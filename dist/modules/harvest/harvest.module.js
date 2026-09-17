"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const harvest_controller_1 = require("./harvest.controller");
const harvest_service_1 = require("./harvest.service");
let HarvestModule = class HarvestModule {
};
exports.HarvestModule = HarvestModule;
exports.HarvestModule = HarvestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
            }),
        ],
        controllers: [harvest_controller_1.HarvestController],
        providers: [harvest_service_1.HarvestService],
        exports: [harvest_service_1.HarvestService],
    })
], HarvestModule);
//# sourceMappingURL=harvest.module.js.map