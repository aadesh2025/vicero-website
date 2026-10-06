"use client";

import * as Slider from "@radix-ui/react-slider";
import { useId, useState } from "react";
import { appLinks } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

type Plan = { id: "starter" | "pro" | "business"; name: string; price: number; limit: number; pack: number };
const PLANS: Plan[] = [
  { id: "starter", name: "Starter", price: 49, limit: 2000, pack: 6 },
  { id: "pro", name: "Pro", price: 99, limit: 10000, pack: 5 },
  { id: "business", name: "Business", price: 199, limit: 30000, pack: 4 },
];
const PACK = 500;

const NEEDS = [
  { id: "meta", label: "WhatsApp, Instagram or Messenger", min: 1 },
  { id: "auto", label: "Workflows or n8n automations", min: 1 },
  { id: "more", label: "Telegram, Slack, Discord or email", min: 2 },
] as const;

/** Slide to your monthly messages, tick what you need, see the plan that fits and what it would cost. */
export function PlanPicker() {
  const [messages, setMessages] = useState(6000);
  const [needs, setNeeds] = useState<Record<string, boolean>>({ meta: true, auto: false, more: false });
  const sliderId = useId();

  const minByNeeds = Math.max(0, ...NEEDS.filter((n) => needs[n.id]).map((n) => n.min));
  const minByVolume = PLANS.findIndex((p) => messages <= p.limit);
  // Volume past the biggest plan is covered by packs on Business, so it never forces a higher tier.
  const fitIndex = minByVolume === -1 ? PLANS.length - 1 : minByVolume;
  const idx = Math.max(minByNeeds, fitIndex);
  const plan = PLANS[idx];
  const extra = Math.max(0, messages - plan.limit);
  const packs = Math.ceil(extra / PACK);
  const total = plan.price + packs * plan.pack;

  return (
    <div className="grid gap-10 rounded-lg border border-border-strong bg-surface p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <label htmlFor={sliderId} className="font-display text-xl font-bold">Messages a month</label>
        <p className="mt-1 text-sm text-muted">A reply counts as a question and an answer.</p>
        <p className="mt-5 font-display text-5xl font-bold leading-none">{messages.toLocaleString("en-US")}</p>
        <Slider.Root
          className="relative mt-6 flex h-6 w-full touch-none select-none items-center"
          min={500}
          max={40000}
          step={500}
          value={[messages]}
          onValueChange={([v]) => setMessages(v)}
        >
          <Slider.Track className="relative h-1.5 grow rounded-full bg-surface-3">
            <Slider.Range className="absolute h-full rounded-full bg-accent-strong" />
          </Slider.Track>
          <Slider.Thumb id={sliderId} aria-label="Messages a month" className="block h-6 w-6 rounded-full border-2 border-accent-strong bg-surface shadow-md focus-visible:outline-2 focus-visible:outline-offset-2" />
        </Slider.Root>
        <div className="mt-2 flex justify-between text-xs text-faint"><span>500</span><span>10,000</span><span>20,000</span><span>40,000</span></div>

        <fieldset className="mt-8">
          <legend className="font-display text-xl font-bold">I need</legend>
          <div className="mt-3 space-y-2.5">
            {NEEDS.map((n) => (
              <label key={n.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                <input
                  type="checkbox"
                  checked={!!needs[n.id]}
                  onChange={(e) => setNeeds((s) => ({ ...s, [n.id]: e.target.checked }))}
                  className="h-6 w-6 shrink-0 accent-[rgb(61,59,255)]"
                />
                {n.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col rounded-md bg-ink p-6 text-white" aria-live="polite">
        <p className="text-sm text-white/70">The plan that fits</p>
        <p className="mt-1 font-display text-4xl font-bold">{plan.name}</p>
        <p className="mt-5 font-display text-6xl font-bold leading-none">${total}<span className="text-lg font-medium text-white/60"> a month</span></p>
        <dl className="mt-5 space-y-1.5 text-sm text-white/80">
          <div className="flex justify-between"><dt>{plan.name} plan</dt><dd>${plan.price}</dd></div>
          <div className="flex justify-between"><dt>Included messages</dt><dd>{plan.limit.toLocaleString("en-US")}</dd></div>
          {packs > 0 && <div className="flex justify-between"><dt>{packs} extra pack{packs > 1 ? "s" : ""} of 500</dt><dd>${packs * plan.pack}</dd></div>}
        </dl>
        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          {PLANS.map((p, i) => <span key={p.id} className={cn("h-1.5 flex-1 rounded-full", i <= idx ? "bg-hl" : "bg-white/20")} />)}
        </div>
        <Button href={appLinks.signup} external variant="primary" className="mt-auto w-full">Start free trial</Button>
        <p className="mt-3 text-center text-xs text-white/60">10 days free. No card needed.</p>
      </div>
    </div>
  );
}
