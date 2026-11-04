import { test, expect } from './fixtures.js';

test('mobile menu opens, navigates and closes', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('#mobile-menu-btn');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-menu').getByRole('link', { name: 'Trips', exact: true }).click();
  await expect(page).toHaveURL(/\/trips$/);
  await expect(page.locator('#mobile-menu-btn')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-testid="trip-card"]').first()).toBeVisible();
});

test('language toggle is reachable on mobile', async ({ page }) => {
  await page.goto('/trips');
  await page.locator('#lang-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});
