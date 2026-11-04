// JSON-LD builders (schema.org). Only data that exists in the catalogue is used;
// no ratings/reviews are emitted because there is no verifiable review source.
import { SITE, SITE_URL, absoluteUrl } from "./site";

export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Local "/images/..." paths -> absolute URLs; remote URLs pass through. */
const absoluteImage = (src) => (typeof src === "string" && src.startsWith("/") ? absoluteUrl(src) : src);

/** TouristTrip for a trip or a package from the catalogue. */
export function touristTripLd(item, path) {
  const url = absoluteUrl(path);
  const hasPrice = Number.isFinite(item.price) && item.price > 0;
  const ld = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: item.title,
    description: item.description,
    url,
    image: [...new Set([item.image, ...(item.gallery || [])].filter(Boolean))].map(absoluteImage),
    touristType: item.type || item.category,
    provider: { "@type": "TravelAgency", "@id": `${SITE_URL}/#organization`, name: SITE.name },
  };
  // Items without a published price ("price on request") get no Offer.
  if (hasPrice) {
    ld.offers = {
      "@type": "Offer",
      price: item.price,
      priceCurrency: item.currency || "EGP",
      url,
      availability: item.availableSeats === 0 ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      ...(item.departureDate ? { validFrom: item.departureDate } : {}),
    };
  }
  if (item.destination) {
    ld.itinerary = {
      "@type": "ItemList",
      itemListElement: (item.itinerary?.length
        ? item.itinerary.map((d) => ({ name: d.title, description: d.desc }))
        : [{ name: item.destination }]
      ).map((stop, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristAttraction", ...stop },
      })),
    };
  }
  return ld;
}
