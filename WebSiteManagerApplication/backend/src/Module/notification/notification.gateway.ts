import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true
  }, 
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationGateway.name);
  private superAdminABshoreSockets: Set<string> = new Set();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  afterInit(server: Server) {
    this.logger.log('Notification WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    
    try {
      // Récupérer le token depuis l'authentification
      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        return;
      }

      // Vérifier et décoder le token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      // Récupérer les informations de l'utilisateur
      const user = await this.authService.findOneById(userId);
      if (!user) {
        this.logger.warn(`User not found for client ${client.id}`);
        return;
      }

      // Stocker le socket de l'utilisateur
      this.userSockets.set(userId, client.id);

      // Si l'utilisateur est superadminabshore, l'ajouter à la liste
      if (user.role === 'superadminabshore') {
        this.superAdminABshoreSockets.add(client.id);
        this.logger.log(`SuperAdminABshore connected: ${client.id} (User: ${user.nom})`);
      }

      // Stocker les informations de l'utilisateur dans le socket
      client.data.user = user;
      
    } catch (error) {
      this.logger.error(`Error during connection for client ${client.id}:`, error.message);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Retirer le socket de la liste des superadminabshore
    if (this.superAdminABshoreSockets.has(client.id)) {
      this.superAdminABshoreSockets.delete(client.id);
      this.logger.log(`SuperAdminABshore disconnected: ${client.id}`);
    }

    // Retirer le socket de la map des utilisateurs
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        this.logger.log(`User ${userId} disconnected: ${client.id}`);
        break;
      }
    }
  }

  sendNewLicenceRequestNotification(message: string) {
    this.logger.log(`Emitting 'newLicenceRequest' event to SuperAdminABshore users: ${message}`);
    
    // Envoyer la notification seulement aux sockets des superadminabshore
    this.superAdminABshoreSockets.forEach(socketId => {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('newLicenceRequest', message);
        this.logger.log(`Notification sent to SuperAdminABshore socket: ${socketId}`);
      }
    });
    
    this.logger.log(`Notification sent to ${this.superAdminABshoreSockets.size} SuperAdminABshore users`);
  }

  sendNotification(type: string, message: string) {
    this.logger.log(`Emitting '${type}' event to SuperAdminABshore users: ${message}`);
    
    // Envoyer la notification seulement aux sockets des superadminabshore
    this.superAdminABshoreSockets.forEach(socketId => {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit(type, message);
        this.logger.log(`Notification sent to SuperAdminABshore socket: ${socketId}`);
      }
    });
    
    this.logger.log(`Notification sent to ${this.superAdminABshoreSockets.size} SuperAdminABshore users`);
  }

  sendNotificationToUsers(type: string, message: string, userIds: string[]) {
    this.logger.log(`Emitting '${type}' event to specific users: ${message}`);
    
    let sentCount = 0;
    userIds.forEach(userId => {
      const socketId = this.userSockets.get(userId);
      if (socketId) {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit(type, message);
          this.logger.log(`Notification sent to user ${userId} socket: ${socketId}`);
          sentCount++;
        }
      }
    });
    
    this.logger.log(`Notification sent to ${sentCount}/${userIds.length} users`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    this.logger.log(`Message from client ${client.id}: ${payload}`);
    client.emit('response', 'Message received');
    return 'Hello from server';
  }
}