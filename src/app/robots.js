import { absoluteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/checkout/", "/login", "/register", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
