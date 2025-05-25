import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import { getApprovals, deleteApproval } from "./approval.api";
import { RootState } from "../reducers";
import { IResponse } from "@/shared/type/IResponse";
import { IApproval } from "@/model/Approval.model";

interface IInitialAdvertisingFieldState {
  loading: boolean;
  AdvertisingField: IApproval | null;
  updateStatusUser: boolean;
  deleteStatus: boolean;
  errorMessage: string | null;
}

const initialState: IInitialAdvertisingFieldState = {
  loading: false,
  errorMessage: null,
  updateStatusUser: false,
  AdvertisingField: null,
  deleteStatus: false,
};

const ApprovalAdapter = createEntityAdapter({
  selectId: (Approval: IApproval) => Approval.id ?? ("defaultId" as EntityId),
});

const { actions, reducer } = createSlice({
  name: "approvalSlice",
  initialState: ApprovalAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },

    resetAll(state) {
      state.initialState.loading = false;
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatus = false;
      state.initialState.AdvertisingField = null;
      state.initialState.errorMessage = null;
    },
    resetEntity(state) {
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatus = false;
      state.initialState.loading = false;
      state.initialState.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getApprovals.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IApproval[]>>) => {
        ApprovalAdapter.setAll(state as any, payload.data);
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getApprovals.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      deleteApproval.fulfilled,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.deleteStatus = true;
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      deleteApproval.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.deleteStatus = false;
      }
    );
  },
});
export const { fetching, resetAll, resetEntity } = actions;
export const ApprovalSelectors = ApprovalAdapter.getSelectors<RootState>(
  (state) => state.approval
);
export default reducer;
