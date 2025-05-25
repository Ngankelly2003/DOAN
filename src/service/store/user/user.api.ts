import axiosInstance from "@/service/config/axios-interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";

const prefix = "/user";

export const getUsers = createAsyncThunk(`list-user`, async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`${prefix}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getUser = createAsyncThunk(`get-user`, async (id, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`${prefix}/${id}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getUserInfo = createAsyncThunk(
  `get-user-info`,
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`auth/info`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createUser = createAsyncThunk(
  `createUser-user`,
  async (body: any, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`${prefix}`, body);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  `update-user`,
  async (body: any, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(`${prefix}`, body);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  `delete-user`,
  async (id: Number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`${prefix}/${id}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
