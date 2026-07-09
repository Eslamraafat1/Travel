import apiClient, { USE_MOCK_API } from "./config";
import { ENDPOINTS } from "./endpoints";
import { mockPackages, mockStats } from "../mockData/packages";
import { localizePackage } from "../localizeContent";
import { getStoredPackages } from "../adminStore";
import { getContentOverrides } from "../contentStore";

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

export async function getHomeStats(lang = "ar") {
  if (USE_MOCK_API) {
    await delay(300);
    const overrides = getContentOverrides(lang);
    const statsOverride = overrides.home?.stats;
    if (statsOverride && typeof statsOverride === "object" && Object.keys(statsOverride).length > 0) {
      return { ...mockStats, ...statsOverride };
    }
    return mockStats;
  }
  return await apiClient.get(ENDPOINTS.STATS.HOME);
}
