import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserInfo,
} from "./user.api";
import { IUser } from "@/model/user.model";
import { RootState } from "../reducers";
import { IResponse } from "@/shared/type/IResponse";

interface IInitialUserState {
  loading: boolean;
  user: IUser | null;
  updateStatusUser: boolean;
  deleteStatusUser: boolean;
  errorMessage: string | null;
}

const initialState: IInitialUserState = {
  loading: false,
  errorMessage: null,
  updateStatusUser: false,
  user: null,
  deleteStatusUser: false,
};

const userAdapter = createEntityAdapter({
  selectId: (user: IUser) => user.userId ?? ("defaultId" as EntityId),
});

const { actions, reducer } = createSlice({
  name: "userSlice",
  initialState: userAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },

    resetAll(state) {
      state.initialState.loading = false;
      state.initialState.updateStatusUser = false;
      state.initialState.deleteStatusUser = false;
      state.initialState.user = null;
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
      getUsers.fulfilled,
      (state, { payload }: PayloadAction<IResponse<IUser[]>>) => {
        userAdapter.setAll(state as any, payload.data);
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getUsers.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      getUserInfo.fulfilled,
      (state, { payload }: PayloadAction<IUser>) => {
        state.initialState.user = payload;
        state.initialState.loading = false;
      }
    );
    builder.addCase(
      getUserInfo.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
      }
    );

    builder.addCase(
      createUser.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusUser = true;
      }
    );
    builder.addCase(
      createUser.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      updateUser.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.updateStatusUser = true;
      }
    );
    builder.addCase(
      updateUser.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.initialState.errorMessage =
          payload?.message || payload?.error || payload?.msg;
        state.initialState.loading = false;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      deleteUser.fulfilled,
      (state, { payload }: PayloadAction<IResponse<any>>) => {
        state.initialState.loading = false;
        state.initialState.deleteStatusUser = true;
        state.initialState.updateStatusUser = false;
      }
    );
    builder.addCase(
      deleteUser.rejected,
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
export const userSelectors = userAdapter.getSelectors<RootState>(
  (state) => state.user
);
export default reducer;
