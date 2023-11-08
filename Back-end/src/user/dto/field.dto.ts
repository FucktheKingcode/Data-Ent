import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FieldDto {
  //email
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;
  //field
  @IsNotEmpty()
  readonly field: any[];
  //password
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
