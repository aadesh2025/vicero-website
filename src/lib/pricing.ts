/**
 * Fixed price lists, in MINOR units (cents / paise). These three lists are the source of truth for
 * display and match the plan table in the product. Nothing here is ever adjusted: other currencies
 * are derived from one of these lists at the live exchange rate (see currency.server.ts).
 */
export type PlanId = "starter" | "pro" | "business";
export type FixedCurrency = "USD" | "EUR" | "INR";

export const PLAN_IDS: PlanId[] = ["starter", "pro", "business"];

/** Plan price and the price of a 500-message extra pack, per month, in minor units. */
export const FIXED: Record<FixedCurrency, Record<PlanId, { price: number; pack: number }>> = {
  USD: {
    starter: { price: 4900, pack: 600 },
    pro: { price: 9900, pack: 500 },
    business: { price: 19900, pack: 400 },
  },
  EUR: {
    starter: { price: 4500, pack: 500 },
    pro: { price: 8900, pack: 450 },
    business: { price: 17900, pack: 350 },
  },
  INR: {
    starter: { price: 149900, pack: 19900 },
    pro: { price: 349900, pack: 14900 },
    business: { price: 699900, pack: 9900 },
  },
};

export const FIXED_CURRENCIES = Object.keys(FIXED) as FixedCurrency[];
export const isFixed = (c: string): c is FixedCurrency => c in FIXED;

/** What the page needs to show prices: already resolved for this visitor, safe to send to the browser. */
export type PricingData = {
  currency: string;
  country: string | null;
  /** "AUTO" = chosen from the visitor's country; otherwise the visitor picked one of the fixed currencies. */
  selection: "AUTO" | FixedCurrency;
  /** The currency AUTO resolves to for this visitor (so the selector can label it). */
  autoCurrency: string;
  plans: Record<PlanId, { price: number; pack: number }>;
  /** Set when the amounts were converted from a fixed list rather than read from it. */
  convertedFrom: FixedCurrency | null;
};

const LOCALE: Record<string, string> = { USD: "en-US", EUR: "en-IE", INR: "en-IN" };

/** Minor units -> "$49", "€4.50", "₹3,499", "¥7,350". Whole amounts drop the decimals. */
export function formatMoney(minor: number, currency: string): string {
  const digits = new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  const major = minor / 10 ** digits;
  const whole = Number.isInteger(major);
  return new Intl.NumberFormat(LOCALE[currency] ?? "en", {
    style: "currency",
    currency,
    currencyDisplay: currency === "USD" || currency === "EUR" || currency === "INR" ? "symbol" : "narrowSymbol",
    minimumFractionDigits: whole ? 0 : digits,
    maximumFractionDigits: whole ? 0 : digits,
  }).format(major);
}

/** The number of minor-unit digits for a currency (2 for USD, 0 for JPY, 3 for KWD). */
export function minorDigits(currency: string): number {
  return new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
}
