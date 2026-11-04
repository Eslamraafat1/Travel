import { test as base, expect } from '@playwright/test';

// Most specs assert English copy, so start each test in English unless the
// test (or the app, after a toggle) has already stored a language.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      try {
        if (!localStorage.getItem('app-lang')) localStorage.setItem('app-lang', 'en');
      } catch {}
    });
    await use(page);
  },
});

export { expect };

/** Fail the test on uncaught exceptions in the page. */
export function trackPageErrors(page) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}
