export interface INotification {
  notificationId: number;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
  relatedEntityType?: string; // e.g., 'booking', 'venue', 'payment'
  relatedEntityId?: number;
}

export interface NotificationResponse {
  data: INotification[];
  unreadCount?: number;
}
