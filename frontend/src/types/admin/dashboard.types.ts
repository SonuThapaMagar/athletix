export interface AdminDashboardStats {
  totalUsers: number;
  activeVenues: number;
  totalRevenue: number;
  totalBookings: number;
  growthRate?: number;
  usersChange?: number;
  venuesChange?: number;
  revenueChange?: number;
  bookingsChange?: number;
}

export interface RecentActivity {
  id: number;
  action: string;
  user: string;
  time: string;
  type: 'venue' | 'user' | 'payment' | 'booking' | 'other';
  relatedEntityId?: number;
  relatedEntityType?: string;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  recentActivities: RecentActivity[];
}
