import { notFound } from "next/navigation";
import { pageMetadata, jsonLd } from "@/lib/site";
import { breadcrumbLd } from "@/lib/structuredData";
import { EXPLORE_CATEGORIES } from "@/lib/exploreCategories";

export function generateStaticParams() {
  return Object.keys(EXPLORE_CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const label = EXPLORE_CATEGORIES[category];
  if (!label) return {};
  return pageMetadata({
    title: `${label} in Egypt`,
    description: `Discover ${label.toLowerCase()} in Egypt with the Tour Egypt Club explore guide.`,
    path: `/explore/${category}`,
  });
}

export default async function CategoryLayout({ children, params }) {
  const { category } = await params;
  const label = EXPLORE_CATEGORIES[category];
  if (!label) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Explore", path: "/explore" },
            { name: label, path: `/explore/${category}` },
          ])
        )}
      />
      {children}
    </>
  );
}
