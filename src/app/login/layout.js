import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ title: "Log In", path: "/login", noindex: true });

export default function Layout({ children }) {
  return children;
}
