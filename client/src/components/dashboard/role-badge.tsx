import { cn } from "@/lib/utils";
import type { MemberRole } from "@/types";

const roleStyles: Record<MemberRole, string> = {
  Admin: "bg-primary/10 text-primary border border-primary/20",
  Owner: "bg-accent text-accent-foreground border border-border",
  Member: "bg-muted text-muted-foreground border border-border",
};

const RoleBadge = ({ role }: { role: MemberRole }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        roleStyles[role],
      )}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
