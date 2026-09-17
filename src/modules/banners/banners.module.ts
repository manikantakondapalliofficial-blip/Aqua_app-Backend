import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [BannersController],
  providers: [BannersService]
})
export class BannersModule {}
