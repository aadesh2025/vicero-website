"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { CHANNELS } from "@/lib/site";
import { ChannelChip } from "./ui";

/** Phone/tablet version of the channel map: pick a channel from a swipeable rail, read its details. */
export function ChannelPicker() {
  return (
    <Tabs.Root defaultValue="whatsapp">
      <Tabs.List aria-label="Channels" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar sm:-mx-8 sm:px-8">
        {CHANNELS.map((c) => (
          <Tabs.Trigger key={c.id} value={c.id} className="group shrink-0 rounded-md focus-visible:outline-offset-2">
            <ChannelChip id={c.id} label={c.label} className="min-h-11 px-4 group-data-[state=active]:shadow-[0_0_0_2px_rgb(var(--text))]" />
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {CHANNELS.map((c) => (
        <Tabs.Content key={c.id} value={c.id} className="mt-5 rounded-xl border border-border-strong bg-surface p-5 focus-visible:outline-none">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-xl font-bold">{c.label}</p>
            <span className="rounded-sm border border-border-strong px-2 py-1 text-xs font-semibold text-muted">{c.plan}</span>
          </div>
          <p className="mt-3 leading-relaxed text-muted">{c.body}</p>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
