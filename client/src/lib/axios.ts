import axiosLib, { type AxiosRequestConfig } from "axios";

import { apiRoutes } from "@/constants/api-routes";

export const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      retry?: boolean;
    };
  
    if (error.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      try {
        await axios.get(apiRoutes.auth.refreshAccessToken, { retry: true } as AxiosRequestConfig & { retry?: boolean });
        
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
