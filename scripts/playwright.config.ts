import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: /(site|demo\/capture)\.spec\.ts/,
  timeout: 600_000,
  workers: 1,
  reporter: "list",
  // Use the installed Chrome so no browser download is needed.
  use: { channel: "chrome" },
});


