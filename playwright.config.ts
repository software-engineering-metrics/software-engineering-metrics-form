import { defineConfig } from '@playwright/test';

const PORT = 8123;

export default defineConfig({
  testDir: 'tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'list' : 'line',
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `node scripts/serve.mjs`,
    port: PORT,
    reuseExistingServer: !process.env.CI
  }
});
