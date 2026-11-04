import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Trip Planner",
  description: "Plan your Egypt trip: pick where you start and where you want to go and get destination and route suggestions.",
  path: "/planner",
});

export default function Layout({ children }) {
  return children;
}
