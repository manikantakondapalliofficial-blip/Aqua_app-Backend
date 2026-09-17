import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreateFeedDto } from './dto/create-feed.dto';

@Injectable()
export class FeedService {
  async findAllForUser(userId: string) {
    const { data, error } = await getSupabaseClient()
      .from('feed')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(userId: string, dto: CreateFeedDto) {
    const { data, error } = await getSupabaseClient()
      .from('feed')
      .insert({
        ...dto,
        user_id: userId,
      })
      .select()
      .single();
    
    if (error) throw new InternalServerErrorException(error.message);

    // If inventory_id is provided, automatically reduce the remaining quantity
    if (dto.inventory_id) {
      const { data: item, error: getErr } = await getSupabaseClient()
        .from('inventory')
        .select('remaining_qty')
        .eq('id', dto.inventory_id)
        .single();
      
      if (!getErr && item) {
        const newRemaining = Math.max(0, Number(item.remaining_qty) - Number(dto.quantity));
        await getSupabaseClient()
          .from('inventory')
          .update({ remaining_qty: newRemaining })
          .eq('id', dto.inventory_id);
      }
    }

    return data;
  }

  async updateStatus(userId: string, feedId: string, status: string) {
    const { data, error } = await getSupabaseClient()
      .from('feed')
      .update({ status })
      .eq('id', feedId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
