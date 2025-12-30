import type { VenueOwnerBooking } from '@/types/venueOwner/venueOwnerBooking.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IVenueOwnerBookingSlice {
  bookings: VenueOwnerBooking[];
  selectedBooking: VenueOwnerBooking | null;
  loading: boolean;
  error: string | null;
}

const initialState: IVenueOwnerBookingSlice = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

const venueOwnerBookingSlice = createSlice({
  name: 'venueOwnerBooking',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setBookings(state, action: PayloadAction<VenueOwnerBooking[]>) {
      state.bookings = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateBooking(state, action: PayloadAction<VenueOwnerBooking>) {
      const index = state.bookings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeBooking(state, action: PayloadAction<number>) {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
      if (state.selectedBooking?.id === action.payload) {
        state.selectedBooking = null;
      }
      state.loading = false;
      state.error = null;
    },
    setSelectedBooking(state, action: PayloadAction<VenueOwnerBooking | null>) {
      state.selectedBooking = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { actions: venueOwnerBookingActions, reducer } = venueOwnerBookingSlice;
export default reducer;
