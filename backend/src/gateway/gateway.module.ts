import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrdersGateway } from './orders.gateway';
import { OrdersModule } from '../orders/order.module';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change_me_in_production',
    }),
  ],
  providers: [OrdersGateway],
  exports: [OrdersGateway],
})
export class GatewayModule {}
