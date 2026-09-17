import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

enum TimeSlot {
  Morning   = 'morning',
  Afternoon = 'afternoon',
  Evening   = 'evening',
  Night     = 'night',
}

export class CreateFeedDto {
  @IsString()
  tank_id: string;

  @IsString()
  feed_name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsEnum(TimeSlot)
  time_slot: TimeSlot;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  inventory_id?: string;
}
