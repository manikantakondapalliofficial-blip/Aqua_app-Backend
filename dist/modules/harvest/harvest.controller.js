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
exports.HarvestController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../common/guards/jwt.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const harvest_service_1 = require("./harvest.service");
const create_harvest_dto_1 = require("./dto/create-harvest.dto");
let HarvestController = class HarvestController {
    constructor(harvestService) {
        this.harvestService = harvestService;
    }
    getAll(user) {
        return this.harvestService.findAllForUser(user.sub);
    }
    create(user, dto) {
        return this.harvestService.create(user.sub, dto);
    }
    updateStatus(user, id, status) {
        return this.harvestService.updateStatus(user.sub, id, status);
    }
};
exports.HarvestController = HarvestController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HarvestController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_harvest_dto_1.CreateHarvestDto]),
    __metadata("design:returntype", void 0)
], HarvestController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], HarvestController.prototype, "updateStatus", null);
exports.HarvestController = HarvestController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('harvest'),
    __metadata("design:paramtypes", [harvest_service_1.HarvestService])
], HarvestController);
//# sourceMappingURL=harvest.controller.js.map