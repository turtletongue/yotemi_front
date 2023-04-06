import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log(1, originalRequest);

    if (error.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    console.log(2);

    originalRequest._retry = true;
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication/refresh`,
      null,
      {
        withCredentials: true,
      }
    );

    originalRequest.height.Authorization = `Bearer ${data.accessToken}`;

    return await axiosInstance(originalRequest);
  }
);

export default axiosInstance;
