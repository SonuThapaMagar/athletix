import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminDashboardStats, RecentActivity } from '@/types/admin/dashboard.types';

export interface IAdminDashboardSlice {
  stats: AdminDashboardStats | null;
  recentActivities: RecentActivity[];
  loading: boolean;
  error: string | null;
}

const initialState: IAdminDashboardSlice = {
  stats: null,
  recentActivities: [],
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setDashboardData(state, action: PayloadAction<{ stats: AdminDashboardStats; recentActivities: RecentActivity[] }>) {
      state.stats = action.payload.stats;
      state.recentActivities = action.payload.recentActivities;
      state.loading = false;
      state.error = null;
    },
    setStats(state, action: PayloadAction<AdminDashboardStats>) {
      state.stats = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRecentActivities(state, action: PayloadAction<RecentActivity[]>) {
      state.recentActivities = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { actions: adminDashboardActions, reducer } = adminDashboardSlice;
export default reducer;
