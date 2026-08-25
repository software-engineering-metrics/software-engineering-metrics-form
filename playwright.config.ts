import { defineConfig } from '@playwright/test';

const SHORT_FORM_PORT = 8123;
const LONG_FORM_PORT = 4173;

export default defineConfig({
  testDir: 'tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'list' : 'line',
  projects: [
    {
      name: 'short form',
      testMatch: 'short-form.spec.ts',
      use: { baseURL: `http://localhost:${SHORT_FORM_PORT}` }
    },
    {
      name: 'long form',
      testMatch: 'long-form.spec.ts',
      use: { baseURL: `http://localhost:${LONG_FORM_PORT}` }
    }
  ],
  webServer: [
    {
      // index.html has no build step, so it is served straight from disk.
      command: 'node scripts/serve.mjs',
      port: SHORT_FORM_PORT,
      reuseExistingServer: !process.env.CI
    },
    {
      // The long form is tested as it ships: prerendered, then hydrated.
      command: `pnpm run build && pnpm exec vite preview --port ${LONG_FORM_PORT} --strictPort`,
      port: LONG_FORM_PORT,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI
    }
  ]
});
