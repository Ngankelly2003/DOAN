"use client";

import React, { useState } from "react";
import { Layout, Menu, MenuProps, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faGear,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import SettingHome from "../components/SettingHome";
import { useMenuItems } from "./itemsMenu.model";
import Link from "next/link";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useTheme } from "@/app//(provider)/ThemeProvider";
import SearchHome from "./SearchHome";
import Logo from "./Logo";
import { RootState } from "@/service/store/reducers";
import { useSelector } from "react-redux";

const { Header } = Layout;

const HeaderHome = () => {
  const menuItems = useMenuItems();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState("mail");
  const { themeData, setCurrentTheme } = useTheme();
  const [currenTheme] = useState(themeData);
  const { token } = useSelector((state: RootState) => state.auth);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setCurrentTheme(currenTheme);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <Header
        style={{
          padding: "0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <div className="flex items-center justify-between h-full px-[10px]">
          <div className="flex items-center gap-4">
            <div>
              <Link href={"/"}>
                <Logo />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <span className="block leading-4 font-medium text-right	">
                  TP. Hà Nội
                </span>
                <span className="block leading-4">Thứ 2, 12/07/2025</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon size="2x" icon={faCloud} />
                <span className="ml-2">32°C</span>
              </div>
            </div>
          </div>
          <SearchHome className="!w-2/5" />

          <div>
            <Tooltip title={"Cài đặt"} className="mr-[14px]">
              <FontAwesomeIcon icon={faGear} size="xl" onClick={showModal} />
            </Tooltip>
            {!token && (
              <Tooltip title={"Đăng nhập"}>
                <Link href={"/login"} target="_blank">
                  <FontAwesomeIcon icon={faUser} size="xl" />
                </Link>
              </Tooltip>
            )}
            {token && (
              <Tooltip title={"Trang quản trị"}>
                <Link href={"/cms/dashboard"}>
                  <FontAwesomeIcon icon={faRightToBracket} size="xl" />
                </Link>
              </Tooltip>
            )}
            <SettingHome
              handleCancel={handleCancel}
              handleOk={handleOk}
              isModalOpen={isModalOpen}
            />
          </div>
        </div>
        <Menu
          style={{ lineHeight: "36px" }}
          className="flex item-center w-full justify-between px-0 !mb-2"
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={menuItems}
        />
      </Header>
    </Layout>
  );
};

export default HeaderHome;
