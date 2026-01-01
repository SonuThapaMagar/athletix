export interface AdminAnalyticsStats {
  totalRevenue: number;
  totalBookings: number;
  activeUsers: number;
  totalVenues: number;
  revenueChange?: number;
  bookingsChange?: number;
  usersChange?: number;
  venuesChange?: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  year?: number;
}

export interface TopVenue {
  venueId: number;
  venueName: string;
  revenue: number;
  bookings: number;
  growth?: number;
}

export interface SportPopularity {
  sport: string;
  bookings: number;
  percentage: number;
}

export interface TimeSlot {
  timeSlot: string;
  bookings: number;
}

export interface AdminAnalyticsData {
  stats: AdminAnalyticsStats;
  revenueData: RevenueDataPoint[];
  topVenues: TopVenue[];
  sportPopularity: SportPopularity[];
  peakBookingTimes: TimeSlot[];
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  venueId?: number;
}
