import { Outlet } from "react-router-dom";

const GradientLayout = () => {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-150 w-225 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-5%] right-[-5%] h-125 w-125 rounded-full bg-accent/60 blur-3xl" />
      </div>
      <Outlet />
    </>
  );
};

export default GradientLayout;
