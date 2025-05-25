import axiosInstance from "@/service/config/axios-interceptor";
import { KEYS_STORAGE } from "@/service/host";
import { IUser } from "@/model/user.model";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDataCookie } from "@/shared/utils/ultils";

export interface ILoginForm {
  userName: string;
  userPassword: string;
}

export interface ILoginOAuth2Response {
  user_info: IUser;
  access_token: string;
  refresh_token: string;
  user_id: string;
  username: string;
}

export const loginOAuth2 = createAsyncThunk(
  `login-oauth`,
  async (body: ILoginForm, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post<any>(`/auth/login`, body);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logoutOAuth2 = createAsyncThunk(
  `logout-oauth`,
  async (_, thunkAPI) => {
    try {
      const token = getDataCookie(KEYS_STORAGE.USER_TOKEN);

      const { data } = await axiosInstance.delete(`/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
