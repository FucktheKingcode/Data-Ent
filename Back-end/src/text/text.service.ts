import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/users.schema';
import { decryptData } from 'src/utils/decryption';
import { encryptField } from 'src/utils/ecryption';
import { TextDto } from './dto/text.dto';
import { ec } from 'elliptic';
import { findIvAndKey } from 'src/utils/ivandkey';
const ethec = new ec('secp256k1');

@Injectable()
export class TextService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async textEncrypt(userId: string, TextDto: TextDto): Promise<string> {
    const { Text, password } = TextDto;
    const user = await this.userModel.findById(userId);
    // iv and Key
    const keyEC = ethec.keyFromPrivate(password);
    const { iv, key } = await findIvAndKey(user, keyEC);

    // Implement the 'encryptField' function to encrypt the file data
    const TextEnt = encryptField(Buffer.from(Text), iv, key).toString('base64');
    return TextEnt;
  }

  async textDecrypt(userId: string, TextDto: TextDto): Promise<string> {
    const user = await this.userModel.findById(userId);
    const { Text, password } = TextDto;
    // iv and Key
    const keyEC = ethec.keyFromPrivate(password);
    const { iv, key } = await findIvAndKey(user, keyEC);
    // Implement the 'encryptField' function to encrypt the file data
    const TextEnt = decryptData(Text, iv, key);
    return TextEnt;
  }
}
