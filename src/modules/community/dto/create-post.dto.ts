import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  imagePath?: string;

  @IsString()
  @IsOptional()
  audioPath?: string;
}
