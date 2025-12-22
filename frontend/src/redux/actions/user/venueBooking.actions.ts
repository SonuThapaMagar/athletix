import requests from "@/helper/requests";
import { venueBookingActions } from "@/redux/slices/player/venueBooking.slice";
import { AppDispatch } from "@/redux/store";
import type { Booking } from "@/types/player/venueBooking.types";

export const CREATE_PENDING_BOOKING_ACTION = (data: {
    venueId: number;
    startTime: string;
    durationHours: number;
    sportType?: string;
}): Promise<any> => new Promise((resolve, reject) => {
    AppDispatch(venueBookingActions.setLoading(true));
    requests.booking
        .createPending(data)
        .then((res) => {
            const booking = res.data.data;
            AppDispatch(venueBookingActions.addBooking(booking));
            resolve(booking);
        })
        .catch((err) => {
            const message = err.response?.data?.message || "Failed to create booking";
            AppDispatch(venueBookingActions.setError(message));
            reject(err);
        });
});

export const VERIFY_PAYMENT_ACTION = (data: {
    bookingId: number;
    refId: string;
    amt: string;
}): Promise<Booking> => new Promise((resolve, reject) => {
    AppDispatch(venueBookingActions.setLoading(true));

    // Create payload with signature defaulting to empty string if undefined
    const payload = {
        bookingId: data.bookingId,
        refId: data.refId,
        amt: data.amt,
    };
    console.log("🔵 Sending verification request to backend:", data);

    requests.payment
        .verifyEsewa({
            bookingId: data.bookingId,
            refId: data.refId,
            amt: data.amt,
            signature: "",
        })
        .then((res) => {
            console.log("✅ Backend verification response:", res.data);
            const booking = res.data.booking || res.data.data;
            if (!booking) {
                throw new Error('No booking data in response');
            }
            AppDispatch(venueBookingActions.updateBooking(booking));
            resolve(booking);
        })
        .catch((err) => {
            console.error("❌ Verification failed:", err.response?.data);

            const message = err.response?.data?.message || "Payment verification failed";
            AppDispatch(venueBookingActions.setError(message));
            reject(err);
        });
});

export const FETCH_MY_BOOKINGS_ACTION = (): Promise<Booking[]> =>
    new Promise((resolve, reject) => {
        AppDispatch(venueBookingActions.setLoading(true));

        requests.booking
            .getMyBookings()
            .then((res) => {
                const bookings = res.data.data || res.data;
                AppDispatch(venueBookingActions.setBookings(bookings));
                resolve(bookings);
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Failed to fetch bookings";
                AppDispatch(venueBookingActions.setError(message));
                reject(err);
            });
    });

export const CANCEL_BOOKING_ACTION = (bookingId: number): Promise<void> =>
    new Promise((resolve, reject) => {
        AppDispatch(venueBookingActions.setLoading(true));

        requests.booking
            .cancelBooking(bookingId)
            .then(() => {
                AppDispatch(venueBookingActions.removeBooking(bookingId));
                resolve();
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Failed to cancel booking";
                AppDispatch(venueBookingActions.setError(message));
                reject(err);
            });
    });
