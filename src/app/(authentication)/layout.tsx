import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ backgroundColor: "#f8fafc" }}
      className=" min-vh-100 flex items-center justify-center flex-row"
    >
      {children}
    </div>
  );
}
