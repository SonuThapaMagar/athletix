// src/redux/slices/venues/venueSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IVenuesSlice, Pagination, Venue } from '@/types/venue.types/venue.types'

const initialState: IVenuesSlice = {
  venues: []
}

const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    getVenues: (
      state,
      action: PayloadAction<{ venues: Venue[]; pagination?: Pagination }>
    ) => {
      state.venues = action.payload.venues
    },

    addVenue: (state, action: PayloadAction<Venue>) => {
      state.venues.unshift(action.payload)
    },

    updateVenue: (
      state,
      action: PayloadAction<{ id: number; data: Partial<Venue> }>
    ) => {
      const index = state.venues.findIndex(v => v.id === action.payload.id)
      if (index !== -1) {
        state.venues[index] = { ...state.venues[index], ...action.payload.data }
      }
    },

    removeVenue: (state, action: PayloadAction<number>) => {
      state.venues = state.venues.filter(v => v.id !== action.payload)
    }
  }
})

export const { actions: venueActions, reducer: venueReducer } = venueSlice
export default venueReducer
