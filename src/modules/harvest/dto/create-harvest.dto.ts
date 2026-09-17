import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum HarvestType {
  Partial = 'partial',
  Full = 'full',
}

export class CreateHarvestDto {
  @IsString()
  tank_id: string;

  @IsNumber()
  @Min(0)
  harvest_qty: number;

  @IsNumber()
  @Min(0)
  count_per_kg: number;

  @IsNumber()
  @Min(0)
  price_per_kg: number;

  @IsNumber()
  @Min(0)
  total_revenue: number;

  @IsString()
  @IsOptional()
  buyer_name?: string;

  @IsEnum(HarvestType)
  harvest_type: HarvestType;

  @IsDateString()
  harvest_date: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
