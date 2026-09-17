import { Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Param } from '@nestjs/common';
import { BannersService } from './banners.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('banners')
@UseGuards(JwtGuard)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  async getBanners() {
    return this.bannersService.getBanners();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadBanner(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const filePath = await this.bannersService.uploadBanner(file);
    return { filePath };
  }

  @Post('delete/:name')
  async deleteBanner(@Param('name') name: string) {
    await this.bannersService.deleteBanner(name);
    return { success: true };
  }
}
