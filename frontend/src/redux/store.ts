import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,  // Start with auth slice
    // Later: bookings: bookingsReducer,
    // venues: venuesReducer
  },
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;