import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum InventoryItemType {
  Feed     = 'feed',
  Medicine = 'medicine',
}

export class CreateInventoryDto {
  @IsString()
  item_name: string;

  @IsEnum(InventoryItemType)
  type: InventoryItemType;

  @IsNumber()
  @Min(0)
  purchase_qty: number;

  @IsString()
  unit: string;

  @IsNumber()
  @Min(0)
  price_per_unit: number;

  @IsNumber()
  @Min(0)
  total_cost: number;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsDateString()
  purchase_date: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
