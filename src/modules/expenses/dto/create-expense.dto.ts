import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

enum ExpenseType {
  Medicine   = 'medicine',
  Labour     = 'labour',
  Electricity = 'electricity',
  Netting    = 'netting',
  Investment = 'investment',
}

export class CreateExpenseDto {
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  tank_id?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  inventory_id?: string;

  @IsString()
  @IsOptional()
  bill_url?: string;
}
