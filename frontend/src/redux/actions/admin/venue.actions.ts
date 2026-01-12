import requests from "@/helper/requests";
import { adminVenueActions } from "@/redux/slices/admin/venue.slice";
import { AppDispatch } from "@/redux/store";
import type { AdminVenue, VenueFilters } from "@/types/admin/venue.types";
import type { PaginationResponse } from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_ADMIN_VENUES_ACTION = (filters?: VenueFilters): Promise<{ venues: AdminVenue[]; pagination: any }> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminVenueActions.setLoading(true));

    requests.admin.venue
      .getVenues(filters)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<AdminVenue> | AdminVenue[]>>) => {
        const responseData = res.data.data || res.data;
        
        // Handle both cases: direct array or paginated response
        let venues: AdminVenue[] = [];
        let pagination: any = null;
        
        if (Array.isArray(responseData)) {
          // Direct array response
          venues = responseData;
        } else if (responseData && typeof responseData === 'object' && 'items' in responseData) {
          // Paginated response
          venues = responseData.items || [];
          pagination = responseData.pagination || null;
        }
        
        AppDispatch(adminVenueActions.setVenues({ venues, pagination }));
        resolve({ venues, pagination });
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch venues";
        AppDispatch(adminVenueActions.setError(message));
        reject(err);
      });
  });

export const FETCH_ADMIN_VENUE_BY_ID_ACTION = (venueId: number): Promise<AdminVenue> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminVenueActions.setLoading(true));

    requests.admin.venue
      .getVenueById(venueId)
      .then((res: AxiosResponse<ApiResponse<AdminVenue>>) => {
        const venue = res.data.data || res.data;
        AppDispatch(adminVenueActions.setSelectedVenue(venue));
        AppDispatch(adminVenueActions.setLoading(false));
        resolve(venue);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch venue";
        AppDispatch(adminVenueActions.setError(message));
        reject(err);
      });
  });

export const UPDATE_ADMIN_VENUE_ACTION = (venueId: number, data: Partial<AdminVenue>): Promise<AdminVenue> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminVenueActions.setLoading(true));

    requests.admin.venue
      .updateVenue(venueId, data)
      .then((res: AxiosResponse<ApiResponse<AdminVenue>>) => {
        const venue = res.data.data || res.data;
        AppDispatch(adminVenueActions.updateVenue(venue));
        AppDispatch(adminVenueActions.setLoading(false));
        resolve(venue);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to update venue";
        AppDispatch(adminVenueActions.setError(message));
        reject(err);
      });
  });

export const DELETE_ADMIN_VENUE_ACTION = (venueId: number): Promise<void> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminVenueActions.setLoading(true));

    requests.admin.venue
      .deleteVenue(venueId)
      .then(() => {
        AppDispatch(adminVenueActions.removeVenue(venueId));
        AppDispatch(adminVenueActions.setLoading(false));
        resolve();
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to delete venue";
        AppDispatch(adminVenueActions.setError(message));
        reject(err);
      });
  });

