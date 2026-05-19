import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let csrfToken = null;

export const fetchCsrfToken = async () => {
  try {
    const { data } = await api.get('/csrf-token');
    csrfToken = data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

api.interceptors.request.use((config) => {
  if (csrfToken && !['get', 'head', 'options'].includes(config.method?.toLowerCase())) {
    config.headers['x-csrf-token'] = csrfToken;
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
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");

        // The HttpOnly cookie is automatically updated by the browser.
        // We just need to retry the original request.
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
