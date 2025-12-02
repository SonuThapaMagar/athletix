// src/redux/slices/venues/venueThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { venueActions } from '@/redux/slices/venues/venueSlice'
import requests from '@/helper/requests'
import type { Venue } from '@/types/venue.types/venue.types'

// -----------------------------------------
// FETCH ALL VENUES (Owner's venues)
// -----------------------------------------
export const fetchVenues = createAsyncThunk<
  Venue[],
  void,
  { rejectValue: string }
>('venues/fetchVenues', async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await requests.venueMgmt.getMy()
    const venues = res.data

    dispatch(venueActions.getVenues({ venues }))
    return venues
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch venues')
  }
})

// -----------------------------------------
// CREATE VENUE
// -----------------------------------------
export const createVenue = createAsyncThunk<
  Venue,
  Partial<Venue>,
  { rejectValue: string }
>('venues/createVenue', async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await requests.venueMgmt.create(data)
    dispatch(venueActions.addVenue(res.data))
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to create venue')
  }
})

// -----------------------------------------
// UPDATE VENUE
// -----------------------------------------
export const updateVenue = createAsyncThunk<
  Venue,
  { id: number; data: Partial<Venue> },
  { rejectValue: string }
>('venues/updateVenue', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    const res = await requests.venueMgmt.update(id, data)
    dispatch(venueActions.updateVenue({ id, data: res.data }))
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to update venue')
  }
})

// -----------------------------------------
// DELETE VENUE
// -----------------------------------------
export const deleteVenue = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('venues/deleteVenue', async (id, { dispatch, rejectWithValue }) => {
  try {
    await requests.venueMgmt.delete(id)
    dispatch(venueActions.removeVenue(id))
    return id
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to delete venue')
  }
})

// -----------------------------------------
// FETCH SINGLE VENUE
// -----------------------------------------
export const fetchVenueById = createAsyncThunk<
  Venue,
  number,
  { rejectValue: string }
>('venues/fetchVenueById', async (id, { rejectWithValue }) => {
  try {
    const res = await requests.venueMgmt.getById(id)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch venue')
  }
})
