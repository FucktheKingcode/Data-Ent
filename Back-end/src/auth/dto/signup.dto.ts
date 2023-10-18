import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsDateString()
  readonly dateOfBirth: string; // Thêm trường ngày sinh, sử dụng kiểu chuỗi cho ngày sinh

  @IsNotEmpty()
  @IsPhoneNumber('VN') // Sử dụng mã quốc gia 'VN' để kiểm tra số điện thoại Việt Nam
  readonly phoneNumber: string; // Thêm trường số điện thoại

  @IsNotEmpty()
  @IsEnum(['male', 'female', 'other']) // Hạn chế giá trị cho trường giới tính
  readonly gender: string; // Thêm trường giới tính
}
