import dynamic from "next/dynamic";
const RoleManagement = dynamic(() => import("./RoleManagement"), {
  ssr: false,
});
const Role = () => {
  return (
    <>
      <RoleManagement />
    </>
  );
};

export default Role;
