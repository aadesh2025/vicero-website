"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";
import { FIXED_CURRENCIES, formatMoney, isFixed, type PlanId, type PricingData } from "@/lib/pricing";

const Ctx = createContext<PricingData | null>(null);

export function PricingProvider({ data, children }: { data: PricingData; children: ReactNode }) {
  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

/** Prices for the current visitor, with formatters. */
export function usePricing() {
  const d = useContext(Ctx);
  if (!d) throw new Error("usePricing must be used inside <PricingProvider>");
  return {
    ...d,
    price: (id: PlanId) => formatMoney(d.plans[id].price, d.currency),
    pack: (id: PlanId) => formatMoney(d.plans[id].pack, d.currency),
    money: (minor: number) => formatMoney(minor, d.currency),
  };
}

/** "Prices shown in JPY, converted from USD at today's exchange rate." Renders nothing for fixed lists. */
export function PriceNote({ className }: { className?: string }) {
  const { convertedFrom, currency } = usePricing();
  if (!convertedFrom) return null;
  return <p className={className ?? "text-sm text-faint"}>Prices shown in {currency}, converted from {convertedFrom} at today&apos;s exchange rate.</p>;
}

const LABEL: Record<string, string> = { USD: "US dollar ($)", EUR: "Euro (€)", INR: "Indian rupee (₹)" };

/** A small selector: the detected currency, or USD / EUR / INR. The choice is remembered. */
export function CurrencySwitch({ className }: { className?: string }) {
  const { selection, autoCurrency } = usePricing();
  const router = useRouter();
  const autoIsFixed = isFixed(autoCurrency);
  const value = selection === "AUTO" ? (autoIsFixed ? autoCurrency : "AUTO") : selection;

  const onChange = (v: string) => {
    document.cookie = `vicero_currency=${v === "AUTO" ? "" : v}; path=/; max-age=${v === "AUTO" ? 0 : 31536000}; samesite=lax`;
    router.refresh();
  };

  return (
    <label className={className ?? "inline-flex items-center gap-2 text-sm font-medium text-muted"}>
      <span>Currency</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Currency"
        className="min-h-11 rounded-md border border-border-strong bg-surface px-3 text-sm font-semibold text-text lg:min-h-9"
      >
        {!autoIsFixed && <option value="AUTO">{autoCurrency} (your country)</option>}
        {FIXED_CURRENCIES.map((c) => (
          <option key={c} value={c}>{LABEL[c]}</option>
        ))}
      </select>
    </label>
  );
}
