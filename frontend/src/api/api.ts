import axios from "axios"

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
})

// Request Interceptor: Just add token if exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Added back: Simple response interceptor for refresh on 401
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const req = err.config;

        if (err.response?.status === 401 && !req._retry) {
            req._retry = true;

            try {
                const { data } = await api.post('/auth/refresh', {
                    refreshToken: localStorage.getItem('refreshToken'),
                });

                localStorage.setItem('accessToken', data.accessToken);  // Update access token
                req.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(req);  // Retry original request
            } catch {
                // Refresh failed: Clear and redirect
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        return Promise.reject(err);
    }
);

export default api;