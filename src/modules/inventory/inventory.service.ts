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

    // 4. Map usages by inventory item & calculate current stock from transactions
    return items.map((item) => {
      const usages = item.type === 'feed' ? (feedUsages || []) : (medicineUsages || []);
      const filtered = usages.filter((u) => u.inventory_id === item.id);

      // Group by tank_id and sum quantity
      const tankMap = new Map<string, number>();
      let totalUsed = 0;
      for (const u of filtered) {
        const tank = u.tank_id || 'Unknown';
        const qty = Number(u.quantity) || 0;
        totalUsed += qty;
        tankMap.set(tank, (tankMap.get(tank) || 0) + qty);
      }

      const used_by_tanks = Array.from(tankMap.entries()).map(([tankName, qty]) => ({
        tank_name: tankName,
        quantity: qty,
      }));

      // Calculate current live stock directly from transactions
      let calculatedRemaining = Number(item.purchase_qty);
      if (item.type === 'feed' && item.unit && item.unit.toLowerCase().includes('bag')) {
        let bagSize = 25;
        if (item.notes) {
          const match = item.notes.match(/\[bag_size:\s*([0-9.]+)\s*(?:kg)?\]/i);
          if (match && match[1]) bagSize = Number(match[1]) || 25;
        }
        calculatedRemaining = Math.max(0, Number(item.purchase_qty) - (totalUsed / bagSize));
      } else {
        calculatedRemaining = Math.max(0, Number(item.purchase_qty) - totalUsed);
      }
      calculatedRemaining = Math.round(calculatedRemaining * 100) / 100;

      // Sync database remaining_qty if it drifted
      if (Math.abs(Number(item.remaining_qty) - calculatedRemaining) > 0.01) {
        getSupabaseClient()
          .from('inventory')
          .update({ remaining_qty: calculatedRemaining })
          .eq('id', item.id)
          .then();
      }

      return {
        ...item,
        remaining_qty: calculatedRemaining,
        used_by_tanks,
      };
    });
  }

  async getStockLedger(userId: string, inventoryId?: string) {
    let invQuery = getSupabaseClient()
      .from('inventory')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'feed');

    if (inventoryId) {
      invQuery = invQuery.eq('id', inventoryId);
    }

    const { data: items, error: invError } = await invQuery;
    if (invError) throw new InternalServerErrorException(invError.message);

    let feedQuery = getSupabaseClient()
      .from('feed')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .order('created_at', { ascending: true });

    if (inventoryId) {
      feedQuery = feedQuery.eq('inventory_id', inventoryId);
    }

    const { data: feeds, error: feedError } = await feedQuery;
    if (feedError) throw new InternalServerErrorException(feedError.message);

    // Group dates and build chronological bank-statement ledger
    const itemMap = new Map<string, any>();
    for (const item of items || []) {
      itemMap.set(item.id, item);
    }

    const allDates = new Set<string>();
    for (const it of items || []) {
      if (it.purchase_date) allDates.add(it.purchase_date.substring(0, 10));
    }
    for (const f of feeds || []) {
      if (f.date) allDates.add(f.date.substring(0, 10));
    }

    const sortedDates = Array.from(allDates).sort();

    const ledger: any[] = [];
    for (const targetDate of sortedDates) {
      for (const item of items || []) {
        let bagSize = 25;
        if (item.notes) {
          const match = item.notes.match(/\[bag_size:\s*([0-9.]+)\s*(?:kg)?\]/i);
          if (match && match[1]) bagSize = Number(match[1]) || 25;
        }

        const isBagUnit = (item.unit || '').toLowerCase().includes('bag');
        const itemPurchasedKg = isBagUnit ? Number(item.purchase_qty) * bagSize : Number(item.purchase_qty);

        // Matching feeds for this item
        const itemFeeds = (feeds || []).filter(
          (f) => f.inventory_id === item.id || (f.feed_name || '').toLowerCase().trim() === (item.item_name || '').toLowerCase().trim()
        );

        // Determine effective purchase start date
        let effectiveDate = (item.purchase_date || '').substring(0, 10);
        for (const f of itemFeeds) {
          const fDate = (f.date || '').substring(0, 10);
          if (fDate && fDate < effectiveDate) {
            effectiveDate = fDate;
          }
        }

        // Purchases strictly before target date
        let totalPurchasedBefore = effectiveDate < targetDate ? itemPurchasedKg : 0;
        let purchasedToday = effectiveDate === targetDate ? itemPurchasedKg : 0;
        let totalPurchasedUpTo = effectiveDate <= targetDate ? itemPurchasedKg : 0;

        // Usages strictly before target date
        let usedBefore = 0;
        let usedToday = 0;
        const todayEntries: any[] = [];

        for (const f of itemFeeds) {
          const fDate = (f.date || '').substring(0, 10);
          const qty = Number(f.quantity) || 0;
          if (fDate < targetDate) {
            usedBefore += qty;
          } else if (fDate === targetDate) {
            usedToday += qty;
            todayEntries.push(f);
          }
        }

        if (purchasedToday === 0 && usedToday === 0 && totalPurchasedUpTo === 0) {
          continue; // No activity or stock on this date
        }

        const totalUsedUpTo = usedBefore + usedToday;
        const openingKg = totalPurchasedBefore > 0 ? Math.max(0, totalPurchasedBefore - usedBefore) : purchasedToday;
        const closingKg = Math.max(0, totalPurchasedUpTo - totalUsedUpTo);

        const openingBags = bagSize > 0 ? openingKg / bagSize : 0;
        const usedBags = bagSize > 0 ? usedToday / bagSize : 0;
        const closingBags = bagSize > 0 ? closingKg / bagSize : 0;

        ledger.push({
          date: targetDate,
          inventory_id: item.id,
          item_name: item.item_name,
          unit: item.unit,
          feed_bag_size_kg: bagSize,
          opening_kg: Math.round(openingKg * 10) / 10,
          opening_bags: Math.round(openingBags * 10) / 10,
          used_kg: Math.round(usedToday * 10) / 10,
          used_bags: Math.round(usedBags * 10) / 10,
          closing_kg: Math.round(closingKg * 10) / 10,
          closing_bags: Math.round(closingBags * 10) / 10,
          transactions: todayEntries,
        });
      }
    }

    return ledger;
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
