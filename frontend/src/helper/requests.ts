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
  getMy: () => api.get("/venues"),
   create: (data: any, config?: any) => api.post("/venues", data, config),
  getById: (id: number) => api.get(`/venues/${id}`),
  update: (id: number, data: any) => api.put(`/venues/${id}`, data),
  delete: (id: number) => api.delete(`/venues/${id}`),
}
const requests = { user, venueMgmt, };
export default requests;