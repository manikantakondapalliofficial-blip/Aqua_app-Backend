"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../common/guards/jwt.guard");
const water_service_1 = require("./water.service");
const create_water_dto_1 = require("./dto/create-water.dto");
let WaterController = class WaterController {
    constructor(waterService) {
        this.waterService = waterService;
    }
    getAll(tankId) {
        return this.waterService.findByTank(tankId);
    }
    create(dto) {
        return this.waterService.create(dto);
    }
};
exports.WaterController = WaterController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('tank_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WaterController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_water_dto_1.CreateWaterDto]),
    __metadata("design:returntype", void 0)
], WaterController.prototype, "create", null);
exports.WaterController = WaterController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('water'),
    __metadata("design:paramtypes", [water_service_1.WaterService])
], WaterController);
//# sourceMappingURL=water.controller.js.map