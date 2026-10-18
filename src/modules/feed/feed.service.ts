import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
    const targetDate = dto.date.substring(0, 10);
    const targetSlot = dto.time_slot.toLowerCase().trim();
    const targetTank = dto.tank_id.toLowerCase().trim();

    // 1. Fetch existing feed entries for user to check duplicate slot and max 4 entries
    const { data: existingFeeds, error: fetchErr } = await getSupabaseClient()
      .from('feed')
      .select('id, time_slot, date, tank_id')
      .eq('user_id', userId);

    if (fetchErr) {
      throw new InternalServerErrorException(fetchErr.message);
    }

    const sameDayAndTank = (existingFeeds || []).filter((f) => {
      const fDate = (f.date && f.date.length >= 10) ? f.date.substring(0, 10) : f.date;
      const fTank = (f.tank_id || '').toLowerCase().trim();
      return fDate === targetDate && fTank === targetTank;
    });

    // Enforce maximum 4 feed entries per pond per day
    if (sameDayAndTank.length >= 4) {
      throw new BadRequestException(
        `Maximum limit of 4 feed entries per day reached for ${dto.tank_id} on ${targetDate}.`
      );
    }

    // Enforce single entry per time slot per pond per day
    const alreadyEntered = sameDayAndTank.some(
      (f) => (f.time_slot || '').toLowerCase().trim() === targetSlot
    );

    if (alreadyEntered) {
      throw new ConflictException(
        `Feed for '${dto.time_slot}' has already been submitted for ${dto.tank_id} on ${targetDate}. Duplicate entries are prevented.`
      );
    }

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
