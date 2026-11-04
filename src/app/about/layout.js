import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Us",
  description: "Meet Tour Egypt Club — our mission, our values and the team that plans Egypt tours, Nile cruises and Red Sea holidays.",
  path: "/about",
});

export default function Layout({ children }) {
  return children;
}
