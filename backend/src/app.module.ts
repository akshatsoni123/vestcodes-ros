import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/order.module';
import { TablesModule } from './table/table.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [PrismaModule, AuthModule, MenuModule, OrdersModule, TablesModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
