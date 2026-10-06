import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./ui";

/** Page opener: big headline and one sentence on the left, a picture of the thing on the right. */
export function PageHero({ title, lead, children, visual, wide }: { title: ReactNode; lead: ReactNode; children?: ReactNode; visual?: ReactNode; wide?: boolean }) {
  return (
    <section className="overflow-hidden border-b border-border pb-20 pt-20 sm:pb-28 sm:pt-28">
      <Container>
        <div className={cn("grid items-center gap-x-14 gap-y-12", visual && (wide ? "lg:grid-cols-[1fr_1.35fr]" : "lg:grid-cols-[1.05fr_1fr]"))}>
          <div>
            <h1 className={cn("font-display font-bold leading-[0.98] text-balance", visual ? "text-[42px] sm:text-6xl" : "max-w-4xl text-[44px] sm:text-7xl")}>{title}</h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">{lead}</p>
            {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
          </div>
          {visual && <div className="min-w-0">{visual}</div>}
        </div>
      </Container>
    </section>
  );
}
