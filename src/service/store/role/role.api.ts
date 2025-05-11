import axiosInstance from "@/service/config/axios-interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";

const prefix = "/role";

export const getRoles = createAsyncThunk(`list-role`, async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`${prefix}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getRole = createAsyncThunk(`get-role`, async (id, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`${prefix}/${id}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createRole = createAsyncThunk(
  `createUser-role`,
  async (body: any, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`${prefix}`, body);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateRole = createAsyncThunk(
  `update-role`,
  async (body: any, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(`${prefix}`, body);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteRole = createAsyncThunk(
  `delete-role`,
  async (id: Number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`${prefix}/${id}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
