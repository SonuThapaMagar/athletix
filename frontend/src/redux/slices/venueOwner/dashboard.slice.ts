import type { DashboardStats, RecentBooking } from '@/types/venueOwner/dashboard.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IDashboardSlice {
  stats: DashboardStats | null;
  recentBookings: RecentBooking[];
  loading: boolean;
  error: string | null;
}

const initialState: IDashboardSlice = {
  stats: null,
  recentBookings: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'venueOwnerDashboard',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setDashboardData(state, action: PayloadAction<{ stats: DashboardStats; recentBookings: RecentBooking[] }>) {
      state.stats = action.payload.stats;
      state.recentBookings = action.payload.recentBookings;
      state.loading = false;
      state.error = null;
    },
    setStats(state, action: PayloadAction<DashboardStats>) {
      state.stats = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRecentBookings(state, action: PayloadAction<RecentBooking[]>) {
      state.recentBookings = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateBooking(state, action: PayloadAction<RecentBooking>) {
      const index = state.recentBookings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.recentBookings[index] = action.payload;
      }
    },
  },
});

export const { actions: dashboardActions, reducer } = dashboardSlice;
export default reducer;
