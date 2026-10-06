"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Check, Minus } from "lucide-react";
import { appLinks, COMPARE, PLANS, type Cell } from "@/lib/site";
import { cn } from "@/lib/utils";
import { PriceNote, usePricing } from "./pricing-provider";
import { Button } from "./ui";

function Val({ v }: { v: Cell }) {
  if (v === true) return <Check className="h-4 w-4 text-success-text" aria-label="Included" />;
  if (v === false) return <Minus className="h-4 w-4 text-faint" aria-label="Not included" />;
  return <span className="font-semibold">{v}</span>;
}

/** Tablet and up: the full table, scrolling inside its own box if it must. Phone: one plan's rows at a time. */
export function ComparePlans() {
  const { price } = usePricing();
  return (
    <>
      <PriceNote className="mb-4 text-sm text-faint" />
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="align-bottom">
              <td className="w-[34%] pb-6" />
              {PLANS.map((p) => (
                <th key={p.id} scope="col" className={cn("px-5 pb-6 align-bottom font-normal", p.featured && "bg-accent-soft")}>
                  <span className="block font-display text-2xl font-bold">{p.name}</span>
                  <span className="mt-1 block font-display text-4xl font-bold">{price(p.id)}<span className="text-base font-medium text-faint"> a month</span></span>
                  <span className="mt-2 block max-w-[220px] text-sm leading-snug text-muted">{p.blurb}</span>
                  <Button href={appLinks.signup} external variant={p.featured ? "primary" : "secondary"} className="mt-4">Start free trial</Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((r) => (
              <tr key={r.label} className="border-t border-border">
                <th scope="row" className="py-3.5 pr-4 font-medium text-muted">{r.label}</th>
                {r.v.map((v, i) => (
                  <td key={i} className={cn("px-5 py-3.5", PLANS[i].featured && "bg-accent-soft")}><Val v={v} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Tabs.Root defaultValue="pro" className="md:hidden">
        <Tabs.List aria-label="Plans" className="grid grid-cols-3 rounded-lg border border-border-strong bg-surface p-1">
          {PLANS.map((p) => (
            <Tabs.Trigger key={p.id} value={p.id} className="min-h-11 rounded-md text-[15px] font-semibold text-muted transition-colors data-[state=active]:bg-text data-[state=active]:text-bg">
              {p.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {PLANS.map((p, pi) => (
          <Tabs.Content key={p.id} value={p.id} className="mt-5 focus-visible:outline-none">
            <p className="font-display text-4xl font-bold">{price(p.id)}<span className="text-base font-medium text-faint"> a month</span></p>
            <p className="mt-2 text-muted">{p.blurb}</p>
            <dl className="mt-5 divide-y divide-border border-y border-border">
              {COMPARE.map((r) => (
                <div key={r.label} className="flex min-h-12 items-center justify-between gap-4 py-2">
                  <dt className="text-[15px] text-muted">{r.label}</dt>
                  <dd className="text-right text-[15px]"><Val v={r.v[pi]} /></dd>
                </div>
              ))}
            </dl>
            <Button href={appLinks.signup} external variant={p.featured ? "primary" : "secondary"} size="lg" className="mt-6 w-full">Start free trial</Button>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </>
  );
}
