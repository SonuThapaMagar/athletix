  import api from "@/api/api";

  const user = {
    auth: {
      login: (data: { email: string; password: string }) => api.post("/auth/login", data),
      register: (data: { name: string; email: string; password: string; phone: string; location: string; role: string }) =>
        api.post("/auth/register", data),
      refreshToken: () => api.post("/auth/refresh", { refreshToken: localStorage.getItem("refreshToken") }), // Matches your backend
    },
  }
  export default { user };