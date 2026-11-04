import { defineConfig, devices } from '@playwright/test';

// By default the suite runs against a production build of THIS repository:
// Playwright starts `npm run start` in the project root (run `npm run build`
// there first). Set BASE_URL to test an already running server instead.
//
// The production site (https://touregyptclub.com) is deployed separately and
// has grown beyond this codebase; its smoke test lives in tests/live and runs
// with its own config: `npm run test:live` (playwright.live.config.js).
const PORT = Number(process.env.PORT || 3000);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/local',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-chrome',
      testIgnore: ['**/*.mobile.spec.js'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      testMatch: ['**/*.mobile.spec.js'],
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${PORT}`,
        cwd: '..',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
