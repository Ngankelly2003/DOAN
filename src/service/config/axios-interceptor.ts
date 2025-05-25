import axios from "axios";
import { KEYS_STORAGE, SERVER_API_URL } from "../host";
import { getDataCookie } from "@/shared/utils/ultils";

const TIMEOUT = 2 * 60 * 1000;
export const IS_SERVER = typeof window === "undefined";

const axiosInstance = axios.create({
  baseURL: SERVER_API_URL,
  timeout: TIMEOUT,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

const AxiosRequest = async (config: any) => {
  let token =
    localStorage.getItem(KEYS_STORAGE.USER_TOKEN || JSON.stringify(null)) ||
    getDataCookie(KEYS_STORAGE.USER_TOKEN);
  if (IS_SERVER) {
    const { cookies } = await import("next/headers");
    token = JSON.parse(
      cookies().get(KEYS_STORAGE.USER_TOKEN)?.value || JSON.stringify(null)
    );
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const AxiosResponseSuccess = async (response: any) => {
  if (response.err) {
    console.log(response.err);
  }
  return response;
};

const AxiosResponseError = (err: any) => {
  const response = err?.response;
  const errorMessage =
    response.err ?? "Hệ thống đang bận, vui lòng thử lại sau";
  if (errorMessage) {
    console.log(errorMessage);
  }
  return Promise.reject(err);
};

axiosInstance.interceptors.request.use(AxiosRequest);
axiosInstance.interceptors.response.use(
  AxiosResponseSuccess,
  AxiosResponseError
);

export default axiosInstance;
