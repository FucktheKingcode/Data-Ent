import { Body, Controller, Get, Param } from '@nestjs/common';
import { TextService } from './text.service';
import { TextDto } from './dto/text.dto';

@Controller('text')
export class TextController {
  constructor(private textService: TextService) {}
  @Get(':id/ent')
  async textEncrypt(
    @Body() Text: TextDto,
    @Param('id') userId: string,
  ): Promise<string> {
    return this.textService.textEncrypt(userId, Text);
  }
  @Get(':id/dec')
  async textDecrypt(
    @Body() Text: TextDto,
    @Param('id') userId: string,
  ): Promise<string> {
    return this.textService.textDecrypt(userId, Text);
  }
}
