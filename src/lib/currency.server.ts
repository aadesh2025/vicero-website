import "server-only";
import { cookies, headers } from "next/headers";
import { localCurrency, nearestFixed } from "./geo";
import { FIXED, FIXED_CURRENCIES, isFixed, minorDigits, PLAN_IDS, type FixedCurrency, type PlanId, type PricingData } from "./pricing";

export const CURRENCY_COOKIE = "vicero_currency";

/** Exchange rate from one of our fixed currencies to another, or null if it can't be had right now. Cached for an hour. */
async function rate(from: FixedCurrency, to: string): Promise<number | null> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
    const r = data.rates?.[to];
    return data.result === "success" && typeof r === "number" && r > 0 ? r : null;
  } catch {
    return null;
  }
}

/**
 * Prices for this visitor.
 *  - their saved choice (cookie), else
 *  - India / US / eurozone (and any country whose own currency is USD, EUR or INR): the fixed list, exactly, else
 *  - any other country: the nearest fixed list, converted to the local currency at the live rate with no markup.
 * If the rate is unavailable we show the nearest fixed list unchanged, never a guess.
 */
export async function getPricing(): Promise<PricingData> {
  const [h, c] = await Promise.all([headers(), cookies()]);
  const raw = h.get("x-vercel-ip-country");
  const country = raw && /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : null;
  const saved = c.get(CURRENCY_COOKIE)?.value;
  const chosen = saved && (FIXED_CURRENCIES as string[]).includes(saved) ? (saved as FixedCurrency) : null;

  const local = localCurrency(country);
  const base = nearestFixed(country);

  // Resolve what AUTO means for this visitor.
  let autoCurrency = local && isFixed(local) ? local : (local ?? base);
  let autoPlans: PricingData["plans"] | null = null;
  let autoFrom: FixedCurrency | null = null;
  if (!isFixed(autoCurrency)) {
    const r = await rate(base, autoCurrency);
    if (r) {
      const toDigits = minorDigits(autoCurrency);
      const conv = (minor: number) => Math.round((minor / 100) * r * 10 ** toDigits);
      autoPlans = Object.fromEntries(PLAN_IDS.map((id) => [id, { price: conv(FIXED[base][id].price), pack: conv(FIXED[base][id].pack) }])) as PricingData["plans"];
      autoFrom = base;
    } else {
      autoCurrency = base; // rate unavailable: nearest fixed list, unchanged
    }
  }
  if (!autoPlans) autoPlans = FIXED[autoCurrency as FixedCurrency] as Record<PlanId, { price: number; pack: number }>;

  if (chosen) {
    return { currency: chosen, country, selection: chosen, autoCurrency, plans: FIXED[chosen], convertedFrom: null };
  }
  return { currency: autoCurrency, country, selection: "AUTO", autoCurrency, plans: autoPlans, convertedFrom: autoFrom };
}
