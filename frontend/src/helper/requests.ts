import api from "@/api/api";
import type { Venue, VenueSubmitData } from "@/types/venue.types/venue.types";

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
const requests = { user, venueMgmt, };
export default requests;