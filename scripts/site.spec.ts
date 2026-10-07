/**
 * Smoke + accessibility + visual pass over the built site.
 *
 *   npm run build && npm start   (port 3002)
 *   npx playwright test -c scripts/playwright.config.ts site.spec.ts
 *
 * SITE_SHOTS=<dir> also writes full-page screenshots (light/dark × desktop/mobile) there.
 */
import fs from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const BASE = process.env.SITE_URL ?? "http://localhost:3002";
const SHOTS = process.env.SITE_SHOTS;
const ROUTES = ["/", "/product", "/knowledge", "/automations", "/channels", "/security", "/pricing", "/developers", "/about", "/contact", "/login", "/privacy", "/terms"];
const THEMES = ["light", "dark"] as const;

for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    for (const route of ROUTES) {
      test(`${route}`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch { /* default theme */ } }, theme);
        const page = await ctx.newPage();
        const errors: string[] = [];
        page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
        page.on("pageerror", (e) => errors.push(String(e)));
        const failed: string[] = [];
        page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

        const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
        expect(res?.status(), route).toBe(200);
        await expect(page.locator("h1").first()).toBeVisible();
        await page.waitForTimeout(500);

        if (SHOTS) {
          const dir = path.join(SHOTS, theme);
          fs.mkdirSync(dir, { recursive: true });
          const name = route === "/" ? "home" : route.slice(1);
          // reveal-on-scroll content: scroll through once so every section is rendered in the capture
          await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } window.scrollTo(0, 0); });
          await page.waitForTimeout(500);
          await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
          const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
          await m.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch { /* default theme */ } }, theme);
          const mp = await m.newPage();
          await mp.goto(BASE + route, { waitUntil: "networkidle" });
          await mp.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); } window.scrollTo(0, 0); });
          await mp.waitForTimeout(400);
          const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          expect(overflow, `${route} scrolls horizontally on mobile`).toBeLessThanOrEqual(1);
          await mp.screenshot({ path: path.join(dir, `${name}.mobile.png`), fullPage: true });
          await m.close();
        }

        const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
        const bad = axe.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(" ")}`);
        expect(bad, `a11y on ${route}`).toEqual([]);
        expect(failed.filter((f) => !f.includes("/shots/")), "failed requests").toEqual([]);
        expect(errors, "console errors").toEqual([]);
        await ctx.close();
      });
    }
  });
}

// Every Log in / Start free trial / Get started link, on every page, opens the hosted app's sign-in page.
test("login and trial buttons all go to the app", async ({ page }) => {
  const APP = "https://viceroai.duckdns.org/login";
  let checked = 0;
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    // Open the phone menu too, so its buttons are covered on a narrow viewport.
    const links = await page.locator("a").evaluateAll((as) =>
      as.filter((a) => /^(log in|start free trial|free trial|create a free account|continue with google)$/i.test((a.textContent ?? "").trim())).map((a) => (a as HTMLAnchorElement).href),
    );
    for (const href of links) {
      checked++;
      expect(href.startsWith(APP), `${route}: ${href}`).toBe(true);
    }
  }
  expect(checked).toBeGreaterThan(20);

  // The login page's email form hands off to the same place.
  await page.goto(BASE + "/login", { waitUntil: "networkidle" });
  await page.getByLabel("Work email").fill("maya@lumenhome.example");
  const [req] = await Promise.all([page.waitForRequest((r) => r.url().startsWith(APP), { timeout: 15_000 }).catch(() => null), page.getByRole("button", { name: "Continue with email" }).click()]);
  expect(req?.url() ?? page.url()).toContain("viceroai.duckdns.org/login");
});
