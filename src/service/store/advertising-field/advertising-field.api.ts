import axiosInstance from "@/service/config/axios-interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";

const prefix = "/advertising-fields";

export const getAdvertisingFields = createAsyncThunk(
  `list-advertising-fields`,
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAdvertisingField = createAsyncThunk(
  `get-advertising-fields`,
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}/${id}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createAdvertisingField = createAsyncThunk(
  `createUser-advertising-fields`,
  async (body: any, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`${prefix}`, body);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateAdvertisingField = createAsyncThunk(
  `update-advertising-fields`,
  async (body: any, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(`${prefix}`, body);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteAdvertisingField = createAsyncThunk(
  `delete-advertising-fields`,
  async (id: Number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`${prefix}/${id}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
