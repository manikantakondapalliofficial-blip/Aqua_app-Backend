import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreateHarvestDto } from './dto/create-harvest.dto';

@Injectable()
export class HarvestService {
  async findAllForUser(userId: string) {
    const { data, error } = await getSupabaseClient()
      .from('harvests')
      .select('*, tanks(name)')
      .eq('user_id', userId)
      .order('harvest_date', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async create(userId: string, dto: CreateHarvestDto) {
    const { data, error } = await getSupabaseClient()
      .from('harvests')
      .insert({
        ...dto,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    // If it's a full harvest, set the tank's stock to 0
    if (dto.harvest_type === 'full') {
      const { error: tankError } = await getSupabaseClient()
        .from('tanks')
        .update({ stock: 0 })
        .eq('id', dto.tank_id);
      
      if (tankError) {
        console.error('Failed to reset tank stock after full harvest:', tankError);
      }
    }

    return data;
  }

  async updateStatus(userId: string, harvestId: string, status: string) {
    const { data, error } = await getSupabaseClient()
      .from('harvests')
      .update({ status })
      .eq('id', harvestId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
