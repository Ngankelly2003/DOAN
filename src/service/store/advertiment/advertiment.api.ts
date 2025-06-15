import axiosInstance from "@/service/config/axios-interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosRequestConfig } from "axios";

const prefix = "/advertisement";

export const getAdvertiments = createAsyncThunk(
  `list-advertisement`,
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAdvertiment = createAsyncThunk(
  `get-advertisement`,
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}/${id}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAdvertimentByUser = createAsyncThunk(
  `get-advertisement-user`,
  async (id: number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}/user/${id}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAdvertimentHome = createAsyncThunk(
  `get-home-advertisement`,
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/home/advertisement-approval`);
      console.log("Advertisement Home API Response:", data);
      return data;
    } catch (error: any) {
      console.error("Error fetching advertisement home:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createAdvertiment = createAsyncThunk(
  `createUser-advertisement`,
  async (body: any, thunkAPI) => {
    try {
      console.log("Creating advertisement with data:", body);
      const { data } = await axiosInstance.post(`${prefix}`, body);
      console.log("Advertisement created with response:", data);
      return data;
    } catch (error: any) {
      console.error("Error creating advertisement:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateAdvertiment = createAsyncThunk(
  `update-advertisement`,
  async (body: any, thunkAPI) => {
    try {
      console.log("Updating advertisement with data:", body);
      const { data } = await axiosInstance.put(`${prefix}`, body);
      console.log("Advertisement updated with response:", data);
      return data;
    } catch (error: any) {
      console.error("Error updating advertisement:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//phê duyệt
export const approvalAdvertiment = createAsyncThunk(
  `approval-advertisement`,
  async (id: number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(`${prefix}/${id}/approve`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
// gửi phê duyệt
export const requestApprovalAdvertiment = createAsyncThunk(
  `request-approval-advertisement`,
  async (id: number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        `${prefix}/${id}/request-approval`
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const revenueAdvertiment = createAsyncThunk(
  `revenue-advertisement`,
  async (id: number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}/${id}/revenue`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//xuất file
export const exportFileAdvertiment = createAsyncThunk(
  `export-advertisement`,
  async (_, thunkAPI: any): Promise<any> => {
    const config: AxiosRequestConfig<any> = { responseType: "blob" };
    try {
      return await axiosInstance.get(`${prefix}/export-advertisements`, config);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteAdvertiment = createAsyncThunk(
  `delete-advertisement`,
  async (id: Number, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`${prefix}/${id}`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
