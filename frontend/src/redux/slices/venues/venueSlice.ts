import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Venue } from '@/types/venue.types/venue.types';
import type { Pagination } from '@/types/pagination.types';

export interface IVenuesSlice {
  venues: Venue[];
  selectedVenue: Venue | null;
  pagination: Pagination;

}

const initialState: IVenuesSlice = {
  venues: [],
  selectedVenue: null,
  pagination: { page: 0, per_page: 0, total_record: 0, total_page: 0 },

};

const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    setVenues: (
      state,
      action: PayloadAction<{ venues: Venue[]; pagination: Pagination }>
    ) => {
      const { venues, pagination } = action.payload;
      state.venues = venues;
      state.pagination = pagination;
    },
    addVenue: (state, action: PayloadAction<Venue>) => {
      state.venues.unshift(action.payload);
    },
    setSelectedVenue: (state, action: PayloadAction<Venue>) => {
      state.selectedVenue = action.payload;
    },
    updateVenue: (state, action: PayloadAction<Venue>) => {
      const index = state.venues.findIndex((v) => v.id === action.payload.id);
      if (index >= 0) state.venues[index] = action.payload;

      if (state.selectedVenue?.id === action.payload.id) {
        state.selectedVenue = action.payload;
      }
    },

    removeVenue: (state, action: PayloadAction<number>) => {
      const index = state.venues.findIndex((venue) => venue.id === action.payload);
      if (index >= 0) {
        state.venues.splice(index, 1);
      }
    },

  },
});

export const { actions: venueActions, reducer } = venueSlice;
export default reducer;