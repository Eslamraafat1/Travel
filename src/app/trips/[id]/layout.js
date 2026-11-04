import { mockTrips } from "@/lib/mockData/trips";
import { pageMetadata, jsonLd } from "@/lib/site";
import { breadcrumbLd, touristTripLd } from "@/lib/structuredData";

const findTrip = (id) => mockTrips.find((t) => String(t.id) === String(id));

// Pre-render the catalogue trips; ids created in the demo dashboard (stored in
// the browser) still render on demand.
export function generateStaticParams() {
  return mockTrips.map((t) => ({ id: String(t.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const trip = findTrip(id);
  if (!trip) return pageMetadata({ title: "Trip", path: `/trips/${id}`, noindex: true });
  return pageMetadata({
    title: trip.title,
    description: `${trip.description.replace(/\.$/, "")}. ${trip.duration} in ${trip.destination} from ${trip.price.toLocaleString("en-US")} ${trip.currency}.`,
    path: `/trips/${id}`,
    images: [{ url: trip.image, alt: trip.title }],
  });
}

export default async function TripLayout({ children, params }) {
  const { id } = await params;
  const trip = findTrip(id);
  return (
    <>
      {trip && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd([
            touristTripLd(trip, `/trips/${id}`),
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Trips", path: "/trips" },
              { name: trip.title, path: `/trips/${id}` },
            ]),
          ])}
        />
      )}
      {children}
    </>
  );
}
