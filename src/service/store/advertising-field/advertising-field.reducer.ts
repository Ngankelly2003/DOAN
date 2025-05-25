import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  createAdvertisingField,
  deleteAdvertisingField,
  getAdvertisingField,
  getAdvertisingFields,
  updateAdvertisingField,
} from "./advertising-field.api";
import { RootState } from "../reducers";
import { IResponse } from "@/shared/type/IResponse";
import { IAdvertisingField } from "@/model/advertisingField.model";

interface IInitialAdvertisingFieldState {
  loading: boolean;
  AdvertisingField: IAdvertisingField | null;
  updateStatusUser: boolean;
  deleteStatusUser: boolean;
  errorMessage: string | null;
}

const initialState: IInitialAdvertisingFieldState = {
  loading: false,
  errorMessage: null,
  updateStatusUser: false,
  AdvertisingField: null,
  deleteStatusUser: false,
};

const AdvertisingFieldAdapter = createEntityAdapter({
  selectId: (AdvertisingField: IAdvertisingField) =>
    AdvertisingField.advertisingFieldId ?? ("defaultId" as EntityId),
});

const { actions, reducer } = createSlice({
  name: "AdvertisingFieldSlice",
  initialState: AdvertisingFieldAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },

    resetAll(state) {
      state.initialState.loading = false;
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatusUser = false;
      state.initialState.AdvertisingField = null;
      state.initialState.errorMessage = null;
    },
    resetEntity(state) {
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatusUser = false;
      state.initialState.loading = false;
      state.initialState.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAdvertisingFields.fulfilled,
      (state, { payload }: PayloadAction<IAdvertisingField[]>) => {
        AdvertisingFieldAdapter.setAll(state as any, payload);
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertisingFields.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      getAdvertisingField.fulfilled,
      (state, { payload }: PayloadAction<IAdvertisingField>) => {
        state.initialState.AdvertisingField = payload;
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getAdvertisingField.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      createAdvertisingField.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusUser = true;
      }
    );
    builder.addCase(
      createAdvertisingField.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      updateAdvertisingField.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusUser = true;
      }
    );
    builder.addCase(
      updateAdvertisingField.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      deleteAdvertisingField.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.deleteStatusUser = true;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      deleteAdvertisingField.rejected,
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
export const AdvertisingFieldSelectors =
  AdvertisingFieldAdapter.getSelectors<RootState>(
    (state) => state.advertisingField
  );
export default reducer;
