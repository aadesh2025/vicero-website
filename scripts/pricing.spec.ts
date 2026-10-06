/**
 * Pricing by country. Sends Vercel's visitor-country header, as the edge does in production.
 *
 *   npm run build && npm start      (port 3002)
 *   npx playwright test -c scripts/playwright.config.ts pricing.spec.ts
 */
import { expect, test } from "@playwright/test";

const BASE = process.env.SITE_URL ?? "http://localhost:3002";

// The fixed price lists, in major units.
const FIXED = {
  USD: { plans: [49, 99, 199], packs: [6, 5, 4] },
  EUR: { plans: [45, 89, 179], packs: [5, 4.5, 3.5] },
  INR: { plans: [1499, 3499, 6999], packs: [199, 149, 99] },
} as const;

async function pricingPage(browser: import("@playwright/test").Browser, country?: string, cookie?: string) {
  const ctx = await browser.newContext({ extraHTTPHeaders: country ? { "x-vercel-ip-country": country } : {}, viewport: { width: 1280, height: 900 } });
  if (cookie) await ctx.addCookies([{ name: "vicero_currency", value: cookie, url: BASE }]);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
  return { page, ctx };
}

/** The three plan prices from the side-by-side table's header row, as text. */
const headerPrices = (page: import("@playwright/test").Page) => page.locator("table thead th span.text-4xl").allInnerTexts().then((a) => a.map((t) => t.replace(/\s*a month\s*/, "").trim()));
const faqPacks = async (page: import("@playwright/test").Page) => {
  await page.getByRole("button", { name: "What if I run out?" }).click();
  return (await page.locator("main").innerText()).match(/Add a pack of 500 messages \(([^)]*)\)/)?.[1] ?? "";
};

const num = (s: string) => Number(s.replace(/[^0-9.]/g, ""));

for (const [country, cur] of [["IN", "INR"], ["US", "USD"], ["DE", "EUR"], ["FR", "EUR"], ["IE", "EUR"], ["EC", "USD"]] as const) {
  test(`${country} sees the fixed ${cur} prices exactly`, async ({ browser }) => {
    const { page, ctx } = await pricingPage(browser, country);
    expect((await headerPrices(page)).map(num)).toEqual([...FIXED[cur].plans]);
    const packs = await faqPacks(page);
    expect(packs.split(",").map((p) => num(p))).toEqual([...FIXED[cur].packs]);
    await ctx.close();
  });
}

test("the symbols match: ₹ for India, $ for the US, € for Germany", async ({ browser }) => {
  for (const [country, sym] of [["IN", "₹"], ["US", "$"], ["DE", "€"]] as const) {
    const { page, ctx } = await pricingPage(browser, country);
    expect((await headerPrices(page))[0].startsWith(sym)).toBe(true);
    await ctx.close();
  }
});

test("no country (local, bots) shows USD", async ({ browser }) => {
  const { page, ctx } = await pricingPage(browser);
  expect((await headerPrices(page)).map(num)).toEqual([...FIXED.USD.plans]);
  await ctx.close();
});

// Not India/US/eurozone: nearest fixed list, converted at the live rate, no markup.
for (const [country, base, local] of [["GB", "EUR", "GBP"], ["JP", "USD", "JPY"], ["NP", "INR", "NPR"], ["AU", "USD", "AUD"], ["BR", "USD", "BRL"]] as const) {
  test(`${country} sees ${base} converted to ${local} at the live rate`, async ({ browser, request }) => {
    const r = await (await request.get(`https://open.er-api.com/v6/latest/${base}`)).json();
    const rate: number = r.rates[local];
    const digits = new Intl.NumberFormat("en", { style: "currency", currency: local }).resolvedOptions().maximumFractionDigits ?? 2;
    const expected = FIXED[base].plans.map((p) => Math.round(p * rate * 10 ** digits) / 10 ** digits);

    const { page, ctx } = await pricingPage(browser, country);
    const shown = (await headerPrices(page)).map(num);
    // The page and this test fetch the rate moments apart; allow for one rounding step of drift.
    shown.forEach((v, i) => expect(Math.abs(v - expected[i])).toBeLessThanOrEqual(Math.max(10 ** -digits, expected[i] * 0.003)));
    await expect(page.getByText(new RegExp(`converted from ${base}`)).first()).toBeVisible();
    await ctx.close();
  });
}

test("a visitor can switch to another currency and it is remembered", async ({ browser }) => {
  const { page, ctx } = await pricingPage(browser, "JP");
  await page.getByLabel("Currency").first().selectOption("INR");
  await expect.poll(async () => (await headerPrices(page)).map(num)).toEqual([...FIXED.INR.plans]);
  await page.reload({ waitUntil: "networkidle" });
  expect((await headerPrices(page)).map(num)).toEqual([...FIXED.INR.plans]);
  await ctx.close();
});

test("the home page cards and the picker use the same prices", async ({ browser }) => {
  const ctx = await browser.newContext({ extraHTTPHeaders: { "x-vercel-ip-country": "IN" }, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const text = await page.locator("main").innerText();
  for (const p of ["₹1,499", "₹3,499", "₹6,999"]) expect(text).toContain(p);
  expect(text).not.toMatch(/\$(49|99|199)\b/);
  await ctx.close();
});
