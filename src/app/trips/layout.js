import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Trips & Excursions",
  description: "Browse Tour Egypt Club trips and excursions: beach, desert, cultural and wellness trips, filtered by type, duration and price.",
  path: "/trips",
});

export default function Layout({ children }) {
  return children;
}
