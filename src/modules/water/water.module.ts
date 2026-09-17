import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WaterController } from './water.controller';
import { WaterService } from './water.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [WaterController],
  providers: [WaterService],
})
export class WaterModule {}
