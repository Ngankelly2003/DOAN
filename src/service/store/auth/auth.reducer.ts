import { KEYS_STORAGE } from "@/service/host";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILoginOAuth2Response, loginOAuth2, logoutOAuth2 } from "./auth.api";
import { setDataCookie } from "@/shared/utils/ultils";

interface IInitialAuthState {
  loading: boolean;
  errorMessage: string | null;
  token: string | null;
  loginSuccess: boolean;
  logoutSuccess: boolean;
  hasShownLoginMessage: boolean;
  roleCode: string;
}

const initialState: IInitialAuthState = {
  loading: false,
  errorMessage: null,
  token: null,
  loginSuccess: false,
  logoutSuccess: false,
  hasShownLoginMessage: false,
  roleCode: "",
};

const { actions, reducer } = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },
    logout(state) {
      state.token = null;
      state.loginSuccess = false;
      state.hasShownLoginMessage = false;
      state.roleCode = "";
      setDataCookie(KEYS_STORAGE.USER_TOKEN);
    },
    resetAll(state) {
      state.loading = false;
      state.loginSuccess = false;
      state.logoutSuccess = false;
      state.token = null;
      state.roleCode = "";
      state.errorMessage = null;
    },
    resetEntity(state) {
      state.loginSuccess = false;
      state.logoutSuccess = false;
      state.loading = false;
      state.errorMessage = null;
    },
    setLoginMessageShown: (state) => {
      state.hasShownLoginMessage = true;
    },
    setToken(state, { payload }: PayloadAction<string>) {
      setDataCookie(KEYS_STORAGE.USER_TOKEN, payload);
      state.token = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loginOAuth2.fulfilled,
      (state, { payload }: PayloadAction<ILoginOAuth2Response | any>) => {
        setDataCookie(KEYS_STORAGE.USER_TOKEN, payload.token);
        state.token = payload.token;
        state.roleCode = payload.roleCode;
        state.loginSuccess = true;
        state.loading = false;
      }
    );
    builder.addCase(
      loginOAuth2.rejected,
      (state, { payload }: PayloadAction<any>) => {
        if (payload?.msg?.includes("[423]")) {
          state.errorMessage = payload?.msg;
          state.loginSuccess = false;
          setDataCookie(KEYS_STORAGE.USER_TOKEN);
          state.token = null;
          state.loading = false;
          return;
        }
        setDataCookie(KEYS_STORAGE.USER_TOKEN);
        state.token = null;
        state.errorMessage = payload?.message || payload?.error || payload?.msg;
        state.loading = false;
        state.loginSuccess = false;
      }
    );

    builder.addCase(
      logoutOAuth2.fulfilled,
      (state, { payload }: PayloadAction<any>) => {
        if (payload.code === 0) {
          state.logoutSuccess = true;
          state.token = null;
          state.loginSuccess = false;
          state.loading = false;
          return;
        }
        state.errorMessage = payload?.message || payload?.error || payload?.msg;
      }
    );
    builder.addCase(
      logoutOAuth2.rejected,
      (state, { payload }: PayloadAction<any>) => {
        state.logoutSuccess = true;
        state.token = null;
        state.errorMessage = payload?.message || payload?.error || payload?.msg;
        state.loading = false;
        state.loginSuccess = false;
      }
    );
  },
});
export const {
  fetching,
  resetAll,
  resetEntity,
  logout,
  setToken,
  setLoginMessageShown,
} = actions;
export default reducer;
