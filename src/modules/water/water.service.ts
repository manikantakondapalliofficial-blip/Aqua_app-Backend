import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreateWaterDto } from './dto/create-water.dto';

@Injectable()
export class WaterService {
  async findByTank(tankId: string) {
    const { data, error } = await getSupabaseClient()
      .from('water_parameters')
      .select('*')
      .eq('tank_id', tankId)
      .order('date', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(dto: CreateWaterDto) {
    const { data, error } = await getSupabaseClient()
      .from('water_parameters')
      .insert(dto)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
