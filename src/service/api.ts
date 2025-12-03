import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1"
})


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")
    if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Auto refresh token when 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // If unauthorized and not already retried
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // save new token
        localStorage.setItem("accessToken", newAccessToken);

        // retry original request with new token
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        // refresh failed → logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(err);
  }
);

export default api