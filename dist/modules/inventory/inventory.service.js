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