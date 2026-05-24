import { Outlet } from "react-router-dom";

import Navbar from "@/components/shared/navbar";

const RootLayout = () => {
  return (
    <div className="px-4 sm:px-10 md:px-24 lg:px-40">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
