import { test, expect } from './fixtures.js';

test.describe('Booking flow', () => {
  test('trip detail "book" leads to checkout for that trip', async ({ page }) => {
    await page.goto('/trips/3');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sharm El-Sheikh Diving Adventure');
    await page.getByRole('button', { name: /confirm booking/i }).first().click();
    await expect(page).toHaveURL(/\/checkout\/3$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Complete Your Booking' })).toBeVisible();
  });

  test('checkout validates each step before moving on', async ({ page }) => {
    await page.goto('/checkout/3');
    const next = page.getByRole('button', { name: /booking details/i });
    await expect(page.getByLabel('Full Name')).toBeVisible();

    // Empty form: stays on step 1 and the first invalid field gets focus.
    await next.click();
    await expect(page.getByLabel('Full Name')).toBeFocused();
    expect(await page.getByLabel('Full Name').evaluate((el) => el.validity.valueMissing)).toBe(true);

    // Invalid e-mail is rejected too.
    await page.getByLabel('Full Name').fill('Test Traveller');
    await page.getByLabel('Email Address').fill('not-an-email');
    await page.getByLabel('Phone Number').fill('+20 100 000 0000');
    await next.click();
    await expect(page.getByLabel('Email Address')).toBeFocused();
    expect(await page.getByLabel('Email Address').evaluate((el) => el.validity.typeMismatch)).toBe(true);

    // Valid step 1 -> step 2; a date is required before payment.
    await page.getByLabel('Email Address').fill('traveller@example.com');
    await next.click();
    await expect(page.getByLabel('Preferred Date')).toBeVisible();
    await page.getByRole('button', { name: /payment method/i }).click();
    await expect(page.getByLabel('Preferred Date')).toBeFocused();

    // Pick 2 guests: the summary total doubles.
    await page.getByLabel(/number of people/i).selectOption('2');
    const future = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    await page.getByLabel('Preferred Date').fill(future);
    await page.getByRole('button', { name: /payment method/i }).click();

    await expect(page.getByText('9,000')).toBeVisible(); // 2 × 4,500 EGP
    await page.getByRole('button', { name: /confirm & pay/i }).click();
    await expect(page.getByText('Booking confirmed successfully!')).toBeVisible();
  });
});
