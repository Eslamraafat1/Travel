import { test, expect } from './fixtures.js';

test.describe('Trips catalogue', () => {
  test('lists trips and opens a trip detail page', async ({ page }) => {
    await page.goto('/trips');
    const cards = page.locator('a[id^="trip-book-"]');
    await expect(cards.first()).toBeVisible();
    // The five trips published on touregyptclub.com.
    await expect(cards).toHaveCount(5);

    await page.locator('a[href="/trips/7"] h3').click();
    await expect(page).toHaveURL(/\/trips\/7$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('VIP tour inside Giza Pyramids');
  });

  test('search is case-insensitive and updates the result count', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.locator('a[id^="trip-book-"]').first()).toBeVisible();

    await page.getByLabel('Search').fill('sharm'); // lower-case on purpose (regression)
    await expect(page.locator('a[id^="trip-book-"]')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Sharm El-Sheikh Diving Adventure' })).toBeVisible();

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

    await page.locator('#cat-beach-holidays').click();
    await expect(page.locator('#cat-beach-holidays')).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => cards.count()).toBeLessThan(total);
    await expect(cards).toHaveCount(1); // Hurghada & Red Sea Luxury

    const first = cards.first();
    const title = (await first.locator('h3').innerText()).trim();
    // The grid uses a framer-motion layout animation: retry the click if it
    // lands while the card is still moving.
    await expect(async () => {
      await first.locator('h3').click();
      await expect(page).toHaveURL(/\/packages\/\d+$/, { timeout: 2_000 });
    }).toPass();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  });
});

test.describe('Catalogue content (mirrors touregyptclub.com)', () => {
  test('trip detail shows the published price, itinerary stops and upgrades', async ({ page }) => {
    await page.goto('/trips/7');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('VIP tour inside Giza Pyramids');
    await expect(page.getByText('3,800').first()).toBeVisible();
    // A 3–4 hour tour is listed by stop, not by day.
    const itinerary = page.getByTestId('trip-itinerary');
    await expect(itinerary.getByRole('heading', { name: 'Stop 1: The Giza Pyramids from the Outside' })).toBeVisible();
    await expect(itinerary.locator('h4')).toHaveCount(7);
    await expect(page.getByTestId('trip-upgrades').getByText('Special Access to the Great Sphinx')).toBeVisible();
  });

  test('multi-day trip itinerary is numbered by day', async ({ page }) => {
    await page.goto('/trips/6');
    await expect(page.getByTestId('trip-itinerary').getByRole('heading', { name: 'Day 1: Luxor East Bank' })).toBeVisible();
  });

  test('no invented ratings or review counts are rendered', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.locator('[data-testid="trip-card"]').first()).toBeVisible();
    await expect(page.getByText(/reviews?\b/i)).toHaveCount(0);
    await page.goto('/packages/1');
    await expect(page.getByTestId('package-overview')).toContainText('Red Sea');
    await expect(page.getByText(/\(342\)/)).toHaveCount(0);
  });

  test('every image is served locally and loads (no broken images)', async ({ page }) => {
    const failed = [];
    const remote = [];
    page.on('response', (res) => {
      if (res.request().resourceType() === 'image' && res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
    });
    page.on('request', (req) => {
      if (req.resourceType() === 'image' && !req.url().startsWith(new URL(page.url() || 'http://x').origin)) remote.push(req.url());
    });
    for (const path of ['/', '/trips', '/trips/7', '/packages', '/packages/2', '/planner']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      // Scroll so lazy images load.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
      });
      await page.waitForLoadState('networkidle');
      const broken = await page.locator('img').evaluateAll((imgs) =>
        imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src')));
      expect(broken, path).toEqual([]);
    }
    expect(failed).toEqual([]);
    expect(remote.filter((u) => /unsplash|pravatar/.test(u))).toEqual([]);
  });
});

test.describe('Trip planner', () => {
  test('searching a destination suggests matching catalogue items', async ({ page }) => {
    await page.goto('/planner');
    await page.locator('#planner-to').fill('Luxor');
    await page.locator('#planner-search').click();
    const results = page.getByTestId('planner-result');
    await expect(results.first()).toBeVisible();
    await expect(results).toHaveCount(1);
    await expect(results.first()).toContainText('Luxor & Aswan Nile Cruise');
    await expect(results.first()).toContainText('5,500 EGP');
    await results.first().getByRole('link').click();
    await expect(page).toHaveURL(/\/trips\/6$/);
  });
});
