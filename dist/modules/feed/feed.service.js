"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let FeedService = class FeedService {
    async findAllForUser(userId) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('feed')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async create(userId, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('feed')
            .insert({
            ...dto,
            user_id: userId,
        })
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        if (dto.inventory_id) {
            const { data: item, error: getErr } = await (0, supabase_client_1.getSupabaseClient)()
                .from('inventory')
                .select('remaining_qty')
                .eq('id', dto.inventory_id)
                .single();
            if (!getErr && item) {
                const newRemaining = Math.max(0, Number(item.remaining_qty) - Number(dto.quantity));
                await (0, supabase_client_1.getSupabaseClient)()
                    .from('inventory')
                    .update({ remaining_qty: newRemaining })
                    .eq('id', dto.inventory_id);
            }
        }
        return data;
    }
    async updateStatus(userId, feedId, status) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('feed')
            .update({ status })
            .eq('id', feedId)
            .eq('user_id', userId)
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = __decorate([
    (0, common_1.Injectable)()
], FeedService);
//# sourceMappingURL=feed.service.js.map