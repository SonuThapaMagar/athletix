import requests from "@/helper/requests";
import { venueActions } from "@/redux/slices/venues/venueSlice";
import { AppDispatch } from "@/redux/store";
import type { ApiResponse } from "@/types/axiosResponse.types";
import type { Pagination } from "@/types/pagination.types";
import type { Venue, VenueSubmitData } from "@/types/venue.types/venue.types";
import type { AxiosError, AxiosResponse } from "axios";

export const CREATE_VENUE_ACTION = (
  data: VenueSubmitData
): Promise<Venue> =>
  new Promise((resolve, reject) =>
    requests.venueMgmt
      .createVenue(data)
      .then((response: AxiosResponse<ApiResponse<Venue>>) => {
        const venue = response.data.data;

        AppDispatch(venueActions.addVenue(venue));
        resolve(venue);
      })
      .catch((error: AxiosError) => {
        const err = error.response?.data;
        console.error("❌ Venue creation failed:", err);
        reject(err);
      })
  );


export const FETCH_VENUES_ACTION = (params: { page?: number; perPage?: number }): Promise<{
  venues: Venue[];
  pagination: Pagination;
}> =>
  new Promise((resolve, reject) =>
    requests.venueMgmt
      .getVenues(params)
      .then((response: AxiosResponse<ApiResponse<{ venues: Venue[]; pagination: Pagination }>>) => {

        const { venues, pagination } = response.data.data;

        AppDispatch(
          venueActions.setVenues({
            venues,
            pagination,
          })
        );

        resolve({ venues, pagination });
      })
      .catch((error: AxiosError) => {
        const err = error.response?.data || error.message || "Unknown error";
        console.error("❌ Fetch venues failed:", err);
        reject(err);
      })
  );

export const FETCH_MY_VENUES_ACTION = (params?: { page?: number; perPage?: number }): Promise<{
  venues: Venue[];
  pagination: Pagination;
}> =>
  new Promise((resolve, reject) => {
    requests.venueMgmt
      .getMyVenues(params)
      .then((response: AxiosResponse<ApiResponse<{ venues: Venue[]; pagination: Pagination }>>) => {
        const data = response.data.data;

        if (!data) {
          console.error("❌ Fetch my venues failed: data is undefined");
          reject("No data returned from API");
          return;
        }

        const venues = data.venues || [];
        const pagination = data.pagination || { page: 1, per_page: 5, total_record: 0, total_page: 1 };

        AppDispatch(
          venueActions.setVenues({ venues, pagination })
        );

        resolve({ venues, pagination });
      })
      .catch((error: AxiosError) => {
        const err = error.response?.data || error.message || "Unknown error";
        console.error("❌ Fetch my venues failed:", err);
        reject(err);
      });
  });


export const FETCH_VENUE_DETAIL_BY_ID = (id: number): Promise<Venue> =>
  requests.venueMgmt
    .getVenueById(id)
    .then((response: AxiosResponse<Venue>) => {
      console.log("Venue data fetched:", response.data);
      return response.data; // use response.data directly
    })
    .catch((error: AxiosError) => {
      throw error.response?.data || error;
    });


export const UPDATE_VENUE_ACTION = (
  id: number,
  data: VenueSubmitData
): Promise<Venue> =>
  new Promise((resolve, reject) =>
    requests.venueMgmt
      .updateVenue(id, data)
      .then((response: AxiosResponse<ApiResponse<Venue>>) => {
        const updatedVenue = response.data.data;

        AppDispatch(venueActions.updateVenue(updatedVenue));

        resolve(updatedVenue);
      })
      .catch((error: AxiosError) => {
        reject(error.response?.data || "Update failed");
      })
  );

export const DELETE_VENUE_ACTION = (id: number): Promise<void> =>
  new Promise((resolve, reject) =>
    requests.venueMgmt
      .deleteVenue(id)
      .then(() => {
        AppDispatch(venueActions.removeVenue(id));
        resolve();
      })
      .catch((error: AxiosError) => {
        const err = error.response?.data;
        reject(err);
      })
  );