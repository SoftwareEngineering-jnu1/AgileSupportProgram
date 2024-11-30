import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const initInstance = (config: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    timeout: 5000,
    ...config,
    headers: {
      // Accept: 'application/json',
      "Content-Type": "application/json",
      ...config.headers,
    },
  });
  return instance;
};

const BASE_URL = "http://localhost:8080/SE";

export const fetchInstance = initInstance({
  baseURL: BASE_URL,
});
