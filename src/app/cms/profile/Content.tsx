"use client";
import { FC, useState } from "react";
import { Tabs } from "antd";
import UserInfoForm from "./ProfileUser/ProfileUser";
import ChangePasswordForm from "./ChangesPassword/ChangePassword";

const { TabPane } = Tabs;

const Content: FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        <TabPane tab="Thông tin cá nhân" key="1">
          <UserInfoForm />
        </TabPane>
        <TabPane tab="Đổi mật khẩu" key="2">
          <ChangePasswordForm />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Content;
