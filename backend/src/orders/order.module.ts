import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
