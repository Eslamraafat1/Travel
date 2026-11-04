// ===================================================
// SITE CONFIG — single source of truth for the brand, the canonical
// origin and the business details used in metadata and JSON-LD.
// Copy is taken from the production site (https://touregyptclub.com).
// ===================================================

const PRODUCTION_URL = "https://touregyptclub.com";

function resolveSiteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  // Never let a canonical/sitemap URL point at localhost in a production build.
  if (!fromEnv || (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/.test(fromEnv))) {
    return PRODUCTION_URL;
  }
  return fromEnv.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();

export const SITE = {
  name: "Tour Egypt Club",
  title: "Tour Egypt Club - Egypt Tours & Travel Packages",
  description:
    "Book unforgettable Egypt tours, excursions and travel packages. Explore the Pyramids of Giza, Nile cruises and Red Sea resorts at the best prices.",
  keywords: [
    "egypt tours",
    "egypt travel packages",
    "nile cruise",
    "pyramids tour",
    "red sea holidays",
    "tour egypt club",
    "egypt vacation packages",
    "luxor aswan trips",
    "sharm el sheikh tours",
    "hurghada trips",
  ],
  // Contact details as shown on touregyptclub.com/contact (site settings).
  email: "sales@touregyptclub.com",
  // WhatsApp number linked from the production site.
  phone: "+201062592809",
  phoneDisplay: "+20 106 259 2809",
  address: {
    streetAddress: "120 Al Haram St, El Talbia",
    addressLocality: "Giza",
    addressRegion: "Giza Governorate",
    addressCountry: "EG",
  },
  openingHours: "Sa-Th 09:00-18:00",
  twitter: "@touregyptclub",
  ogImage: {
    url: "https://touregyptclub.com/storage/images/site/egypt_pyramids.jpg",
    width: 1200,
    height: 630,
    alt: "Egypt tours with Tour Egypt Club",
  },
};

/** Absolute URL for a site path ("/trips/1" -> "https://touregyptclub.com/trips/1"). */
export function absoluteUrl(path = "/") {
  return path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Shared metadata builder for route segment layouts. */
export function pageMetadata({ title, description = SITE.description, path = "/", images, noindex = false }) {
  const url = absoluteUrl(path);
  const ogImages = images?.length ? images : [SITE.ogImage];
  // Absolute titles: a plain string title in a parent layout would otherwise
  // reset the root "%s | Tour Egypt Club" template for nested segments.
  const fullTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "ar_EG",
      alternateLocale: ["en_US"],
      title: fullTitle,
      description,
      url,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      title: fullTitle,
      description,
      images: ogImages.map((i) => (typeof i === "string" ? i : i.url)),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLd(data) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
