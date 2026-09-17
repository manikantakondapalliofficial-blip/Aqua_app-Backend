import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  async findAllByUser(userId: string) {
    // 1. Fetch all inventory items
    const { data: items, error: itemsError } = await getSupabaseClient()
      .from('inventory')
      .select('*')
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });

    if (itemsError) {
      throw new InternalServerErrorException(itemsError.message);
    }

    if (!items || items.length === 0) {
      return [];
    }

    // 2. Fetch all feed usage records where inventory_id is in our inventory items
    const { data: feedUsages, error: feedError } = await getSupabaseClient()
      .from('feed')
      .select('inventory_id, tank_id, quantity')
      .eq('user_id', userId)
      .not('inventory_id', 'is', null);

    if (feedError) {
      throw new InternalServerErrorException(feedError.message);
    }

    // 3. Fetch all medicine usage records where inventory_id is in our inventory items
    const { data: medicineUsages, error: medicineError } = await getSupabaseClient()
      .from('expenses')
      .select('inventory_id, tank_id, quantity')
      .eq('user_id', userId)
      .eq('type', 'medicine')
      .not('inventory_id', 'is', null);

    if (medicineError) {
      throw new InternalServerErrorException(medicineError.message);
    }

    // 4. Map usages by inventory item
    return items.map((item) => {
      const usages = item.type === 'feed' ? (feedUsages || []) : (medicineUsages || []);
      const filtered = usages.filter((u) => u.inventory_id === item.id);

      // Group by tank_id and sum quantity
      const tankMap = new Map<string, number>();
      for (const u of filtered) {
        const tank = u.tank_id || 'Unknown';
        const qty = Number(u.quantity) || 0;
        tankMap.set(tank, (tankMap.get(tank) || 0) + qty);
      }

      const used_by_tanks = Array.from(tankMap.entries()).map(([tankName, qty]) => ({
        tank_name: tankName,
        quantity: qty,
      }));

      return {
        ...item,
        used_by_tanks,
      };
    });
  }

  async create(userId: string, dto: CreateInventoryDto) {
    const { data, error } = await getSupabaseClient()
      .from('inventory')
      .insert({
        ...dto,
        user_id: userId,
        remaining_qty: dto.purchase_qty, // Initially, remaining equals purchase quantity
      })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async update(id: string, dto: UpdateInventoryDto) {
    const { data, error } = await getSupabaseClient()
      .from('inventory')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async remove(id: string) {
    const { data, error } = await getSupabaseClient()
      .from('inventory')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }
}
