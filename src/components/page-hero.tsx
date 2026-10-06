import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./ui";

/** Page opener: big headline and one sentence on the left, a picture of the thing on the right. */
export function PageHero({ title, lead, children, visual, wide }: { title: ReactNode; lead: ReactNode; children?: ReactNode; visual?: ReactNode; wide?: boolean }) {
  return (
    <section className="overflow-hidden border-b border-border pb-14 pt-12 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
      <Container>
        <div className={cn("grid items-center gap-x-14 gap-y-12", visual && (wide ? "lg:grid-cols-[1fr_1.35fr]" : "lg:grid-cols-[1.05fr_1fr]"))}>
          <div>
            <h1 className={cn("font-display font-bold leading-[0.98] text-balance", visual ? "text-[clamp(2.25rem,6vw,3.75rem)]" : "max-w-4xl text-[clamp(2.4rem,7vw,4.5rem)]")}>{title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed sm:mt-6 sm:text-xl text-muted">{lead}</p>
            {children && <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>}
          </div>
          {visual && <div className="min-w-0">{visual}</div>}
        </div>
      </Container>
    </section>
  );
}
