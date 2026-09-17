"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let WaterService = class WaterService {
    async findByTank(tankId) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('water_parameters')
            .select('*')
            .eq('tank_id', tankId)
            .order('date', { ascending: false });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async create(dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('water_parameters')
            .insert(dto)
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
};
exports.WaterService = WaterService;
exports.WaterService = WaterService = __decorate([
    (0, common_1.Injectable)()
], WaterService);
//# sourceMappingURL=water.service.js.map