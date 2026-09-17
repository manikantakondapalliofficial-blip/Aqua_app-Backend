"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let HarvestService = class HarvestService {
    async findAllForUser(userId) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('harvests')
            .select('*, tanks(name)')
            .eq('user_id', userId)
            .order('harvest_date', { ascending: false });
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
    async create(userId, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('harvests')
            .insert({
            ...dto,
            user_id: userId,
        })
            .select()
            .single();
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (dto.harvest_type === 'full') {
            const { error: tankError } = await (0, supabase_client_1.getSupabaseClient)()
                .from('tanks')
                .update({ stock: 0 })
                .eq('id', dto.tank_id);
            if (tankError) {
                console.error('Failed to reset tank stock after full harvest:', tankError);
            }
        }
        return data;
    }
    async updateStatus(userId, harvestId, status) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('harvests')
            .update({ status })
            .eq('id', harvestId)
            .eq('user_id', userId)
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
};
exports.HarvestService = HarvestService;
exports.HarvestService = HarvestService = __decorate([
    (0, common_1.Injectable)()
], HarvestService);
//# sourceMappingURL=harvest.service.js.map