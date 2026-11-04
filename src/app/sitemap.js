import { absoluteUrl } from "@/lib/site";
import { mockTrips } from "@/lib/mockData/trips";
import { mockPackages } from "@/lib/mockData/packages";
import { EXPLORE_CATEGORIES } from "@/lib/exploreCategories";

// Indexable routes of this codebase. Trips and packages come from the same
// catalogue the pages render (src/lib/mockData) — swap for the API when
// USE_MOCK_API is turned off.
export default function sitemap() {
  const lastModified = new Date();
  const page = (path, priority, changeFrequency = "weekly") => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "daily"),
    page("/packages", 0.9, "daily"),
    page("/trips", 0.9, "daily"),
    page("/explore", 0.7),
    page("/planner", 0.6, "monthly"),
    page("/about", 0.5, "monthly"),
    page("/contact", 0.5, "monthly"),
    ...mockPackages.map((p) => page(`/packages/${p.id}`, 0.8)),
    ...mockTrips.map((t) => page(`/trips/${t.id}`, 0.8)),
    ...Object.keys(EXPLORE_CATEGORIES).map((c) => page(`/explore/${c}`, 0.6)),
  ];
}
