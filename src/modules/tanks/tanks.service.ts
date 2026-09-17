import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreateTankDto } from './dto/create-tank.dto';
import { UpdateTankDto } from './dto/update-tank.dto';

// Only this service touches Supabase — controller passes in data, gets back results.
@Injectable()
export class TanksService {
  async findAllByUser(userId: string) {
    const { data, error } = await getSupabaseClient()
      .from('tanks')
      .select('*')
      .eq('user_id', userId);
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(userId: string, dto: CreateTankDto) {
    console.log('Creating tank for user:', userId, 'with data:', dto);
    const { data, error } = await getSupabaseClient()
      .from('tanks')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async update(id: string, dto: UpdateTankDto) {
    const { data, error } = await getSupabaseClient()
      .from('tanks')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
