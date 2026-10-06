"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { FocusShot, Shot, ShotFrame } from "./ui";

/** Where to look on small screens: x/y are the region's top-left (% of the screenshot), zoom is how far in. */
export type Crop = { zoom: number; x: number; y: number; ratio?: string };
export type TabItem = { id: string; label: string; shot: string; alt: string; crop: Crop };

/** Tabs above one real product screenshot. Phones get a swipeable tab rail and a zoomed crop of the key panel. */
export function ProductTabs({ items }: { items: TabItem[] }) {
  return (
    <Tabs.Root defaultValue={items[0].id}>
      <Tabs.List aria-label="Product screens" className="-mx-5 flex gap-1 overflow-x-auto border-b border-border-strong px-5 no-scrollbar sm:-mx-8 sm:px-8 lg:mx-0 lg:gap-9 lg:px-0">
        {items.map((t) => (
          <Tabs.Trigger
            key={t.id}
            value={t.id}
            className="-mb-px min-h-12 shrink-0 border-b-[3px] border-transparent px-3 font-display text-base font-bold text-muted transition-colors hover:text-text data-[state=active]:border-accent-strong data-[state=active]:text-text sm:text-lg lg:px-0"
          >
            {t.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((t) => (
        <Tabs.Content key={t.id} value={t.id} className="mt-6 focus-visible:outline-none sm:mt-10">
          <ShotFrame>
            <div className="md:hidden"><FocusShot name={t.shot} alt={t.alt} ratio={t.crop.ratio ?? "5 / 4"} zoom={t.crop.zoom} x={t.crop.x} y={t.crop.y} /></div>
            <div className="hidden md:block"><Shot name={t.shot} alt={t.alt} /></div>
          </ShotFrame>
        </Tabs.Content>
      ))}
      <p className="mt-4 text-sm text-faint">Screenshots of the running product, with demo data for a fictional shop.</p>
    </Tabs.Root>
  );
}
