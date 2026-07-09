// ===================================================
// API ENDPOINTS - All endpoint paths in one place
// Replace with your actual backend routes
// ===================================================

export const ENDPOINTS = {
  // Packages
  PACKAGES: {
    LIST: "/packages",
    DETAIL: (id) => `/packages/${id}`,
    FEATURED: "/packages/featured",
    BY_CATEGORY: (category) => `/packages?category=${category}`,
  },

  // Trips
  TRIPS: {
    LIST: "/trips",
    DETAIL: (id) => `/trips/${id}`,
    POPULAR: "/trips/popular",
    BY_DESTINATION: (dest) => `/trips?destination=${dest}`,
    SEARCH: (query) => `/trips/search?q=${query}`,
  },

  // Testimonials
  TESTIMONIALS: {
    LIST: "/testimonials",
  },

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: "/newsletter/subscribe",
  },

  // Stats
  STATS: {
    HOME: "/stats/home",
  },
};
