"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Crop } from "./product-tabs";
import { FocusShot, Shot, ShotFrame } from "./ui";

export type TourItem = { id: string; shot: string; title: string; body: string; alt: string; crop: Crop };

/**
 * Pick a part of the product, see the real screen. Desktop: a list beside the screenshot.
 * Phone and tablet: a swipeable rail of areas, the screen, then what it does.
 */
export function Tour({ items }: { items: TourItem[] }) {
  const [active, setActive] = useState(items[0].id);
  const current = items.find((i) => i.id === active) ?? items[0];
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-16">
      <div role="tablist" aria-label="Product areas" aria-orientation="horizontal" className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:border-t lg:border-text/80 lg:px-0">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={on}
              aria-controls="tour-panel"
              onClick={() => setActive(it.id)}
              className={cn(
                "min-h-11 shrink-0 rounded-full border px-4 text-left font-display text-[15px] font-bold transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-border lg:px-0 lg:py-5 lg:text-xl",
                on ? "border-text bg-text text-bg lg:bg-transparent lg:text-accent" : "border-border-strong text-muted hover:text-text lg:text-muted",
              )}
            >
              {it.title}
              {on && <span className="mt-2 hidden text-[15px] font-normal leading-relaxed text-muted lg:block">{it.body}</span>}
            </button>
          );
        })}
      </div>
      <div id="tour-panel" role="tabpanel" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <ShotFrame>
          <div className="md:hidden"><FocusShot key={current.id} name={current.shot} alt={current.alt} ratio={current.crop.ratio ?? "5 / 4"} zoom={current.crop.zoom} x={current.crop.x} y={current.crop.y} /></div>
          <div className="hidden md:block"><Shot key={current.id} name={current.shot} alt={current.alt} /></div>
        </ShotFrame>
        <p className="mt-4 text-base leading-relaxed text-muted lg:hidden">{current.body}</p>
        <p className="mt-3 text-sm text-faint">Screenshot of the running product, with demo data for a fictional shop.</p>
      </div>
    </div>
  );
}
