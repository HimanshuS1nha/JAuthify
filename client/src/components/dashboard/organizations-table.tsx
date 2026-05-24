import { MoreHorizontalIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/data-table";

import { cn } from "@/lib/utils";
import { axios } from "@/lib/axios";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { queryKeys } from "@/constants/query-keys";
import { apiRoutes } from "@/constants/api-routes";

import type { MemberRole, OrganizationType } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

type OrganizationsTableProps = {
  organizations: OrganizationType[];
  activeOrganizationId?: string;
  role?: MemberRole;
};

const OrganizationsTable = ({
  organizations,
  activeOrganizationId,
  role,
}: OrganizationsTableProps) => {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteOrganization, isPending } = useMutation({
    mutationKey: ["delete-organization"],
    mutationFn: async (organizationId: string) => {
      const { data } = await axios.delete(
        apiRoutes.organization.deleteOrganization(organizationId),
      );

      return data as { message: string };
    },
    onSuccess: async (data, organizationId) => {
      if (organizationId === activeOrganizationId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.getActiveOrganization,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.getInvitations,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.getMembers,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.getUser,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.getUserRole,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeys.getOrganizations,
      });

      ToastHelper.successToast(data.message);
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const columns: ColumnDef<OrganizationType>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <>
          {organizations.length > 1 && role === "Owner" && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                )}
              >
                <MoreHorizontalIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDeleteOrganization(row.original.id)}
                    disabled={isPending}
                  >
                    Delete Organization
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      ),
    },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Members</h2>
        <p className="text-sm text-muted-foreground">
          {organizations.length} organization
          {organizations.length !== 1 ? "s" : ""}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        searchColumn="name"
        searchPlaceholder="Search members..."
      />
    </div>
  );
};

export default OrganizationsTable;
