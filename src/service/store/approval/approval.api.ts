import axiosInstance from "@/service/config/axios-interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";

const prefix = "/approval-requests";

export const getApprovals = createAsyncThunk(
  `list-approval-requests`,
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPendingApprovals = createAsyncThunk(
  `list-pending-approval-requests`,
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}/pending`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const approveRequest = createAsyncThunk(
  `approve-request`,
  async (id: number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(`${prefix}/${id}/approve`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteApproval = createAsyncThunk(
  `delete-approval-requests`,
  async (id: number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`${prefix}/${id}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
