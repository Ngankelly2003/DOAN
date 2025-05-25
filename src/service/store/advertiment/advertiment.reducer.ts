import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  createAdvertiment,
  deleteAdvertiment,
  getAdvertiment,
  getAdvertiments,
  getAdvertimentByUser,
  updateAdvertiment,
  approvalAdvertiment,
  revenueAdvertiment,
  exportFileAdvertiment,
  getAdvertimentHome,
  requestApprovalAdvertiment,
} from "./advertiment.api";
import { RootState } from "../reducers";
import { IResponse } from "@/shared/type/IResponse";
import { IAdvertisement } from "@/model/advertisement.model";

interface IInitialAdvertisementState {
  loading: boolean;
  advertisement: IAdvertisement | null;
  advertisementHome: IAdvertisement[];
  updateStatusUser: boolean;
  deleteStatusUser: boolean;
  approvalStatus: boolean;
  errorMessage: string | null;
  revenue: null;
  isRequestApproval: boolean;
}

const initialState: IInitialAdvertisementState = {
  loading: false,
  errorMessage: null,
  updateStatusUser: false,
  advertisement: null,
  deleteStatusUser: false,
  approvalStatus: false,
  isRequestApproval: false,
  revenue: null,
  advertisementHome: [],
};

const advertisementAdapter = createEntityAdapter({
  selectId: (advertisement: IAdvertisement) =>
    advertisement.advertisementId ?? ("defaultId" as EntityId),
});

const { actions, reducer } = createSlice({
  name: "advertisementSlice",
  initialState: advertisementAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },

    resetAll(state) {
      state.initialState.loading = false;
      state.initialState.approvalStatus = false;
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatusUser = false;
      state.initialState.isRequestApproval = false;
      state.initialState.advertisement = null;
      state.initialState.advertisementHome = [];
      state.initialState.errorMessage = null;
    },
    resetEntity(state) {
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatusUser = false;
      state.initialState.isRequestApproval = false;
      state.initialState.approvalStatus = false;
      state.initialState.loading = false;
      state.initialState.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAdvertiments.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IAdvertisement[]>>) => {
        advertisementAdapter.setAll(state as any, payload.data);
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertiments.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      getAdvertimentByUser.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IAdvertisement[]>>) => {
        advertisementAdapter.setAll(state as any, payload.data);
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertimentByUser.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      getAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IAdvertisement>) => {
        state.initialState.advertisement = payload;
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      getAdvertimentHome.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IAdvertisement[]>>) => {
        state.initialState.advertisementHome = payload.data;
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertimentHome.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      createAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusUser = true;
      }
    );
    builder.addCase(
      createAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      updateAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusUser = true;
      }
    );
    builder.addCase(
      updateAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
      }
    );

    builder.addCase(
      approvalAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.approvalStatus = true;
      }
    );
    builder.addCase(
      approvalAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.approvalStatus = false;
      }
    );

    builder.addCase(
      requestApprovalAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.isRequestApproval = true;
      }
    );
    builder.addCase(
      requestApprovalAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.isRequestApproval = false;
      }
    );

    builder.addCase(
      revenueAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.revenue = payload.data;
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      revenueAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      exportFileAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        try {
          console.log(payload);

          const url = window.URL.createObjectURL(new Blob([payload.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Advertisement.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {}
      }
    );
    builder.addCase(
      exportFileAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      deleteAdvertiment.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.deleteStatusUser = true;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      deleteAdvertiment.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
        state.initialState.deleteStatusUser = false;
      }
    );
  },
});
export const { fetching, resetAll, resetEntity } = actions;
export const advertisementSelectors =
  advertisementAdapter.getSelectors<RootState>((state) => state.advertiment);
export default reducer;
