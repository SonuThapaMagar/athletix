import api from "@/api/api";
import type { VenueSubmitData } from "@/types/venue.types/venue.types";

const user = {
  auth: {
    login: (data: { email: string; password: string }) => api.post("/auth/login", data),
    register: (data: { name: string; email: string; password: string; phone: string; location: string; role: string }) =>
      api.post("/auth/register", data),
    refreshToken: () => api.post("/auth/refresh", { refreshToken: localStorage.getItem("refreshToken") }), // Matches your backend
  },
  getMyProfile: () => api.get("/users/myProfile"),
}

const venueMgmt = {
  getVenues: (params: { page?: number; perPage?: number }) =>
    api.get("/venues", { params }),
  getMyVenues: (params?: { page?: number; perPage?: number }) =>
    api.get("/venues/myVenues", { params }),
  createVenue: (data: VenueSubmitData) => api.post("/venues", data),
  getVenueById: (id: number) => api.get(`/venues/${id}`),
  updateVenue: (id: number, data: any) => api.put(`/venues/${id}`, data),
  deleteVenue: (id: number) => api.delete(`/venues/${id}`),
}

const booking = {
  createPending: (data: {
    venueId: number;
    startTime: string;
    durationHours: number;
  }) => api.post("/bookings/create-pending", data),
  getMyBookings: () => api.get("/bookings/myBookings"),
  cancelBooking: (bookingId: number) => api.delete(`/bookings/cancel/${bookingId}`),
  getMyVenueBookings: () => api.get("/bookings/my-venue"),
};

const payment = {
  initiateEsewa: (bookingId: number) =>
    api.get(`/payments/esewa/initiate/${bookingId}`, { responseType: "text" }),
  verifyEsewa: (data: { bookingId: number; refId: string; amt: string; signature?: string }) =>
    api.post("/payments/esewa/verify", data),
  handleFailure: (bookingId: number) => 
    api.post(`/payments/esewa/failure`, null, { 
      params: { bookingId } 
    }),
  handleSuccess: (bookingId: number) => 
    api.post(`/payments/esewa/success`, null, { 
      params: { bookingId } 
    }), 

};
const requests = { user, venueMgmt, booking, payment };
export default requests;