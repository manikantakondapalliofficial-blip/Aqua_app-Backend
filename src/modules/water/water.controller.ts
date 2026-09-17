import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { WaterService } from './water.service';
import { CreateWaterDto } from './dto/create-water.dto';

@UseGuards(JwtGuard)
@Controller('water')
export class WaterController {
  constructor(private readonly waterService: WaterService) {}

  @Get()
  getAll(@Query('tank_id') tankId: string) {
    return this.waterService.findByTank(tankId);
  }

  @Post()
  create(@Body() dto: CreateWaterDto) {
    return this.waterService.create(dto);
  }
}
