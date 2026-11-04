import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Travel Packages",
  description: "Browse Tour Egypt Club travel packages: filter by category, search by destination and sort by price, rating or duration.",
  path: "/packages",
});

export default function Layout({ children }) {
  return children;
}
