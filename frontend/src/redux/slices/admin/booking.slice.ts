import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminBooking } from '@/types/admin/booking.types';
import type { Pagination } from '@/types/pagination.types';

export interface IAdminBookingSlice {
  bookings: AdminBooking[];
  selectedBooking: AdminBooking | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAdminBookingSlice = {
  bookings: [],
  selectedBooking: null,
  pagination: null,
  loading: false,
  error: null,
};

const adminBookingSlice = createSlice({
  name: 'adminBooking',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setBookings(state, action: PayloadAction<{ bookings: AdminBooking[]; pagination: Pagination }>) {
      state.bookings = action.payload.bookings;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    addBooking(state, action: PayloadAction<AdminBooking>) {
      state.bookings.unshift(action.payload);
    },
    updateBooking(state, action: PayloadAction<AdminBooking>) {
      const index = state.bookings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
      if (state.selectedBooking?.id === action.payload.id) {
        state.selectedBooking = action.payload;
      }
    },
    removeBooking(state, action: PayloadAction<number>) {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
    },
    setSelectedBooking(state, action: PayloadAction<AdminBooking | null>) {
      state.selectedBooking = action.payload;
    },
  },
});

export const { actions: adminBookingActions, reducer } = adminBookingSlice;
export default reducer;
