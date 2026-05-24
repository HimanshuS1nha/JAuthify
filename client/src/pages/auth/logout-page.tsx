import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { axios } from "@/lib/axios";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { apiRoutes } from "@/constants/api-routes";
import { routes } from "@/constants/routes";
import { queryKeys } from "@/constants/query-keys";

const LogoutPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: handleLogout, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async (action: "logout" | "logout-all") => {
      const { data } = await axios.get(
        action === "logout" ? apiRoutes.auth.logout : apiRoutes.auth.logoutAll,
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: queryKeys.getUser });

      ToastHelper.successToast(data.message);

      navigate(routes.home, { replace: true });
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Logout</CardTitle>
        <CardDescription>Logout of your account(s)</CardDescription>
      </CardHeader>

      <CardFooter className="flex gap-x-3">
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => handleLogout("logout")}
        >
          Logout of current session
        </Button>
        <Button
          variant={"destructive"}
          disabled={isPending}
          onClick={() => handleLogout("logout-all")}
        >
          Logout of all sessions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LogoutPage;
