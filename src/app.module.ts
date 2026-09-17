import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TanksModule } from './modules/tanks/tanks.module';
import { FeedModule } from './modules/feed/feed.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { WaterModule } from './modules/water/water.module';
import { PostsModule } from './modules/posts/posts.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { HarvestModule } from './modules/harvest/harvest.module';
import { UploadsModule } from './uploads/uploads.module';
import { ChatModule } from './chat/chat.module';
import { BillsModule } from './modules/bills/bills.module';
import { CommunityModule } from './modules/community/community.module';
import { BannersModule } from './modules/banners/banners.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env automatically
    AuthModule,
    TanksModule,
    FeedModule,
    ExpensesModule,
    WaterModule,
    PostsModule,
    InventoryModule,
    HarvestModule,
    UploadsModule,
    ChatModule,
    BillsModule,
    CommunityModule,
    BannersModule,
  ],
})
export class AppModule {}
