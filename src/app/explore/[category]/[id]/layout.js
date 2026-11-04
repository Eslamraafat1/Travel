import { pageMetadata } from "@/lib/site";
import { EXPLORE_CATEGORIES } from "@/lib/exploreCategories";

// Place data comes from Foursquare at request time (or mock data without a
// key), so place pages are not listed in the sitemap.
export async function generateMetadata({ params }) {
  const { category, id } = await params;
  const label = EXPLORE_CATEGORIES[category] || "Places";
  return pageMetadata({
    title: `${label} — place details`,
    description: `Details, photos, opening hours and tips for this place in Egypt (${label.toLowerCase()}).`,
    path: `/explore/${category}/${id}`,
    // Without a Foursquare key the page shows generated demo data — keep it out of the index.
    noindex: !process.env.FSQ_KEY,
  });
}

export default function PlaceLayout({ children }) {
  return children;
}
