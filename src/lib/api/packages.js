import apiClient, { USE_MOCK_API } from "./config";
import { ENDPOINTS } from "./endpoints";
import { mockPackages } from "../mockData/packages";
import { mockTrips } from "../mockData/trips";
import { localizePackage } from "../localizeContent";
import { getStoredPackages, getStoredTrips } from "../adminStore";

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

function getPackagesSource() {
  if (typeof window === "undefined") return mockPackages;
  return getStoredPackages(mockPackages);
}

// ===================================================
// PACKAGES API FUNCTIONS
// ===================================================

export async function getAllPackages(category = "all", lang = "ar") {
  if (USE_MOCK_API) {
    await delay();
    const source = getPackagesSource();
    const data = category === "all"
      ? source
      : source.filter((pkg) => pkg.category === category);
    return data.map((pkg) => localizePackage(pkg, lang));
  }
  const endpoint = category === "all" ? ENDPOINTS.PACKAGES.LIST : ENDPOINTS.PACKAGES.BY_CATEGORY(category);
  return await apiClient.get(endpoint);
}

export async function getFeaturedPackages(lang = "ar") {
  if (USE_MOCK_API) {
    await delay();
    return getPackagesSource().filter((pkg) => pkg.featured).map((pkg) => localizePackage(pkg, lang));
  }
  return await apiClient.get(ENDPOINTS.PACKAGES.FEATURED);
}

export async function getPackageById(id, lang = "ar") {
  if (USE_MOCK_API) {
    await delay();
    const packageData = getPackagesSource().find((pkg) => pkg.id === Number(id)) || null;
    return localizePackage(packageData, lang);
  }
  return await apiClient.get(ENDPOINTS.PACKAGES.DETAIL(id));
}

/**
 * Home-page counters, derived from the catalogue itself so they can never
 * drift from what is actually on sale (no invented traveller numbers).
 */
export async function getHomeStats() {
  if (USE_MOCK_API) {
    await delay(300);
    const trips = typeof window === "undefined" ? mockTrips : getStoredTrips(mockTrips);
    const packages = getPackagesSource();
    // "Giza & Cairo, Egypt" -> ["giza", "cairo"]; "Giza Plateau" counts as Giza.
    const places = new Set(
      [...trips, ...packages]
        .flatMap((item) => (item.destinationEn || item.destination || "").replace(/,\s*Egypt$/i, "").split(/\s*&\s*/))
        .map((place) => place.trim().toLowerCase().replace(/\s+plateau$/, ""))
        .filter(Boolean)
    );
    return { trips: trips.length, packages: packages.length, destinations: places.size };
  }
  return await apiClient.get(ENDPOINTS.STATS.HOME);
}
