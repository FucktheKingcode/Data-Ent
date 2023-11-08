import { createCipheriv, randomBytes } from 'crypto';
import { User, UserDocument, iKeySecret } from 'src/auth/schemas/users.schema';
import { curve, ec } from 'elliptic';
import { hash } from 'bcrypt';
import { BN } from 'bn.js';
import { randomPositiveInteger } from './function';
import { findIvAndKey } from './ivandkey';

// ####################### Mã hóa KeySecret #######################
// #######################                  #######################
// #######################                  #######################
// #######################                  #######################
// Chọn đường cong elliptic (ví dụ: secp256k1)
const ethec = new ec('secp256k1');

// Hàm mã hóa thông điệp bằng mã hóa EC
export function encryptEC(message: string, key: ec.KeyPair): iKeySecret {
  // Tìm điểm G trong đường cong elliptic sinh ra từ khóa privateKey
  const G: curve.base.BasePoint = ethec.curve.g;
  // Mã hóa tin nhắn M thành 1 điểm trên đường con elliptic
  const Pm: curve.base.BasePoint = ethec.curve.point(0, new BN(message));
  // Sinh ra số nguyên dương k
  const k = new BN(randomPositiveInteger());

  const M: curve.base.BasePoint = G.mul(k); // Phép nhân giữa điểm G và số nguyên k
  const N: curve.base.BasePoint = Pm.add(key.getPublic().mul(k)); // Phép cộng giữa điểm Pm và điểm công khai của key
  // Điểm mật mã Cm
  const Cm: iKeySecret = {
    X: [M.getX().toString(), M.getY().toString()],
    Y: [N.getX().toString(), N.getY().toString()],
  };
  return Cm;
}

export async function encryptKeySecret(tempObject: User): Promise<User> {
  // Chuyển đổi cụm từ mật khẩu thành private key (số BigInt)
  const keySecret = new BN(randomBytes(24)).toString();
  const key = ethec.keyFromPrivate(tempObject.password);
  // Mã hóa trường keySecret
  tempObject.keySecret = encryptEC(keySecret, key);
  // Hash mật khẩu
  const iv = randomBytes(16);
  const coffeeSalt = randomBytes(4);

  tempObject.password = Buffer.concat([
    Buffer.from(await hash(tempObject.password, 10)),
    coffeeSalt,
    iv,
  ]).toString();

  return tempObject;
}

// ####################### Mã hóa mỗi Field #######################
// #######################                  #######################
// #######################                  #######################
// #######################                  #######################
// Encrypt Field
export function encryptField(
  field: Buffer,
  iv: Buffer,
  encryptionKey: Buffer,
): Buffer {
  const cipher = createCipheriv('aes-256-ctr', encryptionKey, iv);

  const encryptedText = Buffer.concat([
    cipher.update(field.toString()),
    cipher.final(),
  ]);

  return encryptedText;
}

// Mã hóa trường field trong User object
export async function encryptUserObjectWithOptions(
  tempObject: UserDocument,
  password: string,
  fieldsToEncrypt: any[], // Danh sách trường cần mã hóa
): Promise<UserDocument> {
  const keyEC = ethec.keyFromPrivate(password);
  const { iv, key } = await findIvAndKey(tempObject, keyEC);
  
  await Promise.all(
    fieldsToEncrypt.map(async (field) => {
      if (tempObject[field]) {
        const fieldBuffer = Buffer.from(tempObject[field].toString('base64'));
        const encryptedField = encryptField(fieldBuffer, iv, key);

        // Lưu trường đã mã hóa
        tempObject[field] = encryptedField.toString('base64');
      }
    }),
  );
  return tempObject;
}
