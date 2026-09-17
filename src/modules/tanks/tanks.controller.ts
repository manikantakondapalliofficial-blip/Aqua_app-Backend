import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TanksService } from './tanks.service';
import { CreateTankDto } from './dto/create-tank.dto';
import { UpdateTankDto } from './dto/update-tank.dto';

// JwtGuard protects ALL routes in this controller
@UseGuards(JwtGuard)
@Controller('tanks')
export class TanksController {
  constructor(private readonly tanksService: TanksService) {}

  @Get()
  getAll(@CurrentUser() user: { sub: string }) {
    return this.tanksService.findAllByUser(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateTankDto) {
    return this.tanksService.create(user.sub, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTankDto) {
    return this.tanksService.update(id, dto);
  }
}
