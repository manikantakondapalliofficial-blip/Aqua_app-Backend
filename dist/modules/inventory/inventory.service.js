"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let InventoryService = class InventoryService {
    async findAllByUser(userId) {
        const { data: items, error: itemsError } = await (0, supabase_client_1.getSupabaseClient)()
            .from('inventory')
            .select('*')
            .eq('user_id', userId)
            .order('purchase_date', { ascending: false });
        if (itemsError) {
            throw new common_1.InternalServerErrorException(itemsError.message);
        }
        if (!items || items.length === 0) {
            return [];
        }
        const { data: feedUsages, error: feedError } = await (0, supabase_client_1.getSupabaseClient)()
            .from('feed')
            .select('inventory_id, tank_id, quantity')
            .eq('user_id', userId)
            .not('inventory_id', 'is', null);
        if (feedError) {
            throw new common_1.InternalServerErrorException(feedError.message);
        }
        const { data: medicineUsages, error: medicineError } = await (0, supabase_client_1.getSupabaseClient)()
            .from('expenses')
            .select('inventory_id, tank_id, quantity')
            .eq('user_id', userId)
            .eq('type', 'medicine')
            .not('inventory_id', 'is', null);
        if (medicineError) {
            throw new common_1.InternalServerErrorException(medicineError.message);
        }
        return items.map((item) => {
            const usages = item.type === 'feed' ? (feedUsages || []) : (medicineUsages || []);
            const filtered = usages.filter((u) => u.inventory_id === item.id);
            const tankMap = new Map();
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
            let calculatedRemaining = Number(item.purchase_qty);
            if (item.type === 'feed' && item.unit && item.unit.toLowerCase().includes('bag')) {
                let bagSize = 25;
                if (item.notes) {
                    const match = item.notes.match(/\[bag_size:\s*([0-9.]+)\s*(?:kg)?\]/i);
                    if (match && match[1])
                        bagSize = Number(match[1]) || 25;
                }
                calculatedRemaining = Math.max(0, Number(item.purchase_qty) - (totalUsed / bagSize));
            }
            else {
                calculatedRemaining = Math.max(0, Number(item.purchase_qty) - totalUsed);
            }
            calculatedRemaining = Math.round(calculatedRemaining * 100) / 100;
            if (Math.abs(Number(item.remaining_qty) - calculatedRemaining) > 0.01) {
                (0, supabase_client_1.getSupabaseClient)()
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
    async getStockLedger(userId, inventoryId) {
        let invQuery = (0, supabase_client_1.getSupabaseClient)()
            .from('inventory')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'feed');
        if (inventoryId) {
            invQuery = invQuery.eq('id', inventoryId);
        }
        const { data: items, error: invError } = await invQuery;
        if (invError)
            throw new common_1.InternalServerErrorException(invError.message);
        let feedQuery = (0, supabase_client_1.getSupabaseClient)()
            .from('feed')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: true })
            .order('created_at', { ascending: true });
        if (inventoryId) {
            feedQuery = feedQuery.eq('inventory_id', inventoryId);
        }
        const { data: feeds, error: feedError } = await feedQuery;
        if (feedError)
            throw new common_1.InternalServerErrorException(feedError.message);
        const itemMap = new Map();
        for (const item of items || []) {
            itemMap.set(item.id, item);
        }
        const allDates = new Set();
        for (const it of items || []) {
            if (it.purchase_date)
                allDates.add(it.purchase_date.substring(0, 10));
        }
        for (const f of feeds || []) {
            if (f.date)
                allDates.add(f.date.substring(0, 10));
        }
        const sortedDates = Array.from(allDates).sort();
        const ledger = [];
        for (const targetDate of sortedDates) {
            for (const item of items || []) {
                let bagSize = 25;
                if (item.notes) {
                    const match = item.notes.match(/\[bag_size:\s*([0-9.]+)\s*(?:kg)?\]/i);
                    if (match && match[1])
                        bagSize = Number(match[1]) || 25;
                }
                const isBagUnit = (item.unit || '').toLowerCase().includes('bag');
                const itemPurchasedKg = isBagUnit ? Number(item.purchase_qty) * bagSize : Number(item.purchase_qty);
                const itemFeeds = (feeds || []).filter((f) => f.inventory_id === item.id || (f.feed_name || '').toLowerCase().trim() === (item.item_name || '').toLowerCase().trim());
                let effectiveDate = (item.purchase_date || '').substring(0, 10);
                for (const f of itemFeeds) {
                    const fDate = (f.date || '').substring(0, 10);
                    if (fDate && fDate < effectiveDate) {
                        effectiveDate = fDate;
                    }
                }
                let totalPurchasedBefore = effectiveDate < targetDate ? itemPurchasedKg : 0;
                let purchasedToday = effectiveDate === targetDate ? itemPurchasedKg : 0;
                let totalPurchasedUpTo = effectiveDate <= targetDate ? itemPurchasedKg : 0;
                let usedBefore = 0;
                let usedToday = 0;
                const todayEntries = [];
                for (const f of itemFeeds) {
                    const fDate = (f.date || '').substring(0, 10);
                    const qty = Number(f.quantity) || 0;
                    if (fDate < targetDate) {
                        usedBefore += qty;
                    }
                    else if (fDate === targetDate) {
                        usedToday += qty;
                        todayEntries.push(f);
                    }
                }
                if (purchasedToday === 0 && usedToday === 0 && totalPurchasedUpTo === 0) {
                    continue;
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
    async create(userId, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('inventory')
            .insert({
            ...dto,
            user_id: userId,
            remaining_qty: dto.purchase_qty,
        })
            .select()
            .single();
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
    async update(id, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('inventory')
            .update(dto)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
    async remove(id) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('inventory')
            .delete()
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)()
], InventoryService);
//# sourceMappingURL=inventory.service.js.map