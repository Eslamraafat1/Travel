import { mockPackages } from "@/lib/mockData/packages";
import { pageMetadata, jsonLd } from "@/lib/site";
import { breadcrumbLd, touristTripLd } from "@/lib/structuredData";

const findPackage = (id) => mockPackages.find((p) => String(p.id) === String(id));

// Pre-render the catalogue packages; ids created in the demo dashboard (stored in
// the browser) still render on demand.
export function generateStaticParams() {
  return mockPackages.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pkg = findPackage(id);
  if (!pkg) return pageMetadata({ title: "Package", path: `/packages/${id}`, noindex: true });
  return pageMetadata({
    title: pkg.title,
    description: `${pkg.description.replace(/\.$/, "")}. ${pkg.duration} in ${pkg.destination} from ${pkg.price.toLocaleString("en-US")} ${pkg.currency}.`,
    path: `/packages/${id}`,
    images: [{ url: pkg.image, alt: pkg.title }],
  });
}

export default async function PackageLayout({ children, params }) {
  const { id } = await params;
  const pkg = findPackage(id);
  return (
    <>
      {pkg && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd([
            touristTripLd(pkg, `/packages/${id}`),
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Packages", path: "/packages" },
              { name: pkg.title, path: `/packages/${id}` },
            ]),
          ])}
        />
      )}
      {children}
    </>
  );
}
