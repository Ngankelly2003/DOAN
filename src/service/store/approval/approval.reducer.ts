import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { getApprovals, deleteApproval, getPendingApprovals, approveRequest } from "./approval.api";
import { RootState } from "../reducers";
import { IResponse } from "@/shared/type/IResponse";
import { IApproval } from "@/model/Approval.model";

interface IApprovalState {
  loading: boolean;
  AdvertisingField: IApproval | null;
  updateStatusUser: boolean;
  deleteStatus: boolean;
  approveStatus: boolean;
  errorMessage: string | null;
}

const ApprovalAdapter = createEntityAdapter<IApproval>();

const initialState = ApprovalAdapter.getInitialState<IApprovalState>({
  loading: false,
  errorMessage: null,
  updateStatusUser: false,
  AdvertisingField: null,
  deleteStatus: false,
  approveStatus: false,
});

const { actions, reducer } = createSlice({
  name: "approvalSlice",
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },
    resetAll(state) {
      state.loading = false;
      state.updateStatusUser = false;
      state.deleteStatus = false;
      state.approveStatus = false;
      state.AdvertisingField = null;
      state.errorMessage = null;
    },
    resetEntity(state) {
      state.updateStatusUser = false;
      state.deleteStatus = false;
      state.approveStatus = false;
      state.loading = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getApprovals.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IApproval[]>>) => {
        ApprovalAdapter.setAll(state, payload.data || []);
        state.loading = false;
      }
    );
    builder.addCase(
      getApprovals.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.loading = false;
      }
    );

    builder.addCase(
      getPendingApprovals.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IApproval[]>>) => {
        ApprovalAdapter.setAll(state, payload.data || []);
        state.loading = false;
      }
    );
    builder.addCase(
      getPendingApprovals.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.loading = false;
      }
    );

    builder.addCase(
      approveRequest.fulfilled,
      (state, { payload }: PayloadAction<any>) => {
        state.approveStatus = true;
        state.loading = false;
      }
    );
    builder.addCase(
      approveRequest.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.loading = false;
        state.approveStatus = false;
      }
    );

    builder.addCase(
      deleteApproval.fulfilled,
      (state, { payload }: PayloadAction<any>) => {
        state.deleteStatus = true;
        state.loading = false;
      }
    );
    builder.addCase(
      deleteApproval.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.loading = false;
        state.deleteStatus = false;
      }
    );
  },
});

export const { fetching, resetAll, resetEntity } = actions;
export const ApprovalSelectors = ApprovalAdapter.getSelectors<RootState>(
  (state) => state.approval
);
export default reducer;
