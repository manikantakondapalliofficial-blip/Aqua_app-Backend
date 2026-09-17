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
exports.TanksController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../common/guards/jwt.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const tanks_service_1 = require("./tanks.service");
const create_tank_dto_1 = require("./dto/create-tank.dto");
const update_tank_dto_1 = require("./dto/update-tank.dto");
let TanksController = class TanksController {
    constructor(tanksService) {
        this.tanksService = tanksService;
    }
    getAll(user) {
        return this.tanksService.findAllByUser(user.sub);
    }
    create(user, dto) {
        return this.tanksService.create(user.sub, dto);
    }
    update(id, dto) {
        return this.tanksService.update(id, dto);
    }
};
exports.TanksController = TanksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TanksController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_tank_dto_1.CreateTankDto]),
    __metadata("design:returntype", void 0)
], TanksController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tank_dto_1.UpdateTankDto]),
    __metadata("design:returntype", void 0)
], TanksController.prototype, "update", null);
exports.TanksController = TanksController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('tanks'),
    __metadata("design:paramtypes", [tanks_service_1.TanksService])
], TanksController);
//# sourceMappingURL=tanks.controller.js.map