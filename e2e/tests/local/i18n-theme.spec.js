import { test as base, expect } from '@playwright/test';
import { test } from './fixtures.js';

base.describe('Language', () => {
  base('server renders Arabic (default) with lang="ar" dir="rtl" and real strings', async ({ request }) => {
    const html = await (await request.get('/trips')).text();
    expect(html).toMatch(/<html[^>]*\blang="ar"/);
    expect(html).toMatch(/<html[^>]*\bdir="rtl"/);
    expect(html).not.toMatch(/>(nav|footer|pages)\.[a-zA-Z.]+</); // no raw i18n keys
  });

  base('toggle switches lang/dir and nav labels, and the choice persists', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(nav.getByRole('link', { name: 'الرئيسية' })).toBeVisible();

    await page.getByRole('button', { name: 'Switch to English' }).click();
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();

    await page.reload();
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(html).toHaveAttribute('dir', 'ltr');

    await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(nav.getByRole('link', { name: 'الرئيسية' })).toBeVisible();
  });
});

test.describe('Theme', () => {
  test('theme toggle switches data-theme and persists', async ({ page }) => {
    await page.goto('/about');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');
    const toggle = page.locator('#theme-toggle');
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});
