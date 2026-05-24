import { useState } from "react";
import { MoreHorizontalIcon, SendIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/dashboard/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import InviteUserDialog from "@/components/dashboard/invite-user-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import RoleBadge from "@/components/dashboard/role-badge";
import StatusBadge from "@/components/dashboard/status-badge";

import { cn } from "@/lib/utils";
import { axios } from "@/lib/axios";

import { formatDate } from "@/helpers/format-date";
import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { apiRoutes } from "@/constants/api-routes";
import { queryKeys } from "@/constants/query-keys";

import { type InvitationType } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

interface InvitationsTableProps {
  invitations: InvitationType[];
}

const InvitationsTable = ({ invitations }: InvitationsTableProps) => {
  const queryClient = useQueryClient();

  const { mutate: handleDeleteInvitation, isPending } = useMutation({
    mutationKey: ["update-role"],
    mutationFn: async ({
      invitationId,
      inviteeEmail,
    }: {
      invitationId: string;
      inviteeEmail: string;
    }) => {
      const { data } = await axios.delete(
        apiRoutes.organization.deleteInvitation(invitationId,inviteeEmail),
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getInvitations,
      });

      ToastHelper.successToast(data.message);
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const invitationsColumns: ColumnDef<InvitationType>[] = [
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.inviteeEmail}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      enableSorting: true,
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "invitedBy",
      header: "Invited By",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.inviterName}
        </span>
      ),
    },
    {
      accessorKey: "sentAt",
      header: "Sent",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.expiresAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
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
                  onClick={() =>
                    handleDeleteInvitation({
                      invitationId: row.original.id,
                      inviteeEmail: row.original.inviteeEmail,
                    })
                  }
                  disabled={isPending}
                >
                  Revoke Invitation
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const pendingCount = invitations.filter((i) => i.status === "Pending").length;

  const [isInviteUserDialogOpen, setIsInviteUserDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <InviteUserDialog
        open={isInviteUserDialogOpen}
        setOpen={setIsInviteUserDialogOpen}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Invitations</h2>
          <p className="text-sm text-muted-foreground">
            {pendingCount} pending invitation{pendingCount !== 1 ? "s" : ""}
          </p>
        </div>

        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setIsInviteUserDialogOpen(true)}
        >
          <SendIcon className="size-4" />
          Send Invitation
        </Button>
      </div>

      <DataTable
        columns={invitationsColumns}
        data={invitations}
        searchColumn="email"
        searchPlaceholder="Search by email..."
      />
    </div>
  );
};

export default InvitationsTable;
