import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Explore Egypt",
  description: "Find hotels, restaurants, cafés, activities, transport and essentials near you in Egypt.",
  path: "/explore",
});

export default function Layout({ children }) {
  return children;
}
