import requests from "@/helper/requests";
import { addVenue, setVenues } from "@/redux/slices/venues/venueSlice";
import type { AppDispatch } from "@/redux/store";
import type { ApiResponse } from "@/types/axiosResponse.types";
import type { Venue, VenueSubmitData } from "@/types/venue.types/venue.types";
import type { AxiosResponse } from "axios";

// CREATE new venue
export const CREATE_VENUE_ACTION =
  (data: VenueSubmitData) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponse<Venue>> = await requests.venueMgmt.createVenue(data);
      dispatch(addVenue(response.data.data));
      console.log(data)
    } catch (error: any) {
      console.error("❌ Venue creation failed:", error.response?.data);
      throw error.response?.data || error;
    }
  };

export const FETCH_VENUES_ACTION =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const response: AxiosResponse<Venue[]> = await requests.venueMgmt.getVenues();
      dispatch(setVenues(response.data));
      console.log("✅ Venues fetched:", response.data);  
    } catch (error: any) {
      console.error("❌ Fetch venues failed:", error.response?.data);
      throw error.response?.data || error;
    }
  };