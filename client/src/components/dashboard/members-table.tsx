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
import { DataTable } from "@/components/dashboard/data-table";
import { buttonVariants } from "@/components/ui/button";
import RoleBadge from "@/components/dashboard/role-badge";

import { cn } from "@/lib/utils";
import { axios } from "@/lib/axios";

import { useUser } from "@/hooks/use-user";

import { formatDate } from "@/helpers/format-date";
import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { apiRoutes } from "@/constants/api-routes";
import { queryKeys } from "@/constants/query-keys";

import { type MemberRole, type MemberType } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

type MembersTableProps = {
  members: MemberType[];
  role?: MemberRole;
};

const MembersTable = ({ members, role }: MembersTableProps) => {
  const { user } = useUser();

  const queryClient = useQueryClient();

  const { mutate: handleUpdateRole, isPending: updateRolePending } =
    useMutation({
      mutationKey: ["update-role"],
      mutationFn: async ({
        memberId,
        role,
      }: {
        memberId: string;
        role: MemberRole;
      }) => {
        const { data } = await axios.patch(
          apiRoutes.organization.updateMemberRole(memberId),
          { role },
        );

        return data as { message: string };
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.getMembers });

        ToastHelper.successToast(data.message);
      },
      onError: (error) => {
        ToastHelper.errorToast(parseErrorToString(error));
      },
    });

  const { mutate: handleRemoveMember, isPending: removeMemberPending } =
    useMutation({
      mutationKey: ["remove-member"],
      mutationFn: async (memberId: string) => {
        const { data } = await axios.delete(
          apiRoutes.organization.removeMember(memberId),
        );

        return data as { message: string };
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.getMembers });

        ToastHelper.successToast(data.message);
      },
      onError: (error) => {
        ToastHelper.errorToast(parseErrorToString(error));
      },
    });

  const membersColumns: ColumnDef<MemberType>[] = [
    {
      accessorKey: "name",
      header: "Member",
      enableSorting: true,
      cell: ({ row }) => {
        const name = row.original.name;
        const email = row.original.email;
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-medium leading-none">{name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      enableSorting: true,
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <>
            {row.original.role !== "Owner" &&
              row.original.userId !== user?.id &&
              // No actions allowed for Members
              role !== "Member" && (
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
                        onClick={() =>
                          handleUpdateRole({
                            memberId: row.original.id,
                            role:
                              row.original.role === "Member"
                                ? "Admin"
                                : "Member",
                          })
                        }
                        disabled={updateRolePending}
                      >
                        {row.original.role === "Member"
                          ? "Promote to Admin"
                          : "Demote to Member"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleRemoveMember(row.original.id)}
                        disabled={removeMemberPending}
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Members</h2>
        <p className="text-sm text-muted-foreground">
          {members.length} member{members.length !== 1 ? "s" : ""} in your
          organization
        </p>
      </div>

      <DataTable
        columns={membersColumns}
        data={members}
        searchColumn="name"
        searchPlaceholder="Search members..."
      />
    </div>
  );
};

export default MembersTable;
