// src/redux/slices/player/playerVenueSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pagination } from '@/types/pagination.types';
import type { PlayerVenue } from '@/types/player/playerVenue.types';

export interface IPlayerVenuesSlice {
  venues: PlayerVenue[];
  selectedVenue: PlayerVenue | null;
  pagination: Pagination;
  loading: boolean;
}

const initialState: IPlayerVenuesSlice = {
  venues: [],
  selectedVenue: null,
  pagination: { page: 1, per_page: 6, total_record: 0, total_page: 1 },
  loading: false,
};

const playerVenueSlice = createSlice({
  name: 'playerVenues',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setVenues: (
      state,
      action: PayloadAction<{ venues: PlayerVenue[]; pagination: Pagination }>
    ) => {
      const { venues, pagination } = action.payload;
      state.venues = venues;
      state.pagination = pagination;
      state.loading = false;
    },
    setSelectedVenue: (state, action: PayloadAction<PlayerVenue>) => {
      state.selectedVenue = action.payload;
      state.loading = false;
    },
    clearSelectedVenue: (state) => {
      state.selectedVenue = null;
    },
    clearVenues: (state) => {
      state.venues = [];
      state.pagination = initialState.pagination;
    },
  },
});

export const { actions: playerVenueActions, reducer } = playerVenueSlice;
export default reducer;