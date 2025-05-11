import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "./role.api";
import { RootState } from "../reducers";
import { IResponse } from "@/shared/type/IResponse";
import { IRole } from "@/model/role.model";

interface IInitialRoleState {
  loading: boolean;
  updateStatusRole: boolean;
  deleteStatusRole: boolean;
  errorMessage: string | null;
}

const initialState: IInitialRoleState = {
  loading: false,
  errorMessage: null,
  updateStatusRole: false,
  deleteStatusRole: false,
};

const roleAdapter = createEntityAdapter({
  selectId: (role: IRole) => role.roleId ?? ("defaultId" as EntityId),
});

const { actions, reducer } = createSlice({
  name: "roleSlice",
  initialState: roleAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },

    resetAll(state) {
      state.initialState.loading = false;
      state.initialState.updateStatusRole = false;
      state.initialState.deleteStatusRole = false;
      state.initialState.errorMessage = null;
    },
    resetEntity(state) {
      state.initialState.updateStatusRole = false;
      state.initialState.deleteStatusRole = false;
      state.initialState.loading = false;
      state.initialState.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getRoles.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IRole[]>>) => {
        roleAdapter.setAll(state as any, payload.data);
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getRoles.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      createRole.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusRole = true;
      }
    );
    builder.addCase(
      createRole.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusRole = false;
      }
    );
    builder.addCase(
      updateRole.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusRole = true;
      }
    );
    builder.addCase(
      updateRole.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusRole = false;
      }
    );
    builder.addCase(
      deleteRole.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.deleteStatusRole = true;
        state.initialState.updateStatusRole = false;
      }
    );
    builder.addCase(
      deleteRole.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusRole = false;
        state.initialState.deleteStatusRole = false;
      }
    );
  },
});
export const { fetching, resetAll, resetEntity } = actions;
export const roleSelectors = roleAdapter.getSelectors<RootState>(
  (state) => state.role
);
export default reducer;
