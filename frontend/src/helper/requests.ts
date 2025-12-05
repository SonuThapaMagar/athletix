import api from "@/api/api";

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
  getVenues: () => api.get("/venues"),
  getMy: () => api.get("/venues/my"),
  createVenue: (data: any, config?: any) => api.post("/venues", data, config),
  getVenueById: (id: number) => api.get(`/venues/${id}`),
  updateVenue: (id: number, data: any) => api.put(`/venues/${id}`, data),
  deleteVenue: (id: number) => api.delete(`/venues/${id}`),
}
const requests = { user, venueMgmt, };
export default requests;