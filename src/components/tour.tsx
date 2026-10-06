"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Shot, ShotFrame } from "./ui";

export type TourItem = { id: string; shot: string; title: string; body: string; alt: string };

/** Pick a part of the product on the left, see the real screen on the right. */
export function Tour({ items }: { items: TourItem[] }) {
  const [active, setActive] = useState(items[0].id);
  const current = items.find((i) => i.id === active) ?? items[0];
  return (
    <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
      <div role="tablist" aria-label="Product areas" aria-orientation="vertical" className="flex flex-col border-t border-text/80">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={on}
              aria-controls="tour-panel"
              onClick={() => setActive(it.id)}
              className={cn("border-b border-border py-5 text-left transition-colors", on ? "text-text" : "text-muted hover:text-text")}
            >
              <span className={cn("block font-display text-xl font-bold", on && "text-accent")}>{it.title}</span>
              {on && <span className="mt-2 block text-[15px] leading-relaxed text-muted">{it.body}</span>}
            </button>
          );
        })}
      </div>
      <div id="tour-panel" role="tabpanel" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <ShotFrame>
          <Shot key={current.id} name={current.shot} alt={current.alt} />
        </ShotFrame>
        <p className="mt-3 text-sm text-faint">Screenshot of the running product, with demo data for a fictional shop.</p>
      </div>
    </div>
  );
}
