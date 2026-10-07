/**
 * Real mobile emulation (touch, iPhone and Android viewports): the menu and the hero image.
 *
 *   npm run build && npm start      (port 3002)
 *   npx playwright test -c scripts/playwright.config.ts mobile.spec.ts
 */
import { devices, expect, test } from "@playwright/test";

const BASE = process.env.SITE_URL ?? "http://localhost:3002";

for (const name of ["iPhone 13", "Pixel 7", "iPhone SE"] as const) {
  test.describe(name, () => {
    // Mobile viewport, pixel ratio, touch and user agent (the browser stays Chrome).
    const mobile = { ...devices[name] } as Partial<(typeof devices)[typeof name]>;
    delete mobile.defaultBrowserType;
    test.use(mobile);

    test("burger menu opens full screen, scrolls the page lock, navigates and closes", async ({ page }) => {
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      const toggle = page.getByRole("button", { name: "Open menu" });
      await toggle.tap();

      const menu = page.locator("#mobile-menu");
      await expect(menu).toBeVisible();
      const box = await menu.boundingBox();
      const vh = page.viewportSize()!.height;
      // The panel fills everything below the 64px header.
      expect(box!.height).toBeGreaterThan(vh - 64 - 4);
      expect(box!.width).toBeGreaterThanOrEqual(page.viewportSize()!.width - 1);

      // Every nav item is visible and big enough to tap; the page behind cannot scroll.
      for (const label of ["Product", "Knowledge", "Automations", "Channels", "Pricing", "Developers", "Docs"]) {
        const link = menu.getByRole("link", { name: label, exact: true });
        await expect(link).toBeVisible();
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      await expect(menu.getByRole("link", { name: "Start free trial" })).toBeVisible();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

      // Escape closes it and gives back scrolling and focus.
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");

      // Tapping a link goes there and closes the menu.
      await page.getByRole("button", { name: "Open menu" }).tap();
      await page.locator("#mobile-menu").getByRole("link", { name: "Pricing", exact: true }).tap();
      await page.waitForURL("**/pricing");
      await expect(page.locator("#mobile-menu")).toBeHidden();
    });

    test("the hero shows the whole dashboard, not a crop", async ({ page }) => {
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      const img = page.locator("section").first().locator('img[alt^="The Vicero dashboard"]:visible').first();
      await img.scrollIntoViewIfNeeded();
      const b = await img.boundingBox();
      const vw = page.viewportSize()!.width;
      // Full width of the content area, with the screenshot's own proportions (1440 x 900).
      expect(b!.width).toBeGreaterThan(vw - 48);
      expect(b!.width).toBeLessThanOrEqual(vw);
      expect(Math.abs(b!.height / b!.width - 900 / 1440)).toBeLessThan(0.02);
      // Not clipped by a parent.
      const clipped = await img.evaluate((el) => { const r = el.getBoundingClientRect(); const p = el.parentElement!.getBoundingClientRect(); return r.left < p.left - 1 || r.right > p.right + 1 || r.height > p.height + 2; });
      expect(clipped).toBe(false);
    });
  });
}
