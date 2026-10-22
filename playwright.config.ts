import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke + accessibility tests (SPEC Appendix C). Runs against a production build:
 *   npm run build && npm run test:e2e
 * PLAYWRIGHT_CHROMIUM_PATH lets a machine with a preinstalled Chromium skip the browser download.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;
const PORT = Number(process.env.E2E_PORT ?? 3200);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, launchOptions: { executablePath } },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: "desktop-full",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "desktop-reduced",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
        reducedMotion: "reduce",
      },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
