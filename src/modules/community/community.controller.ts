import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(JwtGuard)
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  getPosts() {
    return this.communityService.getPosts();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: any) {
    const imagePath = await this.communityService.uploadImage(file);
    return { imagePath };
  }

  @Post('upload-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudio(@UploadedFile() file: any) {
    const audioPath = await this.communityService.uploadAudio(file);
    return { audioPath };
  }

  @Post()
  createPost(@CurrentUser() user: { sub: string }, @Body() dto: CreatePostDto) {
    return this.communityService.createPost(user.sub, dto);
  }

  @Post(':id/like')
  likePost(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.communityService.likePost(user.sub, id);
  }

  @Post(':id/comment')
  commentOnPost(@CurrentUser() user: { sub: string }, @Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.communityService.commentOnPost(user.sub, id, dto);
  }
}
