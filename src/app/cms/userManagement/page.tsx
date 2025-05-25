import dynamic from "next/dynamic";
const UserManagement = dynamic(() => import("./UserManagement"), {
  ssr: false,
});
const User = () => {
  return (
    <>
      <UserManagement />
    </>
  );
};

export default User;
