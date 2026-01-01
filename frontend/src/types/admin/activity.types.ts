export type ActivityType = 'booking' | 'review' | 'registration' | 'update' | 'cancellation' | 'payment' | 'venue' | 'user' | 'other';

export interface ActivityLog {
  id: number;
  user: string;
  userId?: number;
  action: string;
  venue?: string;
  venueId?: number;
  time: string;
  type: ActivityType;
  metadata?: Record<string, any>;
}

export interface ActivityFilters {
  type?: ActivityType | 'all';
  userId?: number;
  venueId?: number;
  startDate?: string;
  endDate?: string;
  timeRange?: 'today' | 'week' | 'month';
  page?: number;
  perPage?: number;
}
