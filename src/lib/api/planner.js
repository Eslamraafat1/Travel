// Trip planner: matches what the traveller types against the real catalogue
// (src/lib/mockData) instead of inventing destinations or prices.
import { mockTrips } from "../mockData/trips";
import { mockPackages } from "../mockData/packages";
import { getStoredTrips, getStoredPackages } from "../adminStore";

// Egyptian destinations offered on touregyptclub.com (catalogue + planner page).
// `match` lists the words used in the catalogue's destination/title fields.
export const destinationsList = [
  { id: "giza", en: "Giza", ar: "الجيزة", color: "#d97706", match: ["giza", "pyramid"] },
  { id: "cairo", en: "Cairo", ar: "القاهرة", color: "#f59e0b", match: ["cairo"] },
  { id: "luxor", en: "Luxor", ar: "الأقصر", color: "#ef4444", match: ["luxor"] },
  { id: "aswan", en: "Aswan", ar: "أسوان", color: "#a855f7", match: ["aswan", "nile cruise"] },
  { id: "hurghada", en: "Hurghada", ar: "الغردقة", color: "#00b4d8", match: ["hurghada", "red sea"] },
  { id: "sharm", en: "Sharm El-Sheikh", ar: "شرم الشيخ", color: "#0077b6", match: ["sharm", "red sea"] },
  { id: "western-desert", en: "Western Desert", ar: "الصحراء الغربية", color: "#b45309", match: ["desert", "bahariya", "siwa"] },
  { id: "alexandria", en: "Alexandria", ar: "الإسكندرية", color: "#22c55e", match: ["alexandria"] },
];

// Shown under the search box (same examples as the live site's placeholder).
export const popularDestinationIds = ["giza", "luxor", "hurghada", "sharm"];

function catalogue() {
  const isBrowser = typeof window !== "undefined";
  const trips = isBrowser ? getStoredTrips(mockTrips) : mockTrips;
  const packages = isBrowser ? getStoredPackages(mockPackages) : mockPackages;
  return [
    ...trips.map((item) => ({ ...item, kind: "trip", href: `/trips/${item.id}` })),
    ...packages.map((item) => ({ ...item, kind: "package", href: `/packages/${item.id}` })),
  ];
}

function normalize(text) {
  return String(text || "").toLowerCase().trim();
}

/** Destinations whose English or Arabic name contains the query. */
export function getMatchedDestinations(query) {
  const q = normalize(query);
  if (!q) return [];
  return destinationsList.filter((d) => normalize(d.en).includes(q) || d.ar.includes(query.trim()) || d.id.includes(q));
}

function searchTerms(toQuery) {
  const q = normalize(toQuery);
  if (!q) return [];
  const known = getMatchedDestinations(toQuery);
  return known.length ? known.flatMap((d) => d.match) : [q];
}

/**
 * Catalogue items that go to the requested destination. `matched` is false
 * when nothing fits and the whole catalogue is returned as a fallback.
 */
export function getSuggestions(fromQuery, toQuery) {
  const items = catalogue();
  const terms = searchTerms(toQuery);
  const hits = terms.length
    ? items.filter((item) => {
        const haystack = normalize([item.destination, item.destinationEn, item.title, item.titleEn].join(" "));
        return terms.some((term) => haystack.includes(term));
      })
    : [];
  return { matched: hits.length > 0, items: hits.length ? hits : items };
}
