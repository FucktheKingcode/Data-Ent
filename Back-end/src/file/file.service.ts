import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/users.schema';
import { File } from './schemas/file.schema';
import { DeleteDto } from './dto/delete.dto';
import { DeleteManyDto } from './dto/deletemany.dto';
import { encryptField } from 'src/utils/ecryption';
import { decryptData } from 'src/utils/decryption';
import { ec } from 'elliptic';
import { findIvAndKey } from 'src/utils/ivandkey';
const ethec = new ec('secp256k1');

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async uploadFileEncrypt(
    file: Express.Multer.File,
    fileUserId: string,
    password: string,
  ): Promise<{ notiFication: string }> {
    try {
      if (!file) {
        throw new Error('File is missing');
      }
      // Get information user for decryption
      const user = await this.userModel.findById(fileUserId);
      // Encrypt file properties
      const keyEC = ethec.keyFromPrivate(password);
      const { iv, key } = await findIvAndKey(user, keyEC);
      // Implement the 'encryptField' function to encrypt the file data
      let filess = encryptField(Buffer.from(user.files), iv, key).toString(
        'base64',
      );
      const newFile = await this.fileModel.create({
        fileUserId,
        originalName: encryptField(
          Buffer.from(file.originalname),
          iv,
          key,
        ).toString('base64'),
        mimeType: encryptField(Buffer.from(file.mimetype), iv, key).toString(
          'base64',
        ),
        fileSize: encryptField(
          Buffer.from(file.size.toString()),
          iv,
          key,
        ).toString('base64'),
        fileBuffer: encryptField(
          Buffer.from(file.buffer.toString()),
          iv,
          key,
        ).toString('base64'),
      });

      // Save the document
      await newFile.save();

      // Thêm ID của file mới vào chuỗi user.files, cách nhau bởi dấu phẩy (,)
      filess = filess
        ? filess + ',' + newFile._id.toString()
        : newFile._id.toString();
      user.files = encryptField(Buffer.from(filess), iv, key).toString(
        'base64',
      );

      await user.save();

      return { notiFication: 'Successful' };
    } catch (error) {
      // Handle any potential errors
      console.error('Error during encryption and file saving:', error);
      throw error;
    }
  }

  async uploadFileNoneEncrypt(
    file: Express.Multer.File,
    fileUserId: string,
  ): Promise<{ notiFication: string }> {
    let notiFication: string;
    // Get file details
    const { originalname, mimetype, size, buffer } = file;

    const user = await this.userModel.findById(fileUserId);
    if (!user) {
      notiFication = "User doesn't exist";
    } else {
      // Save the file details to the database
      await this.fileModel.create({
        fileUserId,
        originalName: originalname,
        mimeType: mimetype,
        fileSize: size,
        fileBuffer: buffer.toString(), // Save buffer as a Base64 string
      });
      notiFication = 'Successful';
    }

    return { notiFication };
  }

  // READ
  async readFile(fileId: string, fileUserId: string): Promise<object> {
    const file = await this.fileModel.findById(fileId);

    if (!file || file.fileUserId !== fileUserId) {
      throw new NotFoundException('File not found');
    }

    // Convert the file document to the desired JSON object
    const fileObject = {
      fieldname: 'file',
      originalname: file.originalName,
      encoding: '7bit',
      mimetype: file.mimeType,
      fileSize: file.fileSize,
      buffer: Buffer.from(file.fileBuffer, 'base64'), // Convert Base64 string back to Buffer
    };

    return fileObject;
  }

  async readFileEnt(
    fileId: string,
    fileUserId: string,
    password: string,
  ): Promise<object> {
    const encryptFile = await this.fileModel.findById(fileId);
    const user = await this.userModel.findById(fileUserId);

    if (!encryptFile || encryptFile.fileUserId !== fileUserId) {
      throw new NotFoundException('File not found');
    }

    // Encrypt file properties
    const keyEC = ethec.keyFromPrivate(password);
    const { iv, key } = await findIvAndKey(user, keyEC);

    const fileObject = {
      fieldname: 'file',
      originalname: decryptData(encryptFile.originalName, iv, key),
      encoding: '7bit',
      mimetype: decryptData(encryptFile.mimeType, iv, key),
      size: decryptData(encryptFile.fileSize, iv, key),
      buffer: Buffer.from(
        decryptData(encryptFile.fileBuffer, iv, key),
        'base64',
      ),
    };

    return fileObject;
  }

  // DELETE

  async deleteFile(deleteDto: DeleteDto): Promise<{ notiFication: string }> {
    const { fileUserId, fileId } = deleteDto;
    const file = await this.fileModel.findById(fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.fileUserId !== fileUserId) {
      return { notiFication: "User doesn't exist" };
    }

    await this.fileModel.findByIdAndDelete(fileId);
    return { notiFication: 'Successful' };
  }

  async deleteManyFile(
    deleteManyDto: DeleteManyDto,
  ): Promise<{ notiFication: string }> {
    const { fileUserId } = deleteManyDto;

    // Delete all files with the specified fileUserId
    await this.fileModel.deleteMany({ fileUserId });

    return { notiFication: 'Successfully deleted all files with fileUserId.' };
  }
}
