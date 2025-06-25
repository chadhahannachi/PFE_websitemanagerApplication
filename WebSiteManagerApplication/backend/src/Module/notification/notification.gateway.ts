import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true
  },
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationGateway.name);

  afterInit(server: Server) {
    this.logger.log('Notification WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendNewLicenceRequestNotification(message: string) {
    this.logger.log(`Emitting 'newLicenceRequest' event: ${message}`);
    this.server.emit('newLicenceRequest', message);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    this.logger.log(`Message from client ${client.id}: ${payload}`);
    client.emit('response', 'Message received');
    return 'Hello from server';
  }
}