import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';

@UseGuards(JwtGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getAll(@CurrentUser() user: { sub: string }) {
    return this.feedService.findAllForUser(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateFeedDto) {
    return this.feedService.create(user.sub, dto);
  }

  @Put(':id/status')
  updateStatus(@CurrentUser() user: { sub: string }, @Param('id') id: string, @Body('status') status: string) {
    return this.feedService.updateStatus(user.sub, id, status);
  }
}
