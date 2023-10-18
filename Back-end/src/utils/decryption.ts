import { createDecipheriv } from 'crypto';
import { User, iKeySecret } from 'src/auth/schemas/users.schema';
import { findIvAndKey } from './ivandkey';
import { curve, ec } from 'elliptic';
import { BN } from 'bn.js';
const ethec = new ec('secp256k1');

// Function to decrypt data
export function decryptData(
  field: string,
  iv: Buffer,
  ENCRYPTION_KEY: Buffer,
): string {
  const decipher = createDecipheriv('aes-256-ctr', ENCRYPTION_KEY, iv);
  const decryptedText = Buffer.concat([
    decipher.update(Buffer.from(field, 'base64')),
    decipher.final(),
  ]);
  return decryptedText.toString();
}

// Hàm giải mã thông điệp EC
export function decryptEC(Cm: iKeySecret, key: ec.KeyPair): string {
  // Lấy điểm X từ điểm mật mã
  const M: curve.base.BasePoint = ethec.curve.point(
    new BN(Cm.X[0]),
    new BN(Cm.X[1]),
  );
  const N: curve.base.BasePoint = ethec.curve.point(
    new BN(Cm.Y[0]),
    new BN(Cm.Y[1]),
  );
  const Pm = N.add(M.mul(key.getPrivate()).neg());
  const message = Pm.getY().toString();
  return message;
}

export async function decryptUserObjectWithOptions(
  encryptedObject: User,
  fieldsToDecrypt: string[], // Danh sách trường cần giải mã
  password: string,
): Promise<User> {
  const keyEC = ethec.keyFromPrivate(password);
  // Tạo một đối tượng cipher để sử dụng lại
  const ivAndKey = await findIvAndKey(encryptedObject, keyEC);

  // Giải mã các trường được chọn
  await Promise.all(
    fieldsToDecrypt.map((field) => {
      if (encryptedObject['_doc'].hasOwnProperty(field)) {
        encryptedObject[field] = decryptData(
          encryptedObject[field],
          ivAndKey.iv,
          ivAndKey.key,
        );
      }
    }),
  );

  // Trả về đối tượng đã giải mã
  return encryptedObject;
}
