import requests from "@/helper/requests";
import { adminBookingActions } from "@/redux/slices/admin/booking.slice";
import { AppDispatch } from "@/redux/store";
import type { AdminBooking, BookingFilters } from "@/types/admin/booking.types";
import type { PaginationResponse } from "@/types/venueOwner/payment.types";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/axiosResponse.types";

export const FETCH_ADMIN_BOOKINGS_ACTION = (filters?: BookingFilters): Promise<{ bookings: AdminBooking[]; pagination: any }> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminBookingActions.setLoading(true));

    requests.admin.booking
      .getBookings(filters)
      .then((res: AxiosResponse<ApiResponse<PaginationResponse<AdminBooking>>>) => {
        const paginatedData = res.data.data || res.data;
        const bookings = paginatedData.items || [];
        const pagination = paginatedData.pagination;
        AppDispatch(adminBookingActions.setBookings({ bookings, pagination }));
        resolve({ bookings, pagination });
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch bookings";
        AppDispatch(adminBookingActions.setError(message));
        reject(err);
      });
  });

export const FETCH_ADMIN_BOOKING_BY_ID_ACTION = (bookingId: number): Promise<AdminBooking> =>
  new Promise((resolve, reject) => {
    AppDispatch(adminBookingActions.setLoading(true));

    requests.admin.booking
      .getBookingById(bookingId)
      .then((res: AxiosResponse<ApiResponse<AdminBooking>>) => {
        const booking = res.data.data || res.data;
        AppDispatch(adminBookingActions.setSelectedBooking(booking));
        AppDispatch(adminBookingActions.setLoading(false));
        resolve(booking);
      })
      .catch((err: any) => {
        const message = err.response?.data?.message || "Failed to fetch booking";
        AppDispatch(adminBookingActions.setError(message));
        reject(err);
      });
  });
