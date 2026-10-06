"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Shot, ShotFrame } from "./ui";

export type TabItem = { id: string; label: string; shot: string; alt: string };

/** A row of tabs above one large, real product screenshot. */
export function ProductTabs({ items }: { items: TabItem[] }) {
  return (
    <Tabs.Root defaultValue={items[0].id}>
      <Tabs.List aria-label="Product screens" className="flex flex-wrap gap-x-9 gap-y-1 border-b border-border-strong">
        {items.map((t) => (
          <Tabs.Trigger
            key={t.id}
            value={t.id}
            className="-mb-px border-b-[3px] border-transparent py-3 font-display text-lg font-bold text-muted transition-colors hover:text-text data-[state=active]:border-accent-strong data-[state=active]:text-text"
          >
            {t.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((t) => (
        <Tabs.Content key={t.id} value={t.id} className="mt-10 focus-visible:outline-none">
          <ShotFrame><Shot name={t.shot} alt={t.alt} /></ShotFrame>
        </Tabs.Content>
      ))}
      <p className="mt-4 text-sm text-faint">Screenshots of the running product, with demo data for a fictional shop.</p>
    </Tabs.Root>
  );
}
