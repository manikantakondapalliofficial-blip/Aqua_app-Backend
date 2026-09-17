import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateTankDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  acres: number;

  @IsInt()
  @Min(0)
  seed_qty: number;

  @IsString()
  stocking_date: string;

  @IsNumber()
  @Min(0)
  seed_cost: number;
}
