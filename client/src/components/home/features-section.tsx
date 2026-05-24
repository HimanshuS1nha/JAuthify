import { IoIosFingerPrint, IoIosFlash, IoIosLock } from "react-icons/io";

import Logo from "@/components/shared/logo";

const FEATURE_ICONS = [IoIosFingerPrint, IoIosFlash, IoIosLock];

const STATS = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<0.5ms", label: "Avg. auth latency" },
  { value: "10M+", label: "Auth events / day" },
];

const FeaturesSection = () => {
  return (
    <div className="relative mx-auto max-w-4xl" id="features">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={22} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                JAuthify Console
              </p>
              <p className="text-xs text-muted-foreground">
                Authentication Overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
            All systems operational
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURE_ICONS.map((Icon, i) => (
            <div
              key={i}
              className="group cursor-default rounded-xl border border-border bg-background p-5 transition-all duration-200 hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-200 group-hover:bg-primary/20">
                <Icon className="text-primary" size={20} />
              </div>
              <p className="mb-1.5 text-sm font-semibold text-foreground">
                Lorem, ipsum.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                voluptatem ipsam natus repellendus fugit magnam?
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-primary">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
