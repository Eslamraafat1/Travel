import { test, expect } from './fixtures.js';

test.describe('Trips catalogue', () => {
  test('lists trips and opens a trip detail page', async ({ page }) => {
    await page.goto('/trips');
    const cards = page.locator('a[id^="trip-book-"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(6);

    await page.locator('a[href="/trips/1"] h3').click();
    await expect(page).toHaveURL(/\/trips\/1$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Enchanting Sharm El-Sheikh Trip');
  });

  test('search is case-insensitive and updates the result count', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.locator('a[id^="trip-book-"]').first()).toBeVisible();

    await page.getByLabel('Search').fill('sharm'); // lower-case on purpose (regression)
    await expect(page.locator('a[id^="trip-book-"]')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Enchanting Sharm El-Sheikh Trip' })).toBeVisible();

    await page.getByLabel('Search').fill('no-such-trip-xyz');
    await expect(page.locator('a[id^="trip-book-"]')).toHaveCount(0);
  });

  test('type filter and price sort', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.locator('a[id^="trip-book-"]').first()).toBeVisible();

    const cards = page.locator('[data-testid="trip-card"]');
    const total = await cards.count();

    await page.locator('#trip-type-beach').click();
    await expect.poll(() => cards.count()).toBeLessThan(total);
    expect(await cards.count()).toBeGreaterThan(0);

    await page.locator('#trip-type-all').click();
    await expect(cards).toHaveCount(total);
    await page.locator('#trips-sort').selectOption('price-asc');
    const prices = () => cards.evaluateAll((els) => els.map((c) => Number(c.dataset.price)));
    await expect.poll(async () => {
      const list = await prices();
      return list.length === total && list.every((p, i) => i === 0 || list[i - 1] <= p);
    }).toBe(true);
  });
});

test.describe('Packages catalogue', () => {
  test('category filter narrows the list and detail page opens', async ({ page }) => {
    await page.goto('/packages');
    const cards = page.locator('[data-testid="package-card"]');
    await expect(cards.first()).toBeVisible();
    const total = await cards.count();

    await page.locator('#cat-beach').click();
    await expect(page.locator('#cat-beach')).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => cards.count()).toBeLessThan(total);

    const first = cards.first();
    const title = (await first.locator('h3').innerText()).trim();
    await first.locator('h3').click();
    await expect(page).toHaveURL(/\/packages\/\d+$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  });
});
