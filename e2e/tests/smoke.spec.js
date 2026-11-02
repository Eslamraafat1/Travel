import { test, expect } from '@playwright/test';

// Every key page should load (HTTP 200) with the right <title>
const pages = [
  ['/', /Tour Egypt/i],
  ['/trips', /Tour Egypt/i],
  ['/about', /Tour Egypt/i],
  ['/contact', /Tour Egypt/i],
  ['/blog', /Tour Egypt/i],
];

test.describe('Key pages load', () => {
  for (const [path, title] of pages) {
    test(`${path} returns 200 with correct title`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res.status()).toBe(200);
      await expect(page).toHaveTitle(title);
    });
  }
  for (const path of ["/explore", "/travel-guide", "/planner"]) {
    test(`${path} returns 200`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res.status()).toBe(200);
    });
  }
});

test.describe('SEO', () => {
  test('robots.txt is served', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
  });
  test('sitemap.xml is served', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('<urlset');
  });
});
