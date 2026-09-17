import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateWaterDto {
  @IsString()
  tank_id: string;

  @IsNumber()
  ph: number;

  @IsNumber()
  oxygen: number;

  @IsNumber()
  salinity: number;

  @IsNumber()
  temperature: number;

  @IsDateString()
  date: string;
}
