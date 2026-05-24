import { Link, useNavigate } from "react-router-dom";

import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUser } from "@/hooks/use-user";

import { routes } from "@/constants/routes";

const Navbar = () => {
  const { user, isPending } = useUser();

  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className="flex justify-between items-center py-2.5">
      <Link to={routes.home} className="flex gap-x-2.5 items-center">
        <Logo />
        <p className="font-semibold">JAuthify</p>
      </Link>

      <div className="flex gap-x-9 items-center">
        <button className="hover:text-primary hover:font-medium delay-100 text-sm">
          Home
        </button>
        <button
          className="hover:text-primary hover:font-medium delay-100 text-sm"
          onClick={() => scrollToSection("features")}
        >
          Features
        </button>
        <button
          className="hover:text-primary hover:font-medium delay-100 text-sm"
          onClick={() => scrollToSection("contact")}
        >
          Contact Us
        </button>
      </div>

      {isPending ? (
        <Loading />
      ) : user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={"rounded-full size-8 bg-primary text-white"}
          >
            {user.name[0]}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(routes.dashboard)}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(routes.auth.changePassword)}
              >
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem>Contact Us</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => navigate(routes.auth.logout)}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-x-3 items-center">
          <Button variant={"outline"}>
            <Link to={routes.auth.login()}>Login</Link>
          </Button>
          <Button>
            <Link to={routes.auth.register}>Get Started</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
