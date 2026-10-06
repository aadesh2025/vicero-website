/**
 * Responsive matrix: every route at 12 widths (phone, tablet, desktop).
 *
 *   npm run build && npm start        (port 3002)
 *   npx playwright test -c scripts/playwright.config.ts responsive.spec.ts
 *
 * Fails on: page-level horizontal overflow, any element poking past the viewport that is not inside a
 * scroller, and (phone/tablet) interactive controls smaller than 40px in either direction.
 * RESP_SHOTS=<dir> also saves screenshots of the key pages.
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const BASE = process.env.SITE_URL ?? "http://localhost:3002";
const SHOTS = process.env.RESP_SHOTS;
const ROUTES = ["/", "/product", "/knowledge", "/automations", "/channels", "/security", "/pricing", "/developers", "/about", "/contact", "/login", "/privacy", "/terms"];
const WIDTHS = [320, 360, 390, 430, 768, 820, 1024, 1180, 1280, 1440, 1600, 1920];
const SHOT_ROUTES = ["/", "/product", "/pricing", "/knowledge", "/automations", "/channels", "/developers"];
const SHOT_WIDTHS = [390, 820, 1440];

test.setTimeout(900_000);

test("every route at every width", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const found = new Map<string, number[]>();
  const note = (route: string, width: number, msg: string) => { const k = `${route}: ${msg}`; found.set(k, [...(found.get(k) ?? []), width]); };

  for (const route of ROUTES) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: width < 768 ? 800 : 900 });
      await page.waitForTimeout(150);
      const r = await page.evaluate(
        ({ small }) => {
          const vw = document.documentElement.clientWidth;
          const out: { overflow: number; bleed: string[]; tiny: string[] } = { overflow: document.documentElement.scrollWidth - vw, bleed: [], tiny: [] };
          const inScroller = (el: Element) => {
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
              const o = getComputedStyle(p).overflowX;
              if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true;
            }
            return false;
          };
          for (const el of document.querySelectorAll("body *")) {
            const cs = getComputedStyle(el);
            if (cs.display === "none" || cs.visibility === "hidden" || el.closest("[aria-hidden='true']")) continue;
            const hit = el.matches("input[type=checkbox], input[type=radio]") ? el.closest("label") ?? el : el;
            const b = hit.getBoundingClientRect();
            if (b.width === 0 || b.height === 0) continue;
            if ((b.right > vw + 1 || b.left < -1) && !inScroller(el)) out.bleed.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)}`);
            if (small && !el.matches(".sr-only") && (el.matches("a[href], button, [role=tab], input, select, textarea, summary"))) {
              // Links inside running text are exempt; only standalone controls count.
              const inline = el.tagName === "A" && cs.display === "inline" && !!el.closest("p, li, dd, dt");
              if (!inline && (b.height < 40 || b.width < 40) && b.top < document.documentElement.scrollHeight) out.tiny.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 24)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
            }
          }
          return out;
        },
        { small: width < 1024 },
      );
      if (r.overflow > 1) note(route, width, "page scrolls sideways");
      if (r.bleed.length) note(route, width, `elements outside the viewport, e.g. ${r.bleed[0].replace(/\s+/g, " ")}`);
      for (const t of new Set(r.tiny)) note(route, width, `small touch target ${t}`);

      if (SHOTS && SHOT_ROUTES.includes(route) && SHOT_WIDTHS.includes(width)) {
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
        await page.waitForTimeout(250);
        fs.mkdirSync(SHOTS, { recursive: true });
        await page.screenshot({ path: path.join(SHOTS, `${route === "/" ? "home" : route.slice(1)}-${width}.png`), fullPage: true });
      }
    }
  }
  const problems = [...found].map(([k, w]) => `${k}  [@${w.join(",")}]`);
  expect(problems, problems.join("\n")).toEqual([]);
});
