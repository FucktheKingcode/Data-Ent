import { promisify } from 'util';
import { scrypt } from 'crypto';
import { User } from 'src/auth/schemas/users.schema';
import { decryptEC } from './decryption';
import { ec } from 'elliptic';

export async function findIvAndKey(tempObject: User, keyEC: ec.KeyPair) {
  const iv = Buffer.from(tempObject.password.slice(-16), 'binary');
  const coffeeSalt = tempObject.password.slice(-20, -16);
  // Encrypt file properties
  const keySecret = decryptEC(tempObject.keySecret, keyEC);
  const key = (await promisify(scrypt)(keySecret, coffeeSalt, 32)) as Buffer;

  return { iv, key };
}
