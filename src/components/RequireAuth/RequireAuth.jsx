"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Client-side guard for the demo admin area. Auth is mocked (localStorage),
// so this only keeps casual visitors out of the UI — it is NOT security.
// A real deployment must protect these routes and their data on the server.
export default function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
    }
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return (
      <div role="status" aria-live="polite" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        Loading…
      </div>
    );
  }
  return children;
}
