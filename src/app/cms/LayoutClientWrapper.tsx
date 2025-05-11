"use client";

import { ReactNode, useEffect, useState } from "react";
import { Layout, Button, Dropdown, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { getUserInfo } from "@/service/store/user/user.api";
import { useMenuItems } from "@/shared/home/itemsMenu.model";
import Link from "next/link";
import dynamic from "next/dynamic";
import { logout } from "@/service/store/auth/auth.reducer";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Logo = dynamic(() => import("@/shared/home/Logo"), { ssr: false });
const AuthProtected = dynamic(() => import("../(provider)/AuthProtected"), {
  ssr: false,
});
const AvatarContainer = dynamic(
  () => import("../../shared/components/avata/Avata"),
  { ssr: false }
);
const Sidebar = dynamic(() => import("../../shared/home/Sidebar"), {
  ssr: false,
});

const { Header, Content } = Layout;

const LayoutClientWrapper = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = useMenuItems();
  const dispatch = useDispatch();
  const navigate = useRouter();

  useEffect(() => {
    dispatch(getUserInfo() as any);
  }, []);

  const handleLogout = () => {
    toast.success("Đăng xuất thành công");
    dispatch(logout());
    navigate.push("/login");
  };
  const handleProfile = () => {
    navigate.push("/cms/profile");
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
      <Menu.Item key="2" icon={<ProfileOutlined />} onClick={handleProfile}>
        Hồ sơ cá nhân
      </Menu.Item>
    </Menu>
  );

  return (
    <AuthProtected>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} />
        <Layout>
          <Header style={{ padding: 0, background: "#fff" }}>
            <div
              className="flex item-center"
              style={{ justifyContent: "space-between" }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: "16px", width: 64, height: 64 }}
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Link href={"/"}>
                  <Logo />
                </Link>
              </div>
              {menuItems.map((item: any, index: number) => (
                <span
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={item.onClick}
                >
                  {item.label}
                </span>
              ))}
              <Dropdown overlay={menu} trigger={["click"]}>
                <div style={{ cursor: "pointer" }}>
                  <AvatarContainer />
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: "#fff",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </AuthProtected>
  );
};

export default LayoutClientWrapper;
