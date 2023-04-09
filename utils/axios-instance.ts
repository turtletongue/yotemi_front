import axios from "axios";

import { getRefreshedToken } from "@utils";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    originalRequest.height.Authorization = `Bearer ${await getRefreshedToken()}`;

    return await axiosInstance(originalRequest);
  }
);

export default axiosInstance;
