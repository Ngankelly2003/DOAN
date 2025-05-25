"use client";
import { RootState } from "@/service/store/reducers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const AuthProtected = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);
  return <>{children}</>;
};
export default AuthProtected;
