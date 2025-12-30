export interface DashboardStats {
  totalRevenue: number;
  activeBookings: number;
  totalVenues: number;
  customerRating: number;
  revenueChange?: number; // percentage change
  bookingsChange?: number; // percentage change
  venuesChange?: number; // absolute change
  ratingChange?: number; // absolute change
}

export interface RecentBooking {
  id: number;
  venueId: number;
  venueName: string;
  playerId: number;
  playerName: string;
  sport: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
  amount: number;
  paid: boolean;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentBookings: RecentBooking[];
}
