import apiClient, { USE_MOCK_API } from "./config";
import { ENDPOINTS } from "./endpoints";
import { mockTrips } from "../mockData/trips";
import { localizeTrip } from "../localizeContent";
import { getStoredTrips } from "../adminStore";

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

function getTripsSource() {
  if (typeof window === "undefined") return mockTrips;
  return getStoredTrips(mockTrips);
}

// ===================================================
// TRIPS API FUNCTIONS
// ===================================================

export async function getAllTrips(type = "all", lang = "ar") {
  if (USE_MOCK_API) {
    await delay();
    const source = getTripsSource();
    const data = type === "all" ? source : source.filter((trip) => trip.type === type);
    return data.map((trip) => localizeTrip(trip, lang));
  }
  const endpoint = type === "all" ? ENDPOINTS.TRIPS.LIST : ENDPOINTS.TRIPS.BY_DESTINATION(type);
  return await apiClient.get(endpoint);
}

export async function getPopularTrips(limit = 4, lang = "ar") {
  if (USE_MOCK_API) {
    await delay(400);
    return getTripsSource().sort((a, b) => b.rating - a.rating).slice(0, limit).map((trip) => localizeTrip(trip, lang));
  }
  return await apiClient.get(ENDPOINTS.TRIPS.POPULAR);
}

export async function getTripById(id, lang = "ar") {
  if (USE_MOCK_API) {
    await delay();
    const trip = getTripsSource().find((trip) => trip.id === Number(id)) || null;
    return localizeTrip(trip, lang);
  }
  return await apiClient.get(ENDPOINTS.TRIPS.DETAIL(id));
}

export async function getTripsByIds(ids, lang = "ar") {
  if (USE_MOCK_API) {
    await delay();
    return getTripsSource().filter((trip) => ids.includes(trip.id)).map((trip) => localizeTrip(trip, lang));
  }
  const all = await apiClient.get(ENDPOINTS.TRIPS.LIST);
  return all.filter((trip) => ids.includes(trip.id));
}

export async function searchTrips(query, lang = "ar") {
  if (USE_MOCK_API) {
    await delay(400);
    const q = query.toLowerCase();
    return getTripsSource()
      .filter(
        (trip) =>
          trip.title.toLowerCase().includes(q) ||
          trip.destination.toLowerCase().includes(q) ||
          trip.description.toLowerCase().includes(q)
      )
      .map((trip) => localizeTrip(trip, lang));
  }
  return await apiClient.get(ENDPOINTS.TRIPS.SEARCH(query));
}
