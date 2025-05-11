"use client";

import { KEYS_STORAGE } from "@/service/host";
import { setToken } from "@/service/store/auth/auth.reducer";
import { AppDispatch } from "@/service/store/store";
import { getDataCookie } from "@/shared/utils/ultils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/service/store/reducers";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let tempToken = token;
    if (!tempToken) {
      tempToken = getDataCookie(KEYS_STORAGE.USER_TOKEN) || "";
    }

    if (tempToken) {
      dispatch(setToken(tempToken));
    }
  }, [token]);

  return <>{children}</>;
}
