import requests from "@/helper/requests";
import { venueOwnerBookingActions } from "@/redux/slices/venueOwner/venueOwnerBooking.slice";
import { AppDispatch } from "@/redux/store";
import type { VenueOwnerBooking } from "@/types/venueOwner/venueOwnerBooking.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_VENUE_OWNER_BOOKINGS_ACTION = (): Promise<VenueOwnerBooking[]> =>
  new Promise((resolve, reject) => {
    AppDispatch(venueOwnerBookingActions.setLoading(true));

    requests.booking
      .getMyVenueBookings()
      .then((res: AxiosResponse<ApiResponse<VenueOwnerBooking[]>>) => {
        // Handle both wrapped and unwrapped responses
        const bookings = res.data.data || res.data || [];
        AppDispatch(venueOwnerBookingActions.setBookings(bookings));
        AppDispatch(venueOwnerBookingActions.setLoading(false));
        resolve(bookings);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch bookings";
        AppDispatch(venueOwnerBookingActions.setError(message));
        reject(err);
      });
  });

export const CONFIRM_BOOKING_ACTION = (bookingId: number): Promise<VenueOwnerBooking> =>
  new Promise((resolve, reject) => {
    AppDispatch(venueOwnerBookingActions.setLoading(true));

    requests.booking
      .confirmBooking(bookingId)
      .then((res: AxiosResponse<ApiResponse<VenueOwnerBooking>>) => {
        const booking = res.data.data;
        AppDispatch(venueOwnerBookingActions.updateBooking(booking));
        resolve(booking);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to confirm booking";
        AppDispatch(venueOwnerBookingActions.setError(message));
        reject(err);
      });
  });

export const CANCEL_VENUE_OWNER_BOOKING_ACTION = (bookingId: number): Promise<void> =>
  new Promise((resolve, reject) => {
    AppDispatch(venueOwnerBookingActions.setLoading(true));

    requests.booking
      .cancelBooking(bookingId)
      .then(() => {
        AppDispatch(venueOwnerBookingActions.removeBooking(bookingId));
        resolve();
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to cancel booking";
        AppDispatch(venueOwnerBookingActions.setError(message));
        reject(err);
      });
  });

export const FETCH_VENUE_OWNER_BOOKING_BY_ID_ACTION = (bookingId: number): Promise<VenueOwnerBooking> =>
  new Promise((resolve, reject) => {
    AppDispatch(venueOwnerBookingActions.setLoading(true));

    requests.booking
      .getBookingById(bookingId)
      .then((res: AxiosResponse<ApiResponse<VenueOwnerBooking>>) => {
        const booking = res.data.data || res.data;
        AppDispatch(venueOwnerBookingActions.setSelectedBooking(booking));
        resolve(booking);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch booking";
        AppDispatch(venueOwnerBookingActions.setError(message));
        reject(err);
      });
  });
