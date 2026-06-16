import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { OrdersService } from '../orders/order.service';

interface RosClient extends WebSocket {
  restaurantId?: number;
  userId?: number;
}

@WebSocketGateway({ path: '/ws' })
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  /** restaurant room map: restaurantId → set of live sockets */
  private readonly rooms = new Map<number, Set<RosClient>>();

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async handleConnection(client: RosClient, req: IncomingMessage) {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const token = url.searchParams.get('token');

    if (!token) {
      client.close(1008, 'Missing token');
      return;
    }

    let payload: { sub: number; restaurantId: number; role: string };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      client.close(1008, 'Invalid or expired token');
      return;
    }

    client.restaurantId = payload.restaurantId;
    client.userId = payload.sub;

    if (!this.rooms.has(payload.restaurantId)) {
      this.rooms.set(payload.restaurantId, new Set());
    }
    this.rooms.get(payload.restaurantId)!.add(client);

    // Send snapshot of all open orders for this restaurant
    try {
      const orders = await this.ordersService.findAll(payload.restaurantId, {});
      this.sendToClient(client, 'snapshot', orders);
    } catch {
      // snapshot failure must not drop the connection
    }
  }

  handleDisconnect(client: RosClient) {
    if (client.restaurantId !== undefined) {
      this.rooms.get(client.restaurantId)?.delete(client);
    }
  }

  /** Called by OrdersService after every committed DB write */
  broadcastToRestaurant(restaurantId: number, event: string, payload: unknown) {
    const room = this.rooms.get(restaurantId);
    if (!room || room.size === 0) return;

    const message = JSON.stringify({ event, payload });
    for (const client of room) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  private sendToClient(client: RosClient, event: string, payload: unknown) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event, payload }));
    }
  }
}
