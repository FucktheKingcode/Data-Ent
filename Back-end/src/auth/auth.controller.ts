import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{
    token: string;
  }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  LogIn(@Body() LogInDto: SignInDto): Promise<{ token: string }> {
    return this.authService.LogIn(LogInDto);
  }
}
