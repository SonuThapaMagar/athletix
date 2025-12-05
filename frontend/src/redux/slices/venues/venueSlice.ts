import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Venue } from '@/types/venue.types/venue.types';
import type { Pagination } from '@/types/pagination.types';

export interface IVenuesSlice {
  venues: Venue[];
  pagination?: Pagination;
  loading?: boolean;
  error?: string | null;
}

const initialState: IVenuesSlice = {
  venues: [],
  loading: false,
  error:null,
};

const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    addVenue: (state, action: PayloadAction<Venue>) => {
      state.venues.unshift(action.payload);
      state.loading = false;
    },
    setVenues: (state, action: PayloadAction<Venue[]>) => {
      state.venues = action.payload;
      state.loading = false;
    },
  },
});

export const {
  addVenue,setVenues
} = venueSlice.actions;
export default venueSlice.reducer;