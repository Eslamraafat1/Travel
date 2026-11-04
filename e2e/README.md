# E2E Tests — Tour Egypt Club

End-to-end tests written with **Playwright** (Desktop Chrome + Pixel 7).

## `tests/local` — this repository (CI)

Run against a production build of this codebase. Playwright starts `npm run start` in the project root (port `3000`, or `PORT`), unless `BASE_URL` points to a server you started yourself.

| Spec | Covers |
|---|---|
| `catalogue.spec.js` | Trip/package listings, search (case-insensitive), filters, price sort, listing → detail |
| `booking.spec.js` | Trip detail → checkout, per-step form validation, total for N guests, confirmation |
| `i18n-theme.spec.js` | SSR `lang="ar" dir="rtl"`, language toggle → `lang="en" dir="ltr"` + persisted, theme toggle |
| `seo.spec.js` | Titles, absolute canonical (no localhost), OG/Twitter, JSON-LD, robots.txt, sitemap.xml, noindex |
| `routing.spec.js` | 404s, dashboard guard → login → dashboard, Places proxy, no uncaught page errors |
| `navigation.mobile.spec.js` | Mobile menu and language toggle |

26 tests in total (24 desktop, 2 mobile).

## `tests/live` — production smoke test (optional)

https://touregyptclub.com is deployed separately from a later version of the code, so it is only smoke-tested (pages respond, robots/sitemap served): `npm run test:live` (or `LIVE_URL=... npm run test:live`).

## Run

```bash
npm run build          # in the project root
cd e2e
npm install
npx playwright install chromium
npm test
npm run report         # open the last HTML report
```
