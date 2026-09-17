"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const tanks_module_1 = require("./modules/tanks/tanks.module");
const feed_module_1 = require("./modules/feed/feed.module");
const expenses_module_1 = require("./modules/expenses/expenses.module");
const water_module_1 = require("./modules/water/water.module");
const posts_module_1 = require("./modules/posts/posts.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const harvest_module_1 = require("./modules/harvest/harvest.module");
const uploads_module_1 = require("./uploads/uploads.module");
const chat_module_1 = require("./chat/chat.module");
const bills_module_1 = require("./modules/bills/bills.module");
const community_module_1 = require("./modules/community/community.module");
const banners_module_1 = require("./modules/banners/banners.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            tanks_module_1.TanksModule,
            feed_module_1.FeedModule,
            expenses_module_1.ExpensesModule,
            water_module_1.WaterModule,
            posts_module_1.PostsModule,
            inventory_module_1.InventoryModule,
            harvest_module_1.HarvestModule,
            uploads_module_1.UploadsModule,
            chat_module_1.ChatModule,
            bills_module_1.BillsModule,
            community_module_1.CommunityModule,
            banners_module_1.BannersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map