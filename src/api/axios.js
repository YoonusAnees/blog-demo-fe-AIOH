import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");
    const isLoginRequest =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/admin/login") ||
      originalRequest?.url?.includes("/auth/google") ||
      originalRequest?.url?.includes("/auth/author/register") ||
      originalRequest?.url?.includes("/auth/admin/register") ||
      originalRequest?.url?.includes("/auth/check-email") ||
      originalRequest?.url?.includes("/auth/reset-password");

    if (isRefreshRequest) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");

        localStorage.setItem("accessToken", res.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;