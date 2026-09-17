import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
