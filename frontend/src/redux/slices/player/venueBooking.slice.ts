import type { Booking } from '@/types/player/venueBooking.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IVenueBookingSlice {
  bookings: Booking[];        // List of player's bookings (for history page)
  currentBooking: Booking | null; // Optional: track the latest pending booking
  selectedBooking: Booking | null; // Selected booking details for viewing
  loading: boolean;
  error: string | null;
}

const initialState: IVenueBookingSlice = {
  bookings: [],
  currentBooking: null,
  selectedBooking: null,
  loading: false,
  error: null,
};

const venueBookingSlice = createSlice({
  name: 'venueBooking', // or 'playerBooking'
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    // Add a single new booking (e.g., after creating pending)
    addBooking(state, action: PayloadAction<Booking>) {
      state.bookings.unshift(action.payload); // newest first
      state.currentBooking = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Replace full list (e.g., when fetching history)
    setBookings(state, action: PayloadAction<Booking[]>) {
      state.bookings = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Update a booking (e.g., after payment success)
    updateBooking(state, action: PayloadAction<Booking>) {
      const index = state.bookings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
      if (state.currentBooking?.id === action.payload.id) {
        state.currentBooking = action.payload;
      }
      state.loading = false;
    },
    // Remove a booking (e.g., after cancel)
    removeBooking(state, action: PayloadAction<number>) {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
      if (state.currentBooking?.id === action.payload) {
        state.currentBooking = null;
      }
      state.loading = false;
    },
    // Clear current booking (optional)
    clearCurrentBooking(state) {
      state.currentBooking = null;
    },
    // Set selected booking for details view
    setSelectedBooking(state, action: PayloadAction<Booking | null>) {
      state.selectedBooking = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { actions: venueBookingActions, reducer } = venueBookingSlice;
export default reducer;