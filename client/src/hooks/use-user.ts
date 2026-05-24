import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { apiRoutes } from "@/constants/api-routes";
import { queryKeys } from "@/constants/query-keys";

import type { UserType } from "@/types";

export const useUser = () => {
  const { data, isPending, error } = useQuery({
    queryKey: queryKeys.getUser,
    queryFn: async () => {
      const { data } = await axios.get(apiRoutes.auth.me);

      return data as UserType;
    },
  });

  return { user: data, isPending, error };
};
