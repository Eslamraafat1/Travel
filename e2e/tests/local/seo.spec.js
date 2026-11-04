import { test, expect } from '@playwright/test';

const head = async (request, path) => (await request.get(path)).text();
const attr = (html, re) => html.match(re)?.[1];
const canonical = (html) => attr(html, /<link rel="canonical" href="([^"]+)"/);
const jsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    const data = JSON.parse(m[1]); // throws (fails the test) on invalid JSON
    return Array.isArray(data) ? data : [data];
  });

test.describe('SEO', () => {
  for (const [path, title] of [
    ['/', 'Tour Egypt Club - Egypt Tours & Travel Packages'],
    ['/trips', 'Trips & Excursions | Tour Egypt Club'],
    ['/packages', 'Travel Packages | Tour Egypt Club'],
    ['/trips/7', 'VIP tour inside Giza Pyramids | Tour Egypt Club'],
  ]) {
    test(`${path}: title, absolute https canonical, OG/Twitter`, async ({ request }) => {
      const html = await head(request, path);
      expect(attr(html, /<title>([^<]+)<\/title>/)?.replace(/&amp;/g, '&')).toBe(title);
      const url = canonical(html);
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toContain('localhost');
      expect(new URL(url).pathname.replace(/\/$/, '') || '/').toBe(path === '/' ? '/' : path);
      expect(attr(html, /<meta property="og:url" content="([^"]+)"/)).toBe(url);
      expect(attr(html, /<meta property="og:image" content="([^"]+)"/)).toMatch(/^https:\/\//);
      expect(attr(html, /<meta name="twitter:card" content="([^"]+)"/)).toBe('summary_large_image');
      expect(html).not.toMatch(/wanderlust/i);
    });
  }

  test('JSON-LD: organization on every page, TouristTrip + BreadcrumbList on detail pages', async ({ request }) => {
    const home = jsonLd(await head(request, '/'));
    expect(home.map((d) => d['@type'])).toEqual(expect.arrayContaining(['TravelAgency', 'WebSite']));
    expect(home.find((d) => d['@type'] === 'TravelAgency').name).toBe('Tour Egypt Club');

    for (const path of ['/trips/7', '/packages/1']) {
      const items = jsonLd(await head(request, path));
      const trip = items.find((d) => d['@type'] === 'TouristTrip');
      expect(trip?.name).toBeTruthy();
      expect(trip.offers.priceCurrency).toBe('EGP');
      expect(trip.offers.price).toBeGreaterThan(0);
      expect(trip.aggregateRating).toBeUndefined();
      for (const img of trip.image) expect(img).toMatch(/^https:\/\/[^/]+\/images\/egypt\/.+\.webp$/);
      const crumbs = items.find((d) => d['@type'] === 'BreadcrumbList');
      expect(crumbs.itemListElement).toHaveLength(3);
      expect(crumbs.itemListElement[2].item).toMatch(new RegExp(`^https://[^/]+${path}$`));
    }
  });

  test('robots.txt references the sitemap and blocks private areas', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const txt = await res.text();
    expect(txt).toMatch(/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m);
    expect(txt).toContain('Disallow: /dashboard');
    expect(txt).not.toContain('localhost');
  });

  test('sitemap.xml lists the indexable pages, trips and packages', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(20);
    for (const loc of locs) expect(loc).toMatch(/^https:\/\/(?!localhost)/);
    const paths = locs.map((l) => new URL(l).pathname);
    expect(paths).toEqual(expect.arrayContaining(['/', '/trips', '/packages', '/trips/7', '/trips/3', '/packages/1', '/packages/2', '/explore/hotels']));
    expect(paths).not.toContain('/dashboard');
  });

  for (const path of ['/dashboard', '/login', '/checkout/3']) {
    test(`${path} is noindex`, async ({ request }) => {
      const html = await head(request, path);
      expect(attr(html, /<meta name="robots" content="([^"]+)"/)).toContain('noindex');
    });
  }
});
