import { Injectable } from '@nestjs/common';
import { FieldDto } from './dto/field.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/users.schema';
import { encryptUserObjectWithOptions } from 'src/utils/ecryption';
import { decryptUserObjectWithOptions } from 'src/utils/decryption';
import { UserModule } from './user.module';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}
  // Mã hóa từng field
  // #################
  async encryptFieldUser(fieldDto: FieldDto) {
    const { email, field, password } = fieldDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Xử lý nếu không tìm thấy người dùng
      return null;
    }
    console.log(user)
    // Cập nhật trường đã mã hóa
    await user.updateOne(
      await encryptUserObjectWithOptions(user, password, field),
    );

    return user._id;
  }
  // Giải mã từng field
  // #################
  async decryptFieldUser(fieldDto: FieldDto) {
    const { email, field, password } = fieldDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Xử lý nếu không tìm thấy người dùng
      return null;
    }
    // Cập nhật trường đã mã hóa
    await user.updateOne(
      await decryptUserObjectWithOptions(user, field, password),
    );

    return user._id;
  }
}
