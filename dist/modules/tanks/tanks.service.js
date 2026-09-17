"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TanksService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let TanksService = class TanksService {
    async findAllByUser(userId) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('tanks')
            .select('*')
            .eq('user_id', userId);
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async create(userId, dto) {
        console.log('Creating tank for user:', userId, 'with data:', dto);
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('tanks')
            .insert({ ...dto, user_id: userId })
            .select()
            .single();
        if (error) {
            console.error('Supabase Error:', error);
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
    async update(id, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('tanks')
            .update(dto)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
};
exports.TanksService = TanksService;
exports.TanksService = TanksService = __decorate([
    (0, common_1.Injectable)()
], TanksService);
//# sourceMappingURL=tanks.service.js.map