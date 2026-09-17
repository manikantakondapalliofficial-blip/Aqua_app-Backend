"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let BillsService = class BillsService {
    async findAllByUser(userId) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('bills')
            .select('*')
            .eq('uploaded_by', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async create(userId, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('bills')
            .insert({
            ...dto,
            uploaded_by: userId,
            organization_id: '00000000-0000-0000-0000-000000000000',
        })
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async delete(userId, id) {
        const { error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('bills')
            .delete()
            .eq('id', id)
            .eq('uploaded_by', userId);
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return { success: true };
    }
};
exports.BillsService = BillsService;
exports.BillsService = BillsService = __decorate([
    (0, common_1.Injectable)()
], BillsService);
//# sourceMappingURL=bills.service.js.map