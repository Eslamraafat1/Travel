// JSON-LD builders (schema.org). Only data that exists in the repo is used —
// no ratings/reviews are emitted because the mock ratings are not real.
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

/** TouristTrip for a trip or a package from the mock catalogue. */
export function touristTripLd(item, path) {
  const url = absoluteUrl(path);
  const ld = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: item.title,
    description: item.description,
    url,
    image: [item.image, ...(item.gallery || [])].filter(Boolean),
    touristType: item.type || item.category,
    provider: { "@type": "TravelAgency", "@id": `${SITE_URL}/#organization`, name: SITE.name },
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: item.currency || "EGP",
      url,
      availability: item.availableSeats === 0 ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      ...(item.departureDate ? { validFrom: item.departureDate } : {}),
    },
  };
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
