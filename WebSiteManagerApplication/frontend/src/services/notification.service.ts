import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  timestamp: Date;
  read: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private socket: Socket;
  private notifications = new BehaviorSubject<Notification[]>([]);
  private readonly MAX_NOTIFICATIONS = 50;

  private constructor() {
    this.socket = io('http://localhost:5000', {
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('newLicenceRequest', (message: string) => {
      this.addNotification({
        message,
        timestamp: new Date(),
        read: false
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private addNotification(notification: Notification) {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = [notification, ...currentNotifications].slice(0, this.MAX_NOTIFICATIONS);
    this.notifications.next(updatedNotifications);
  }

  getNotifications() {
    return this.notifications.asObservable();
  }

  markAsRead(index: number) {
    const currentNotifications = this.notifications.value;
    if (currentNotifications[index]) {
      currentNotifications[index].read = true;
      this.notifications.next([...currentNotifications]);
    }
  }

  markAllAsRead() {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.notifications.next(updatedNotifications);
  }

  clearNotifications() {
    this.notifications.next([]);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default NotificationService; 