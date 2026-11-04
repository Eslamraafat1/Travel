import Image from "next/image";

// Hosts allowed in next.config.mjs `images.remotePatterns` — keep in sync.
const OPTIMIZED_HOSTS = new Set(["images.unsplash.com", "i.pravatar.cc"]);

export function canOptimize(src) {
  if (typeof src !== "string") return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true; // local file in /public
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/**
 * next/image that also accepts URLs from unknown hosts (e.g. images entered in
 * the demo dashboard): those are rendered unoptimized instead of throwing.
 */
export default function SmartImage({ src, alt = "", ...props }) {
  if (!src) return null;
  return <Image src={src} alt={alt} unoptimized={!canOptimize(src)} {...props} />;
}
