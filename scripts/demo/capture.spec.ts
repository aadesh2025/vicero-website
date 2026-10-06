/**
 * Step 3 of 3. Screenshots of the REAL Vicero app, loaded with the demo data from setup + seed.
 *
 *   npx playwright test -c scripts/playwright.config.ts demo/capture.spec.ts
 *
 * Writes public/shots/{light,dark}/<name>.png at 1440x900 @1.5x, in India time so "today" reads right.
 * Signs in with the throwaway demo account in scripts/demo/.state.json; nothing here prints secrets.
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const STATE = JSON.parse(fs.readFileSync(path.join(__dirname, ".state.json"), "utf8"));
const API = process.env.DEMO_API_URL ?? "http://localhost:8000";
const WEB = process.env.DEMO_WEB_URL ?? "http://localhost:3001";
const OUT = path.resolve(__dirname, "../../public/shots");
const ONLY = process.env.CAPTURE_ONLY?.split(",").map((s) => s.trim()).filter(Boolean);
const THEMES = ["light", "dark"] as const;

type Route = [name: string, url: string, act?: (page: Page) => Promise<void>, auth?: boolean];

async function shoot(page: Page, theme: string, [name, url, act]: Route) {
  if (ONLY && !ONLY.includes(name)) return;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
  await page.addStyleTag({ content: "nextjs-portal,[data-nextjs-toast],[data-next-badge-root]{display:none !important}" });
  if (act) await act(page).catch((e) => console.warn(`act failed for ${name}: ${String(e).slice(0, 140)}`));
  await page.waitForTimeout(1400); // charts and counters settle
  const dir = path.join(OUT, theme);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`) });
}

test("capture the real app with demo data", async ({ browser, request }) => {
  test.setTimeout(900_000);
  // Fresh tokens for the demo account.
  const login = await request.post(`${API}/v1/auth/login`, { data: { email: STATE.email, password: STATE.password } });
  expect(login.ok(), `login ${login.status()}`).toBeTruthy();
  const tokens = await login.json();
  const hdr = { Authorization: `Bearer ${tokens.access_token}`, "X-Org-Id": STATE.orgId };

  // An inbox conversation with a person already replying.
  const inbox = await (await request.get(`${API}/v1/inbox/conversations`, { headers: hdr })).json();
  const list: { id: string; status: string; message_count: number; handoff?: { status: string } }[] = Array.isArray(inbox) ? inbox : inbox.items ?? [];
  const pick = list.find((c) => c.handoff?.status === "assigned" && c.message_count >= 3) ?? list.find((c) => c.status === "handoff") ?? list[0];
  console.log(`inbox candidates: ${list.length}, using ${pick ? "one" : "none"}`);

  const routes: Route[] = [
    ["dashboard", `${WEB}/dashboard`],
    ["inbox", pick ? `${WEB}/inbox/${pick.id}` : `${WEB}/inbox`],
    ["conversations", `${WEB}/conversations`],
    ["contacts", `${WEB}/contacts`],
    ["analytics", `${WEB}/analytics`],
    ["knowledge", `${WEB}/knowledge/${STATE.kbId}`],
    ["agents", `${WEB}/agents`],
    ["agent", `${WEB}/agents/${STATE.agents.support}`],
    [
      "workflow",
      `${WEB}/agents/${STATE.agents.support}?tab=workflows`,
      async (p) => {
        await p.getByText("Refund approval").first().click();
        await p.waitForSelector(".react-flow__node", { timeout: 10_000 });
        await p.locator(".react-flow__controls-fitview").click({ timeout: 3000 }).catch(() => undefined);
        await p.waitForTimeout(800);
        await p.evaluate(() => window.scrollTo(0, 0));
      },
    ],
    [
      "team",
      `${WEB}/settings/org`,
      async (p) => {
        await p.evaluate(() => {
          const el = Array.from(document.querySelectorAll("*")).find((n) => n.children.length === 0 && n.textContent?.trim() === "Members");
          el?.scrollIntoView({ block: "start" });
          window.scrollBy(0, -90);
        });
      },
    ],
    ["audit", `${WEB}/settings/audit`],
    ["api-keys", `${WEB}/settings/api-keys`],
    ["billing", `${WEB}/billing/upgrade`],
  ];
  const anon: Route[] = [
    ["login", `${WEB}/login`],
    ["signup", `${WEB}/signup`],
  ];

  for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5, timezoneId: "Asia/Kolkata", locale: "en-IN" });
    await ctx.addInitScript((t) => {
      try { localStorage.setItem("theme", t); } catch { /* default theme */ }
    }, theme);
    const anonPage = await ctx.newPage();
    for (const r of anon) await shoot(anonPage, theme, r);
    await anonPage.close();

    const base = { domain: new URL(WEB).hostname, path: "/", sameSite: "Lax" as const };
    await ctx.addCookies([
      { name: "bf_access", value: tokens.access_token, ...base },
      { name: "bf_refresh", value: tokens.refresh_token, ...base },
      { name: "bf_org", value: STATE.orgId, ...base },
    ]);
    const page = await ctx.newPage();
    for (const r of routes) await shoot(page, theme, r);
    await ctx.close();
  }
  expect(fs.readdirSync(path.join(OUT, "light")).length).toBeGreaterThan(5);
});
