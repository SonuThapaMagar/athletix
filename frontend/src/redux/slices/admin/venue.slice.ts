import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AdminVenue } from '@/types/admin/venue.types';
import type { Pagination } from '@/types/pagination.types';

export interface IAdminVenueSlice {
  venues: AdminVenue[];
  selectedVenue: AdminVenue | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: IAdminVenueSlice = {
  venues: [],
  selectedVenue: null,
  pagination: null,
  loading: false,
  error: null,
};

const adminVenueSlice = createSlice({
  name: 'adminVenue',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setVenues(state, action: PayloadAction<{ venues: AdminVenue[]; pagination: Pagination | null }>) {
      state.venues = action.payload.venues;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    addVenue(state, action: PayloadAction<AdminVenue>) {
      state.venues.unshift(action.payload);
    },
    updateVenue(state, action: PayloadAction<AdminVenue>) {
      const index = state.venues.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.venues[index] = action.payload;
      }
      if (state.selectedVenue?.id === action.payload.id) {
        state.selectedVenue = action.payload;
      }
    },
    removeVenue(state, action: PayloadAction<number>) {
      state.venues = state.venues.filter(v => v.id !== action.payload);
    },
    setSelectedVenue(state, action: PayloadAction<AdminVenue | null>) {
      state.selectedVenue = action.payload;
    },
  },
});

export const { actions: adminVenueActions, reducer } = adminVenueSlice;
export default reducer;

