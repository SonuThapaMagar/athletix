import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminAnalyticsStats, RevenueDataPoint, TopVenue, SportPopularity, TimeSlot } from '@/types/admin/analytics.types';

export interface IAdminAnalyticsSlice {
  stats: AdminAnalyticsStats | null;
  revenueData: RevenueDataPoint[];
  topVenues: TopVenue[];
  sportPopularity: SportPopularity[];
  peakBookingTimes: TimeSlot[];
  loading: boolean;
  error: string | null;
}

const initialState: IAdminAnalyticsSlice = {
  stats: null,
  revenueData: [],
  topVenues: [],
  sportPopularity: [],
  peakBookingTimes: [],
  loading: false,
  error: null,
};

const adminAnalyticsSlice = createSlice({
  name: 'adminAnalytics',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setAnalyticsData(state, action: PayloadAction<{
      stats: AdminAnalyticsStats;
      revenueData: RevenueDataPoint[];
      topVenues: TopVenue[];
      sportPopularity: SportPopularity[];
      peakBookingTimes: TimeSlot[];
    }>) {
      state.stats = action.payload.stats;
      state.revenueData = action.payload.revenueData;
      state.topVenues = action.payload.topVenues;
      state.sportPopularity = action.payload.sportPopularity;
      state.peakBookingTimes = action.payload.peakBookingTimes;
      state.loading = false;
      state.error = null;
    },
    setStats(state, action: PayloadAction<AdminAnalyticsStats>) {
      state.stats = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRevenueData(state, action: PayloadAction<RevenueDataPoint[]>) {
      state.revenueData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setTopVenues(state, action: PayloadAction<TopVenue[]>) {
      state.topVenues = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSportPopularity(state, action: PayloadAction<SportPopularity[]>) {
      state.sportPopularity = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPeakBookingTimes(state, action: PayloadAction<TimeSlot[]>) {
      state.peakBookingTimes = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { actions: adminAnalyticsActions, reducer } = adminAnalyticsSlice;
export default reducer;
