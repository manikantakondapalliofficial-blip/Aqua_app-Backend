import { Controller, Post, Get, Query, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('uploads')
@UseGuards(JwtGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const filePath = await this.uploadsService.uploadFile(file);
    return { filePath };
  }

  @Get('signed-url')
  async getSignedUrl(@Query('path') path: string) {
    if (!path) {
      throw new BadRequestException('No path provided');
    }
    const signedUrl = await this.uploadsService.getSignedUrl(path);
    return { url: signedUrl };
  }
}
