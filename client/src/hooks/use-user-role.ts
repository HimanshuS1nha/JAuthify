import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { apiRoutes } from "@/constants/api-routes";
import { queryKeys } from "@/constants/query-keys";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import type { MemberRole } from "@/types";

export const useUserRole = () => {
  const { data, isPending, error } = useQuery({
    queryKey: queryKeys.getUserRole,
    queryFn: async () => {
      const { data } = await axios.get(apiRoutes.organization.getRole);

      return data as { role: MemberRole };
    },
  });

  useEffect(() => {
    if (error) {
      ToastHelper.errorToast(parseErrorToString(error));
    }
  }, [error]);

  return { role: data?.role, isPending, error };
};
