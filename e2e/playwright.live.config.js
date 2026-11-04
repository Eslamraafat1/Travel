import { defineConfig, devices } from '@playwright/test';

// Optional smoke test for the separately deployed production site.
// Not part of CI — the live site is not built from this repository.
export default defineConfig({
  testDir: './tests/live',
  timeout: 60_000,
  retries: 2,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.LIVE_URL || 'https://touregyptclub.com',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'live-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'live-mobile', use: { ...devices['Pixel 7'] } },
  ],
});
