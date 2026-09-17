import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreateBillDto } from './dto/create-bill.dto';

@Injectable()
export class BillsService {
  async findAllByUser(userId: string) {
    const { data, error } = await getSupabaseClient()
      .from('bills')
      .select('*')
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(userId: string, dto: CreateBillDto) {
    const { data, error } = await getSupabaseClient()
      .from('bills')
      .insert({
        ...dto,
        uploaded_by: userId,
        organization_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID until organizations are implemented
      })
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async delete(userId: string, id: string) {
    const { error } = await getSupabaseClient()
      .from('bills')
      .delete()
      .eq('id', id)
      .eq('uploaded_by', userId);
    if (error) throw new InternalServerErrorException(error.message);
    return { success: true };
  }
}
