import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  audio_url?: string;
}
