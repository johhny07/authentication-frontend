import axios from "axios";
baseURL: import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const savedAuth = sessionStorage.getItem("auth");

      if (savedAuth) {
        const authData = JSON.parse(savedAuth);

        if (authData?.accessToken) {
          config.headers.Authorization =
            `Bearer ${authData.accessToken}`;
        }
      }

      return config;
    } catch (error) {
      sessionStorage.removeItem("auth");
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;