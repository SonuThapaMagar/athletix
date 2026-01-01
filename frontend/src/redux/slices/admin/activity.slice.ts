import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ActivityLog } from '@/types/admin/activity.types';
import type { Pagination } from '@/types/pagination.types';

export interface IAdminActivitySlice {
  activities: ActivityLog[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAdminActivitySlice = {
  activities: [],
  pagination: null,
  loading: false,
  error: null,
};

const adminActivitySlice = createSlice({
  name: 'adminActivity',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setActivities(state, action: PayloadAction<{ activities: ActivityLog[]; pagination: Pagination }>) {
      state.activities = action.payload.activities;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    addActivity(state, action: PayloadAction<ActivityLog>) {
      state.activities.unshift(action.payload);
    },
  },
});

export const { actions: adminActivityActions, reducer } = adminActivitySlice;
export default reducer;
