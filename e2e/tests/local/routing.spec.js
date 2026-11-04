import { test, expect, trackPageErrors } from './fixtures.js';

test.describe('Routing & guards', () => {
  test('unknown URL returns 404 with the custom page', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist');
    expect(res.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to Home' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('unknown explore category returns 404', async ({ page }) => {
    const res = await page.goto('/explore/not-a-category');
    expect(res.status()).toBe(404);
  });

  test('dashboard redirects to login, then back after (mock) login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password', { exact: true }).fill('demo-password');
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
  });

  test('explore uses the server proxy and falls back to demo data without a key', async ({ page, request }) => {
    const api = await request.get('/api/places?op=search&category=hotels');
    expect(api.status()).toBe(200);
    const body = await api.json();
    // CI has no FSQ_KEY: the proxy reports it instead of leaking/needing a browser key.
    if (body.configured === false) {
      await page.goto('/explore/hotels');
      await expect(page.getByText('Nile Palace Hotel').first()).toBeVisible();
    }
    expect((await request.get('/api/places?op=detail&id=../../secret')).status()).toBe(400);
  });

  test('key pages render without uncaught errors', async ({ page }) => {
    const errors = trackPageErrors(page);
    for (const path of ['/', '/trips', '/packages', '/trips/2', '/packages/2', '/explore', '/planner', '/about', '/contact']) {
      const res = await page.goto(path);
      expect(res.status(), path).toBe(200);
      await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
});
