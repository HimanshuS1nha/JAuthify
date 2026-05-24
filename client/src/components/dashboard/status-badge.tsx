import { cn } from "@/lib/utils";

import type { InvitationStatus } from "@/types";

const invitationStatusStyles: Record<InvitationStatus, string> = {
  Pending:
    "bg-amber-500/10 text-amber-700 border border-amber-500/20 dark:text-amber-400",
  Accepted:
    "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:text-emerald-400",
  Rejected: "bg-destructive/10 text-destructive border border-destructive/20",
};

const invitationStatusDot: Record<InvitationStatus, string> = {
  Pending: "bg-amber-500",
  Accepted: "bg-emerald-500",
  Rejected: "bg-destructive",
};

const StatusBadge = ({ status }: { status: InvitationStatus }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        invitationStatusStyles[status],
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", invitationStatusDot[status])}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
