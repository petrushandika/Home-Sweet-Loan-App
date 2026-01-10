import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SetupModule } from './modules/setup/setup.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { SpendingModule } from './modules/spending/spending.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AssetsModule } from './modules/assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SetupModule,
    BudgetsModule,
    SpendingModule,
    ReportsModule,
    AssetsModule,
  ],
})
export class AppModule {}
