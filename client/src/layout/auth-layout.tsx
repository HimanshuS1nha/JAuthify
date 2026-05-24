import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full h-full flex justify-center py-8">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
