import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TanksController } from './tanks.controller';
import { TanksService } from './tanks.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [TanksController],
  providers: [TanksService],
})
export class TanksModule {}
