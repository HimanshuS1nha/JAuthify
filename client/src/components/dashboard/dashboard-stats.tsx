import { type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "primary" | "emerald" | "amber" | "default";
}

interface DashboardStatsProps {
  stats: StatItem[];
}

const accentStyles = {
  primary: {
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    value: "text-foreground",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    value: "text-foreground",
  },
  default: {
    icon: "bg-muted text-muted-foreground",
    value: "text-foreground",
  },
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const styles = accentStyles[stat.accent ?? "default"];
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="gap-3 py-5">
            <CardContent className="flex items-center gap-4">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  styles.icon,
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={cn("text-2xl font-semibold", styles.value)}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
