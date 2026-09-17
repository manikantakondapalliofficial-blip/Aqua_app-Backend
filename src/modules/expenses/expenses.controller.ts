import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@UseGuards(JwtGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  getAll(@CurrentUser() user: { sub: string }) {
    return this.expensesService.findAllByUser(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(user.sub, dto);
  }

  @Put(':id/status')
  updateStatus(@CurrentUser() user: { sub: string }, @Param('id') id: string, @Body('status') status: string) {
    return this.expensesService.updateStatus(user.sub, id, status);
  }

  @Delete(':id')
  deleteExpense(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.expensesService.delete(user.sub, id);
  }
}
