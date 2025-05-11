import axiosInstance from "@/service/config/axios-interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";

const prefix = "/vnpay";

export const getStatusPayment = createAsyncThunk(
  `get-status-payment`,
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`${prefix}/payment-callback`);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const createPayment = createAsyncThunk(
  `create-payment`,
  async (params: { amount: number; orderInfo: string }, thunkAPI) => {
    console.log(params.amount);

    try {
      const { data } = await axiosInstance.post(
        `${prefix}/create-payment`,
        null,
        { params: params }
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
