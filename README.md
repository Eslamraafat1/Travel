<div align="center">

# Tour Egypt Club

**A bilingual (Arabic / English) front end for an Egyptian tourism company's tours and booking site, built with Next.js 16 and React 19.**

[![E2E Tests](https://github.com/Eslamraafat1/Travel/actions/workflows/e2e.yml/badge.svg)](https://github.com/Eslamraafat1/Travel/actions/workflows/e2e.yml)
![Next.js](https://img.shields.io/badge/Next.js-16.2.10-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock&logoColor=black)
![Playwright](https://img.shields.io/badge/Playwright-1.48-2EAD33?logo=playwright&logoColor=white)

[**Live Site**](https://touregyptclub.com/) · [**Portfolio**](https://new-portfolio-ashy-xi.vercel.app) · [**LinkedIn**](https://www.linkedin.com/in/eslamraafat-dev/)

<br />

<img src="docs/screenshots/desktop.jpg" alt="Tour Egypt Club home page on desktop" width="72%" />
&nbsp;
<img src="docs/screenshots/mobile.jpg" alt="Tour Egypt Club home page on mobile (iPhone 13)" width="22%" />

<sub>The production site at touregyptclub.com on desktop (1440×900) and on an iPhone 13.</sub>

</div>

---

## 📌 Overview

Tour Egypt Club is a **client project**: the website of a tourism company. It sells day trips, multi-day packages and Nile and Red Sea holidays across Egypt to local and international travelers.

The front end had to solve three problems:

1. **Two audiences, two scripts.** Arabic and English speakers need the same content, and Arabic needs a correct right-to-left layout.
2. **Discovery before booking.** Travelers browse, filter and compare trips and packages, plan a route and find places nearby before they commit.
3. **Search visibility.** Most international customers arrive from search engines, so the site needs clean metadata and a structure that search engines can crawl.

> **About this repository:** it holds the front-end codebase: pages, components, i18n and an API layer with mock data. The production site at [touregyptclub.com](https://touregyptclub.com/) has grown beyond this snapshot (for example, Blog and News sections and server-generated SEO files). The Playwright suite in [`e2e/`](./e2e) tests that live deployment.

## ✨ Key Features

### Booking journey
- **Packages and trips:** listing pages filter by type or category, text search, duration and price range. Detail pages show the itinerary, what is included and excluded, highlights and FAQs.
- **3-step checkout** (`/checkout/[id]`): personal info, then booking details, then payment method, with a progress indicator.
- **Trip planner** (`/planner`): suggests destinations and routes from a "from" and a "to" query.
- **Explore guide** (`/explore/[category]/[id]`): nearby restaurants, hotels, cafés, activities, transport and essentials from the **Foursquare Places API v3**. It falls back to built-in mock data when no API key is set.
- **Content dashboard** (`/dashboard`): add, edit and delete trips and packages, and override home-page text for each language. Changes are saved in `localStorage`, so this is a demo admin layer.
- Login and register screens backed by a mock `AuthContext`.

### i18n & RTL
- A custom `LanguageContext` with dot-path translation keys, `{param}` interpolation and a fallback to the key. `src/locales/en.js` and `src/locales/ar.js` each hold about 700 lines of strings.
- Arabic is the default. The chosen language is saved, and an inline script in `<head>` sets `<html lang>` and `dir="rtl|ltr"` **before hydration**, so the page never flashes in the wrong direction.
- Data-level localization (`src/lib/localizeContent.js`) maps `titleEn`, `itineraryEn`, `faqsEn` and similar fields onto trips and packages.
- Two Google Fonts families: **Outfit** for Latin text and **Cairo** for Arabic.

### UI / UX
- Light and dark themes through `ThemeContext` and a `data-theme` attribute, saved for each visitor.
- Motion with **Framer Motion** (`motion` and `AnimatePresence`) across pages, and **GSAP + ScrollTrigger** on the Explore pages.
- Statistic counters that animate when they scroll into view (`IntersectionObserver` and `requestAnimationFrame` with easing).
- A responsive navbar whose mobile menu closes on route change, a scroll-to-top button and a custom 404 page.
- Component-scoped styles with **CSS Modules**, and icons from `lucide-react`.

### Back-end integration
- One **Axios** client (`src/lib/api/config.js`): base URL from an environment variable, a 10 s timeout, a request interceptor that adds a `Bearer` token and a response interceptor that logs errors globally.
- All endpoints are defined in one file (`src/lib/api/endpoints.js`). One `USE_MOCK_API` flag switches every service from mock data to the real REST API.
- A **Route Handler** at `POST /api/chat`: an Egypt travel assistant built on the OpenAI SDK (`gpt-4o-mini`). It answers from keyword matching when no key is set or the API call fails.

## 🛠 Tech Stack

| Area | Tools |
|---|---|
| Framework | Next.js 16.2.10 (App Router), React 19.2.4, React Compiler (`babel-plugin-react-compiler` 1.0.0) |
| Language | JavaScript (ES modules), `@/*` path alias |
| Styling | CSS Modules, CSS custom properties for theming, Google Fonts (Outfit, Cairo) |
| Animation | Framer Motion 12, GSAP 3.15 (ScrollTrigger) |
| Data / APIs | Axios 1.x, OpenAI SDK 6.x, Foursquare Places API v3 |
| Icons | lucide-react |
| Code quality | ESLint 9 with `eslint-config-next` (Core Web Vitals rules) |
| Testing | Playwright 1.48.2 (Desktop Chrome and Pixel 7 emulation) |
| CI | GitHub Actions |

## 🔍 SEO & Performance

**In this codebase**
- **Metadata API:** the root layout exports `metadata` with the title, description, keywords and Open Graph fields.
- **Correct `lang` and `dir` on `<html>`**, set before first paint. This helps screen readers and search engines identify the page as Arabic or English.
- **React Compiler** is on (`reactCompiler: true` in `next.config.mjs`) and memoizes components automatically.
- **Font loading:** `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`, with `display=swap`.
- `next.config.mjs` allows remote images from `images.unsplash.com` and `i.pravatar.cc`.
- File-based routing with dynamic segments (`/trips/[id]`, `/packages/[id]`, `/explore/[category]/[id]`) gives every trip, package and place its own URL that search engines can crawl.

**On the production site** (checked against https://touregyptclub.com)
- A `robots.txt` that disallows `/dashboard` and points to the sitemap.
- A `sitemap.xml` with `lastmod`, `changefreq` and `priority` for each URL.
- Open Graph tags and a Twitter `summary_large_image` card with a 1200×630 image, plus `robots` and `googlebot` directives (`max-image-preview:large`).

## 🧪 Testing & QA

An automated **Playwright** suite in [`e2e/`](./e2e) runs against the live site by default. Set `BASE_URL` to test any other URL.

| Area | What is verified |
|---|---|
| Key pages | `/`, `/trips`, `/about`, `/contact` and `/blog` return **HTTP 200** with a `<title>` containing "Tour Egypt" |
| More pages | `/explore`, `/travel-guide` and `/planner` return **HTTP 200** |
| SEO | `/robots.txt` is served, and `/sitemap.xml` is served and contains a `<urlset>` |

- **10 test cases on 2 projects** (Desktop Chrome and Pixel 7 mobile), so **20 runs** per pipeline.
- In CI, failed tests retry twice. The first retry records a trace, failures get screenshots, and the HTML report is uploaded as an artifact and kept for 14 days.
- **CI:** [`.github/workflows/e2e.yml`](./.github/workflows/e2e.yml) runs on every push to `main`, on every pull request and on manual dispatch, using Node 20 and Chromium.

**Pre-release checklist** (the suite checks each item automatically):
- [ ] Every key page responds with 200 on desktop and mobile
- [ ] Page titles include the brand name
- [ ] `robots.txt` and `sitemap.xml` are reachable and valid

```bash
cd e2e
npm install
npx playwright install chromium
npm test                                  # against https://touregyptclub.com
BASE_URL=http://localhost:3000 npm test   # against a local dev server
npm run report                            # open the last HTML report
```

## 📁 Project Structure

```text
.
├── .github/workflows/e2e.yml     # Playwright E2E pipeline
├── e2e/                          # Standalone Playwright project (config + tests)
│   └── tests/smoke.spec.js       # Page-availability and SEO checks
├── docs/screenshots/             # README images
├── public/                       # Static assets
└── src/
    ├── app/                      # App Router pages
    │   ├── layout.js             # Root layout: metadata, lang/dir script, providers
    │   ├── page.js               # Home
    │   ├── packages/ trips/      # Listings + [id] detail pages
    │   ├── explore/              # Places guide: [category]/[id]
    │   ├── planner/              # Trip planner
    │   ├── checkout/[id]/        # 3-step booking flow
    │   ├── dashboard/            # Content/admin demo
    │   ├── about/ contact/ login/ register/
    │   ├── api/chat/route.js     # Travel-assistant Route Handler (OpenAI + fallback)
    │   └── not-found.js          # Custom 404
    ├── components/               # Navbar, Footer, TripCard, PackageCard, Chatbot, ScrollToTop
    ├── context/                  # Language, Theme and Auth providers
    ├── locales/                  # en.js / ar.js translation dictionaries
    └── lib/
        ├── api/                  # Axios client, endpoints, services (packages, trips, explore, planner)
        ├── mockData/             # Seed trips and packages
        └── localizeContent.js    # Per-language field mapping
```

## 🚀 Getting Started

**Prerequisites:** Node.js 20.9 or newer (Next.js 16 requires it; CI uses Node 20) and npm.

```bash
git clone https://github.com/Eslamraafat1/Travel.git
cd Travel
npm install
npm run dev
```

Then open http://localhost:3000.

### Environment variables (optional)

Create `.env.local` in the project root. The app runs without any of these variables and uses mock data and fallbacks instead.

| Variable | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `src/lib/api/config.js` | Base URL of the REST back end, used when `USE_MOCK_API = false` |
| `NEXT_PUBLIC_FSQ_KEY` | `src/lib/api/explore.js` | Foursquare Places API key for the Explore guide |
| `OPENAI_API_KEY` | `src/app/api/chat/route.js` | Turns on real answers from the travel assistant |

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## ☁️ Deployment

The production site is live at **[touregyptclub.com](https://touregyptclub.com/)**. `npm run build && npm run start` produces a standard Next.js Node server, so the app runs on any Node host. After each push to `main`, the E2E workflow tests the live deployment.

## 👤 Author

**Eslam Raafat**, Front-End Developer (React · Next.js · TypeScript)

- Portfolio: [new-portfolio-ashy-xi.vercel.app](https://new-portfolio-ashy-xi.vercel.app)
- LinkedIn: [in/eslamraafat-dev](https://www.linkedin.com/in/eslamraafat-dev/)
- GitHub: [@Eslamraafat1](https://github.com/Eslamraafat1)
- Email: [eslamraafat736@gmail.com](mailto:eslamraafat736@gmail.com)

## 📄 License

This is a client project. All rights reserved. The source code is shared for portfolio review only.
