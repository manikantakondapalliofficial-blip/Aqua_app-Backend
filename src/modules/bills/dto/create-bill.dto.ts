import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBillDto {
  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  file_path: string;

  @IsString()
  @IsOptional()
  file_name?: string;

  @IsNumber()
  @IsOptional()
  file_size?: number;

  @IsString()
  @IsOptional()
  mime_type?: string;
}
