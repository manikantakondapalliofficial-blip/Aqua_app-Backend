import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule {}
