"use client";
import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
const DynamicHeader1 = dynamic(() => import("./HeaderHome"), { ssr: false });
const DynamicFooter1 = dynamic(() => import("./FooterHome"), { ssr: false });

const LayoutDefault = ({ children }: { children: ReactNode }) => {
  return (
    <div className="web-container flex flex-col min-vh-100 bg-white layout-default">
      <DynamicHeader1 />
      <div className="body flex-grow-1 overflow-hidden">{children}</div>
      <DynamicFooter1 />
    </div>
  );
};

export default LayoutDefault;
