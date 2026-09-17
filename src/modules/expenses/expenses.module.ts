import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
