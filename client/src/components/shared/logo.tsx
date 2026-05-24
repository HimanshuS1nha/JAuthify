import { IoIosLock } from "react-icons/io";

const Logo = ({ size = 20 }: { size?: number }) => {
  return (
    <div className="bg-primary w-fit rounded-full p-1.5">
      <IoIosLock color="white" size={size} />
    </div>
  );
};

export default Logo;
