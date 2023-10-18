import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { encryptKeySecret } from 'src/utils/ecryption';
import { SignInDto } from './dto/signin.dto';
import { User } from './schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, dateOfBirth, phoneNumber, gender } =
      signUpDto;

    // Tạo userE
    const userE: User = {
      name,
      email,
      password,
      keySecret: null, // chỉ đơn giản là null
      dateOfBirth,
      phoneNumber,
      gender,
      files: '',
    };

    // Sử dụng Promise.all để chạy encryptKeySecret và lưu dữ liệu người dùng
    await encryptKeySecret(userE);

    // Lưu vào database
    // Tạo token trước khi mã hóa keySecret
    const token = this.jwtService.sign({
      id: (await this.userModel.create(userE))._id,
    });

    // Trả về token ngay lập tức
    return { token };
  }

  async LogIn(LogInDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = LogInDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Lấy thông tin cho việc giải mã
    const ids = user.password.search(`${user._id}`);
    const passwordHash = user.password.slice(0, ids - 20);
    const isPasswordMatched = await compare(password, passwordHash);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Tạo token trước khi trả về
    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
