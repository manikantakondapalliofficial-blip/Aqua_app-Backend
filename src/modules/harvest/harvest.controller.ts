import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';

@UseGuards(JwtGuard)
@Controller('harvest')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get()
  getAll(@CurrentUser() user: { sub: string }) {
    return this.harvestService.findAllForUser(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateHarvestDto) {
    return this.harvestService.create(user.sub, dto);
  }

  @Put(':id/status')
  updateStatus(@CurrentUser() user: { sub: string }, @Param('id') id: string, @Body('status') status: string) {
    return this.harvestService.updateStatus(user.sub, id, status);
  }
}
