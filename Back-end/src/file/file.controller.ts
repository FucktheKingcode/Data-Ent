import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { FileService } from './file.service';
import { DeleteDto } from './dto/delete.dto';
import { DeleteManyDto } from './dto/deletemany.dto';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  // CREATE
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload')
  async uploadFileNoneEncrypt(
    @Param('id') fileUserId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ notiFication: string }> {
    return this.fileService.uploadFileNoneEncrypt(file, fileUserId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload/encryption')
  async uploadFileEncrypt(
    @Param('id') fileUserId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('password') password: string,
  ): Promise<{ notiFication: string }> {
    return this.fileService.uploadFileEncrypt(file, fileUserId, password);
  }

  // READ
  @Get('/:id/:idfile/read')
  async readFile(
    @Param('id') fileUserId: string,
    @Param('idfile') fileId: string,
  ): Promise<object> {
    return this.fileService.readFile(fileId, fileUserId);
  }

  @Get('/:id/:idfile/read/ent')
  async readFileEnt(
    @Param('id') fileUserId: string,
    @Param('idfile') fileId: string,
    @Body('password') password: string,
  ): Promise<object> {
    return this.fileService.readFileEnt(fileId, fileUserId, password);
  }

  // UPDATE (Không có phương thức UPDATE trong đoạn code này)

  // DELETE
  @Delete('/delete')
  async deleteFile(
    @Body() deleteDto: DeleteDto,
  ): Promise<{ notiFication: string }> {
    return this.fileService.deleteFile(deleteDto);
  }

  @Delete('/delete/many')
  async deleteManyFile(
    @Body() deleteManyDto: DeleteManyDto,
  ): Promise<{ notiFication: string }> {
    return this.fileService.deleteManyFile(deleteManyDto);
  }
}
