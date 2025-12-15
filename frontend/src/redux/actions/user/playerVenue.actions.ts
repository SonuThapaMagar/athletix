// src/redux/actions/player/player-venue.actions.ts
import requests from "@/helper/requests";
import { playerVenueActions } from "@/redux/slices/player/playerVenue.slice";
import { AppDispatch } from "@/redux/store";
import type { ApiResponse } from "@/types/axiosResponse.types";
import type { Pagination } from "@/types/pagination.types";
import type { PlayerVenue } from "@/types/player/playerVenue.types";
import type { AxiosError, AxiosResponse } from "axios";

// Fetch all venues for players
export const FETCH_ALL_VENUES_ACTION = (params?: { 
  page?: number; 
  perPage?: number 
}): Promise<{
  venues: PlayerVenue[];
  pagination: Pagination;
}> =>
  new Promise((resolve, reject) => {
    AppDispatch(playerVenueActions.setLoading(true));
    
    requests.venueMgmt
      .getVenues(params || { page: 1, perPage: 6 })
      .then((response: AxiosResponse<ApiResponse<{ items: PlayerVenue[]; pagination: Pagination }>>) => {
        const data = response.data.data;

        if (!data) {
          console.error("❌ Fetch venues failed: data is undefined");
          AppDispatch(playerVenueActions.setLoading(false));
          reject("No data returned from API");
          return;
        }

        const venues = data.items || [];
        const pagination = data.pagination || { 
          page: 1, 
          per_page: 6, 
          total_record: 0, 
          total_page: 1 
        };

        console.log("✅ Venues fetched:", venues);
        console.log("✅ Pagination:", pagination);

        AppDispatch(
          playerVenueActions.setVenues({ venues, pagination })
        );

        resolve({ venues, pagination });
      })
      .catch((error: AxiosError) => {
        const err = error.response?.data || error.message || "Unknown error";
        console.error("❌ Fetch venues failed:", err);
        AppDispatch(playerVenueActions.setLoading(false));
        reject(err);
      });
  });

// Fetch single venue by ID for players
export const FETCH_VENUE_BY_ID_ACTION = (id: number): Promise<PlayerVenue> =>
  new Promise((resolve, reject) => {
    AppDispatch(playerVenueActions.setLoading(true));
    
    requests.venueMgmt
      .getVenueById(id)
      .then((response: AxiosResponse<ApiResponse<PlayerVenue>>) => {
        const venue = response.data.data;
        
        if (!venue) {
          console.error("❌ Fetch venue detail failed: data is undefined");
          AppDispatch(playerVenueActions.setLoading(false));
          reject("No data returned from API");
          return;
        }

        console.log("✅ Venue detail fetched:", venue);

        AppDispatch(playerVenueActions.setSelectedVenue(venue));
        
        resolve(venue);
      })
      .catch((error: AxiosError) => {
        const err = error.response?.data || error.message || "Unknown error";
        console.error("❌ Fetch venue detail failed:", err);
        AppDispatch(playerVenueActions.setLoading(false));
        reject(err);
      });
  });