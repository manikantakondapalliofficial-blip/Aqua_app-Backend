import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  async findAllByUser(userId: string) {
    const { data, error } = await getSupabaseClient()
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const { data, error } = await getSupabaseClient()
      .from('expenses')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);

    // If type is medicine and inventory_id is provided, automatically reduce the remaining quantity
    if (dto.type === 'medicine' && dto.inventory_id) {
      const { data: item, error: getErr } = await getSupabaseClient()
        .from('inventory')
        .select('remaining_qty')
        .eq('id', dto.inventory_id)
        .single();
      
      if (!getErr && item) {
        const newRemaining = Math.max(0, Number(item.remaining_qty) - (Number(dto.quantity) || 0));
        await getSupabaseClient()
          .from('inventory')
          .update({ remaining_qty: newRemaining })
          .eq('id', dto.inventory_id);
      }
    }

    return data;
  }

  async updateStatus(userId: string, expenseId: string, status: string) {
    const { data, error } = await getSupabaseClient()
      .from('expenses')
      .update({ status })
      .eq('id', expenseId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async delete(userId: string, expenseId: string) {
    const { error } = await getSupabaseClient()
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', userId);
    if (error) throw new InternalServerErrorException(error.message);
    return { success: true };
  }
}
