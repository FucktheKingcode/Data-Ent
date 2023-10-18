import {
  Controller,
  // Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';

import { FieldDto } from './dto/field.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('encryptField')
  encryptedFieldUser(@Body() fieldDto: FieldDto) {
    return this.userService.encryptFieldUser(fieldDto);
  }

  @Post('decryptField')
  decryptedFieldUser(@Body() fieldDto: FieldDto) {
    return this.userService.decryptFieldUser(fieldDto);
  }
}
