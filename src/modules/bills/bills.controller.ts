import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';

@UseGuards(JwtGuard)
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  getAll(@CurrentUser() user: { sub: string }) {
    return this.billsService.findAllByUser(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateBillDto) {
    return this.billsService.create(user.sub, dto);
  }

  @Delete(':id')
  deleteBill(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.billsService.delete(user.sub, id);
  }
}
