import { DataTable } from "@/components/dashboard/data-table";

import { formatDate } from "@/helpers/format-date";

import type { ColumnDef } from "@tanstack/react-table";
import type { SessionType } from "@/types";

type SessionsTableProps = {
  sessions: SessionType[];
};

const SessionsTable = ({ sessions }: SessionsTableProps) => {
  const columns: ColumnDef<SessionType>[] = [
    {
      accessorKey: "browserName",
      enableSorting: true,
      header: "Browser",
    },
    {
      accessorKey: "osName",
      enableSorting: true,
      header: "Operating System",
    },
    {
      accessorKey: "createdAt",
      enableSorting: true,
      header: "Logged in on",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </span>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      enableSorting: true,
      header: "Expires At",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.expiresAt)}
          </span>
        );
      },
    },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Members</h2>
        <p className="text-sm text-muted-foreground">
          {sessions.length} session{sessions.length !== 1 ? "s" : ""} across
          devices
        </p>
      </div>

      <DataTable
        columns={columns}
        data={sessions}
        searchColumn="browserName"
        searchPlaceholder="Search by browser..."
      />
    </div>
  );
};

export default SessionsTable;
