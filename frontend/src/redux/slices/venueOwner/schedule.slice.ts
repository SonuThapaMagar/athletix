// src/redux/slices/venueOwner/schedule.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Schedule } from '@/types/venueOwner/schedule.types';

export interface IScheduleSlice {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
}

const initialState: IScheduleSlice = {
  schedules: [],
  loading: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setSchedules(state, action: PayloadAction<Schedule[]>) {
      state.schedules = action.payload;
      state.error = null;
    },
    addSchedule(state, action: PayloadAction<Schedule>) {
      state.schedules.push(action.payload);
    },
    updateSchedule(state, action: PayloadAction<Schedule>) {
      const index = state.schedules.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.schedules[index] = action.payload;
      }
    },
    removeSchedule(state, action: PayloadAction<number>) {
      state.schedules = state.schedules.filter(s => s.id !== action.payload);
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { actions: scheduleActions, reducer: scheduleReducer } = scheduleSlice;
export default scheduleReducer;