import { IoIosCheckmarkCircle } from "react-icons/io";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { routes } from "@/constants/routes";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden md:py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Enterprise-grade auth platform
          </div>
        </div>

        <h1 className="mb-6 text-center text-5xl font-bold leading-[1.1] tracking-tight text-secondary md:text-7xl">
          Best auth application
          <br />
          <span className="text-primary">in town</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Reprehenderit tempore quis alias expedita reiciendis et quasi
        </p>

        <div className="mb-20 flex justify-center">
          <Button
            size="lg"
            className="h-12 gap-2 px-8 text-base"
            onClick={() => navigate(routes.auth.register)}
          >
            Get Started now
            <FiArrowRight size={18} />
          </Button>
        </div>

        <div className="mb-20 flex flex-wrap justify-center gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => {
            return (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-foreground"
              >
                <IoIosCheckmarkCircle
                  className="shrink-0 text-primary"
                  size={13}
                />
                Lorem, ipsum
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
