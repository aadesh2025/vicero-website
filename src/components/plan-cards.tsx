"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Check } from "lucide-react";
import { appLinks, PLANS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

type Plan = (typeof PLANS)[number];

function PlanBody({ p }: { p: Plan }) {
  return (
    <>
      <p className="font-display text-xl font-bold">{p.name}</p>
      <p className="mt-3 font-display text-5xl font-bold leading-none">${p.price}<span className="text-base font-medium text-faint"> a month</span></p>
      <p className="mt-4 text-muted">{p.blurb}</p>
      <ul className="mt-6 flex-1 space-y-2.5 text-[15px]">
        <li className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success-text" aria-hidden="true" /><span><strong>{p.messages}</strong> messages a month</span></li>
        {p.features.slice(0, 3).map((f) => (
          <li key={f} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success-text" aria-hidden="true" />{f}</li>
        ))}
      </ul>
      <Button href={appLinks.signup} external variant={p.featured ? "primary" : "secondary"} className="mt-7 w-full">Start free trial</Button>
    </>
  );
}

/** Phone: a plan selector and one plan at a time. Tablet and up: all three side by side. */
export function PlanCards() {
  return (
    <>
      <div className="hidden gap-4 md:grid md:grid-cols-3 lg:gap-5">
        {PLANS.map((p) => (
          <div key={p.id} className={cn("flex flex-col rounded-xl border bg-bg p-6 lg:p-8", p.featured ? "border-accent shadow-[0_0_0_1px_rgb(var(--accent))]" : "border-border-strong")}>
            <PlanBody p={p} />
          </div>
        ))}
      </div>

      <Tabs.Root defaultValue="pro" className="md:hidden">
        <Tabs.List aria-label="Plans" className="grid grid-cols-3 rounded-lg border border-border-strong bg-surface p-1">
          {PLANS.map((p) => (
            <Tabs.Trigger key={p.id} value={p.id} className="min-h-11 rounded-md text-[15px] font-semibold text-muted transition-colors data-[state=active]:bg-text data-[state=active]:text-bg">
              {p.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {PLANS.map((p) => (
          <Tabs.Content key={p.id} value={p.id} className={cn("mt-4 flex-col rounded-xl border bg-bg p-6 focus-visible:outline-none data-[state=active]:flex", p.featured ? "border-accent" : "border-border-strong")}>
            <PlanBody p={p} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </>
  );
}
