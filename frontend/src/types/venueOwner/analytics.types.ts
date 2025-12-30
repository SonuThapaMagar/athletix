export interface AnalyticsStats {
  totalRevenue: number;
  totalBookings: number;
  activeCustomers: number;
  averageRating: number;
  revenueChange?: number; // percentage change
  bookingsChange?: number; // percentage change
  customersChange?: number; // percentage change
  ratingChange?: number; // absolute change
}

export interface RevenueDataPoint {
  month: string; // e.g., "Jan", "Feb"
  revenue: number;
  year?: number;
}

export interface TopVenue {
  venueId: number;
  venueName: string;
  bookings: number;
  revenue: number;
  growth?: number; // percentage growth
}

export interface SportPopularity {
  sport: string;
  percentage: number;
  bookings: number;
}

export interface TimeSlot {
  time: string; // e.g., "8:00 AM - 10:00 AM"
  bookings: number;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
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
