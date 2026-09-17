import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAll() {
    return this.postsService.findAll();
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.sub, dto);
  }

  @Post(':id/like')
  like(@CurrentUser() user: { sub: string }, @Param('id') postId: string) {
    return this.postsService.toggleLike(user.sub, postId);
  }

  @Post(':id/comment')
  comment(
    @CurrentUser() user: { sub: string },
    @Param('id') postId: string,
    @Body('comment') comment: string,
  ) {
    return this.postsService.addComment(user.sub, postId, comment);
  }
}
