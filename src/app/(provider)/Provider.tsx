"use client";

import store from "@/service/store/store";
import { Suspense } from "react";
import { Provider } from "react-redux";
// import { AuthProvider } from "./AuthProvider";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(far, fas);

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* <AuthProvider> */}
      <Suspense fallback={loading}>{children}</Suspense>
      {/* </AuthProvider> */}
    </Provider>
  );
}
