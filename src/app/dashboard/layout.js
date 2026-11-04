import { pageMetadata } from "@/lib/site";
import RequireAuth from "@/components/RequireAuth/RequireAuth";

// Demo admin area: never indexed, and only rendered for a (mock) logged-in user.
export const metadata = pageMetadata({ title: "Dashboard", path: "/dashboard", noindex: true });

export default function Layout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
