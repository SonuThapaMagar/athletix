import { configureStore } from '@reduxjs/toolkit';

// Import reducers (fix: add these!)
import authSlice from '@/redux/slices/authSlice'; // Adjust path if needed
import venueSlice from '@/redux/slices/venues/venueSlice'; // Adjust path if needed

// Configure store with object reducers (fix: now reducers is defined)
const reducers = {
  auth: authSlice,
  venues:venueSlice,
};

// Define full state shape (inferred for TS safety)
export type RootState = ReturnType<typeof store.getState>;

// Create store
export const store = configureStore({
  reducer: reducers,
});

// Typed dispatch (for actions)
export type AppDispatch = typeof store.dispatch;