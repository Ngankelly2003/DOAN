import { Avatar } from "antd";
import Title from "antd/es/typography/Title";
import Image from "next/image";
import avata from "@/assets/img/avata.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/service/store/reducers";
import { useEffect } from "react";
import { getUserInfo } from "@/service/store/user/user.api";

interface IPropAvatarContainer {
  className?: string;
  textColor?: string;
  collapsed?: boolean;
}
const AvatarContainer = (props: IPropAvatarContainer) => {
  const { className, textColor, collapsed } = props;
  const { user } = useSelector((state: RootState) => state.user.initialState);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserInfo() as any);
  }, []);

  return (
    <div
      className={`logo ${className}`}
      style={{
        height: "64px",
        display: "flex",
        gap: "6px",
        alignItems: "center",
        padding: "0 16px",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      <Avatar
        size="large"
        style={{ marginRight: "10px" }}
        src={<Image src={avata} alt="User Avatar" width={32} height={32} />}
      />
      {!collapsed && (
        <Title
          level={5}
          style={{ margin: 0, color: `${textColor ? textColor : "#000"}` }}
        >
          {user?.userName ?? "User"}
        </Title>
      )}
    </div>
  );
};
export default AvatarContainer;
