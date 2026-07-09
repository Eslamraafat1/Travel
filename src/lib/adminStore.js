const TRIPS_KEY = "admin_trips";
const PACKAGES_KEY = "admin_packages";

function load(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

function save(key, data) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function getStoredTrips(fallback) {
  return load(TRIPS_KEY, fallback);
}

export function setStoredTrips(trips) {
  save(TRIPS_KEY, trips);
}

export function getStoredPackages(fallback) {
  return load(PACKAGES_KEY, fallback);
}

export function setStoredPackages(packages) {
  save(PACKAGES_KEY, packages);
}
