import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ title: "Create an Account", path: "/register", noindex: true });

export default function Layout({ children }) {
  return children;
}
