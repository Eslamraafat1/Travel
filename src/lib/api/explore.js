// ===================================================
// EXPLORE / GUIDE API — Foursquare Places API v3
// Docs: https://docs.foursquare.com/developer/reference/place-search
// Free tier: 1000 calls/day. Set NEXT_PUBLIC_FSQ_KEY in .env.local
// ===================================================

const FSQ_BASE = "https://api.foursquare.com/v3";
const FSQ_KEY = process.env.NEXT_PUBLIC_FSQ_KEY || "";

// Egypt bounding box (ne/sw)
const EGYPT_CENTER = "30.0444,31.2357"; // Cairo as default

// Foursquare category IDs
const FSQ_CATEGORIES = {
  restaurants: "13065",   // Restaurant (parent)
  hotels:      "19014",   // Hotel
  trips:       "18000",   // Landmarks & Outdoors (tours start points)
  activities:  "18026",   // Recreation
  transport:   "19040",   // Travel & Transport
  cafes:       "13032",   // Café / Coffee Shop
  essentials:  "17000",   // Services (pharmacies, banks, hospitals combined)
  malls:       "17106",   // Shopping Mall
  parks:       "16032",   // Park
};

// Unsplash fallback images per category
const FALLBACK_IMAGES = {
  restaurants: [
    "https://images.unsplash.com/photo-1568039244-049e2b19a938?w=800&q=80", // Egyptian food (koshari)
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80", // Middle eastern restaurant
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", // Food platter
    "https://images.unsplash.com/photo-1473090826109-59758212e3ca?w=800&q=80", // Seafood (Alexandria)
  ],
  hotels: [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", // Red Sea resort
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", // Luxury hotel
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", // Pool resort
    "https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?w=800&q=80", // Hotel room
  ],
  trips: [
    "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80", // Giza pyramids
    "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80", // Luxor temple
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80", // Nile felucca
  ],
  activities: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", // Red Sea diving
    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80", // Desert safari
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", // Camel ride
  ],
  transport: [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80", // Cairo street
    "https://images.unsplash.com/photo-1580214470942-89241b7dd7f4?w=800&q=80", // Egyptian streets
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80", // Road trip
  ],
  cafes: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", // Coffee shop
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80", // Cafe interior
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", // Coffee pour over
  ],
  essentials: [
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80", // Pharmacy
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80", // Medical
    "https://images.unsplash.com/photo-1607083206968-13617e6e07a3?w=800&q=80", // Supermarket
  ],
  malls: [
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80", // Mall interior
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80", // Shopping bags
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", // Fashion store
  ],
  parks: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", // Green park
    "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80", // Garden
    "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80", // Nature
  ],
};

// ---- Helpers ----
function pickFallback(category, fsqId) {
  const imgs = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.restaurants;
  const hash = fsqId
    ? fsqId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    : 0;
  return imgs[hash % imgs.length];
}

function buildPhotoUrl(prefix, suffix, size = "800x600") {
  if (!prefix || !suffix) return null;
  return `${prefix}${size}${suffix}`;
}

function normalizePlace(raw, category) {
  const photo =
    raw.photos && raw.photos.length > 0
      ? buildPhotoUrl(raw.photos[0].prefix, raw.photos[0].suffix)
      : pickFallback(category, raw.fsq_id);

  const allPhotos =
    raw.photos && raw.photos.length > 0
      ? raw.photos.map((p) => buildPhotoUrl(p.prefix, p.suffix)).filter(Boolean)
      : [photo];

  return {
    id: raw.fsq_id,
    name: raw.name,
    category,
    address: raw.location?.formatted_address || raw.location?.address || "",
    city: raw.location?.locality || raw.location?.region || "Egypt",
    lat: raw.geocodes?.main?.latitude,
    lng: raw.geocodes?.main?.longitude,
    rating: raw.rating ? (raw.rating / 2).toFixed(1) : null,
    ratingCount: raw.stats?.total_ratings || null,
    price: raw.price || null, // 1-4 scale
    hours: raw.hours?.display || null,
    open: raw.hours?.open_now ?? null,
    photo,
    photos: allPhotos,
    phone: raw.tel || null,
    website: raw.website || null,
    description: raw.description || null,
    categories: raw.categories?.map((c) => c.name) || [],
    distance: raw.distance || null,
    verified: raw.verified || false,
    chains: raw.chains?.map((c) => c.name) || [],
    // Extra fields for detail page
    tastes: raw.tastes || [],
    features: raw.features || [],
    popularity: raw.popularity || null,
  };
}

// ---- Core fetch ----
async function fsqFetch(path, params = {}) {
  if (!FSQ_KEY) {
    console.warn("[explore] NEXT_PUBLIC_FSQ_KEY not set — using mock data");
    return null;
  }
  const url = new URL(`${FSQ_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: FSQ_KEY,
      Accept: "application/json",
    },
    next: { revalidate: 3600 }, // cache 1h on Next.js 15+
  });
  if (!res.ok) {
    console.error("[explore] FSQ error", res.status, await res.text());
    return null;
  }
  return res.json();
}

// ---- Search places by category ----
export async function searchPlaces({ category, query = "", near = "Cairo, Egypt", limit = 20, cursor }) {
  const catId = FSQ_CATEGORIES[category];
  const data = await fsqFetch("/places/search", {
    categories: catId,
    query: query || undefined,
    near,
    limit,
    cursor,
    fields: "fsq_id,name,location,geocodes,rating,stats,price,hours,photos,tel,website,description,categories,distance,verified,chains,tastes,features,popularity",
    sort: "RELEVANCE",
  });

  if (!data) return getMockPlaces(category, limit);

  return {
    places: (data.results || []).map((p) => normalizePlace(p, category)),
    cursor: data.context?.geo_bounds?.circle?.center
      ? null
      : data.cursor || null,
  };
}

// ---- Get single place detail ----
export async function getPlaceDetail(fsqId, category) {
  const data = await fsqFetch(`/places/${fsqId}`, {
    fields: "fsq_id,name,location,geocodes,rating,stats,price,hours,photos,tel,website,description,categories,distance,verified,chains,tastes,features,popularity,hours_popular,attributes",
  });

  if (!data) return getMockPlaceDetail(fsqId, category);
  return normalizePlace(data, category);
}

// ---- Get tips/reviews for a place ----
export async function getPlaceTips(fsqId, limit = 6) {
  const data = await fsqFetch(`/places/${fsqId}/tips`, { limit, sort: "POPULAR" });
  if (!data) return getMockTips();
  return (data || []).map((tip) => ({
    id: tip.id,
    text: tip.text,
    created: tip.created_at,
    author: {
      name: tip.photo ? "Visitor" : "Anonymous",
      avatar: tip.photo
        ? buildPhotoUrl(tip.photo.prefix, tip.photo.suffix, "60x60")
        : `https://i.pravatar.cc/60?u=${tip.id}`,
    },
    agree: tip.agree_count || 0,
    disagree: tip.disagree_count || 0,
  }));
}

// ---- Get related/similar places ----
export async function getRelatedPlaces(category, near = "Cairo, Egypt", limit = 4) {
  const result = await searchPlaces({ category, near, limit });
  return Array.isArray(result) ? result : result.places || [];
}

// ============================================================
// MOCK DATA — used when FSQ_KEY is not set
// ============================================================
const MOCK_NAMES = {
  restaurants: [
    "Koshary El Tahrir",
    "Abou Tarek Koshary",
    "Aswan House",
    "El Hussein Restaurant",
    "Cairo Grill",
    "El Fishawy Restaurant",
    "Aish w Malh",
    "Saboro"
  ],
  hotels: [
    "Nile Palace Hotel",
    "Marriott Mena House",
    "Semiramis Hotel",
    "Pyramids Hotel",
    "Cairo Seasons",
    "Four Seasons Cairo",
    "Ramses Hilton",
    "Conrad Cairo"
  ],
  trips: [
    "Pyramids Tour",
    "Aswan & Nubia Trip",
    "Alexandria Tour",
    "Hurghada Sea Trip",
    "Desert Safari"
  ],
  activities: [
    "Diving",
    "Mount Moses Hike",
    "Horse Riding",
    "Felucca Ride",
    "Hot Air Balloon"
  ],
  transport: [
    "Careem Egypt",
    "Uber Cairo",
    "Cairo Metro",
    "Nile Taxi",
    "GO Bus Company"
  ],
  cafes: [
    "El Fishawy Cafe",
    "Cafe Riche",
    "Cilantro Café",
    "Beano's Café",
    "Nile Cafe"
  ],
  essentials: [
    "El Ezaby Pharmacy",
    "Banque Misr",
    "Kasr Al Ainy Hospital",
    "Carrefour Supermarket",
    "National Bank of Egypt"
  ],
  malls: [
    "Citystars",
    "Mall of Arabia",
    "Mall of Egypt",
    "Cairo Festival City",
    "City Centre Almaza"
  ],
  parks: [
    "Al-Azhar Park",
    "Giza Zoo",
    "Orman Garden",
    "International Park",
    "Fustat Park"
  ],
};

const MOCK_ADDRESSES = [
  "Tahrir Square, Cairo",
  "Zamalek, Cairo",
  "Mohandeseen, Giza",
  "Alexandria, Egypt",
  "Sharm El-Sheikh, Sinai",
  "New Cairo, Cairo",
  "Nasr City, Cairo",
  "Giza, Giza",
];

const MOCK_AMENITIES = {
  hotels: [
    "Free WiFi", "Swimming Pool", "Spa", "Fitness Center", 
    "Restaurant", "Room Service", "Parking", "24/7 Front Desk",
    "Business Center", "Concierge", "Airport Shuttle", "Bar"
  ],
  restaurants: [
    "Outdoor Seating", "Delivery", "Takeout", "Reservations",
    "WiFi", "Parking", "TV", "Wheelchair Accessible",
    "Full Bar", "Accepts Credit Cards", "Good for Kids", "Live Music"
  ]
};

const MOCK_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"
];

const MOCK_REVIEWS = [
  {
    id: "rev1",
    author: "Ahmed Mohamed",
    avatar: "https://i.pravatar.cc/60?img=1",
    rating: 5,
    text: "Absolutely amazing experience! The service was exceptional and the atmosphere was perfect. Highly recommend to anyone visiting.",
    date: "2024-01-15",
    helpful: 24
  },
  {
    id: "rev2",
    author: "Sarah Ali",
    avatar: "https://i.pravatar.cc/60?img=2",
    rating: 4,
    text: "Great place with wonderful staff. The food was delicious and the prices were reasonable. Would definitely come back.",
    date: "2024-01-10",
    helpful: 18
  },
  {
    id: "rev3",
    author: "Omar Hassan",
    avatar: "https://i.pravatar.cc/60?img=3",
    rating: 5,
    text: "One of the best experiences I've had in Egypt. The attention to detail and customer service is outstanding.",
    date: "2024-01-05",
    helpful: 31
  },
  {
    id: "rev4",
    author: "Noura Ibrahim",
    avatar: "https://i.pravatar.cc/60?img=4",
    rating: 4,
    text: "Beautiful location and excellent service. The only minor issue was the wait time, but everything else was perfect.",
    date: "2024-01-02",
    helpful: 15
  },
  {
    id: "rev5",
    author: "Karim Reda",
    avatar: "https://i.pravatar.cc/60?img=5",
    rating: 5,
    text: "Exceeded all my expectations! The quality of service and the overall experience was simply outstanding.",
    date: "2023-12-28",
    helpful: 22
  }
];

function getMockPlace(category, index) {
  const names = MOCK_NAMES[category] || MOCK_NAMES.restaurants;
  const name = names[index % names.length];
  const address = MOCK_ADDRESSES[index % MOCK_ADDRESSES.length];
  const id = `mock-${category}-${index}`;
  const img = pickFallback(category, id);
  const amenities = MOCK_AMENITIES[category] || MOCK_AMENITIES.restaurants;
  
  // Shuffle and pick random amenities
  const shuffledAmenities = [...amenities].sort(() => Math.random() - 0.5);
  const selectedAmenities = shuffledAmenities.slice(0, Math.floor(Math.random() * 4) + 4);
  
  // Shuffle and pick random gallery images
  const shuffledGallery = [...MOCK_GALLERY_IMAGES].sort(() => Math.random() - 0.5);
  const selectedGallery = shuffledGallery.slice(0, Math.floor(Math.random() * 3) + 4);
  
  // Shuffle and pick random reviews
  const shuffledReviews = [...MOCK_REVIEWS].sort(() => Math.random() - 0.5);
  const selectedReviews = shuffledReviews.slice(0, Math.floor(Math.random() * 2) + 3);
  
  return {
    id,
    name: name,
    category,
    address: address,
    city: "Cairo",
    lat: 30.0444 + (Math.random() - 0.5) * 0.2,
    lng: 31.2357 + (Math.random() - 0.5) * 0.2,
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    ratingCount: Math.floor(50 + Math.random() * 1000),
    price: Math.ceil(Math.random() * 4),
    hours: "9:00 AM - 11:00 PM",
    open: Math.random() > 0.3,
    photo: img,
    photos: [img, ...selectedGallery],
    gallery: selectedGallery,
    phone: `+20 10${Math.floor(10000000 + Math.random() * 89999999)}`,
    website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
    description: `One of the finest places in this category in Egypt — offering a unique and unforgettable experience. Known for exceptional service, beautiful ambiance, and attention to detail that keeps visitors coming back time and again.`,
    categories: [category],
    distance: Math.floor(100 + Math.random() * 5000),
    verified: Math.random() > 0.5,
    chains: [],
    tastes: ["Distinctive", "Family-friendly", "Romantic", "Luxury", "Authentic"].slice(0, Math.ceil(Math.random() * 3)),
    features: selectedAmenities,
    amenities: selectedAmenities,
    popularity: Math.random(),
    reviews: selectedReviews,
    cuisine: category === "restaurants" ? ["Egyptian", "Middle Eastern", "International"].slice(0, Math.ceil(Math.random() * 2) + 1) : null,
    roomTypes: category === "hotels" ? ["Standard Room", "Deluxe Suite", "Presidential Suite"].slice(0, Math.ceil(Math.random() * 2) + 1) : null,
  };
}

export function getMockPlaces(category, limit = 20) {
  const places = Array.from({ length: limit }, (_, i) => getMockPlace(category, i));
  return { places, cursor: null };
}

export function getMockPlaceDetail(id, category) {
  const index = parseInt((id || "").replace(/\D/g, "") || "0", 10) % 20;
  const place = getMockPlace(category, index);
  
  // Add additional detail-specific data
  return {
    ...place,
    detailedDescription: `Experience the epitome of ${category === 'hotels' ? 'luxury hospitality' : 'culinary excellence'} at ${place.nameEn}. Our establishment combines traditional Egyptian charm with modern amenities to create an unforgettable experience. Every detail has been carefully curated to ensure your comfort and satisfaction.`,
    establishedYear: Math.floor(Math.random() * 30) + 1990,
    capacity: category === 'hotels' ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 100) + 30,
    signatureDishes: category === 'restaurants' ? ["Koshary", "Mahshi", "Fattah", "Umm Ali"].slice(0, Math.floor(Math.random() * 3) + 2) : null,
    roomCount: category === 'hotels' ? Math.floor(Math.random() * 150) + 50 : null,
    floorCount: category === 'hotels' ? Math.floor(Math.random() * 20) + 5 : null,
    awards: Math.random() > 0.5 ? ["Best Service 2023", "Excellence Award", "Top Rated"].slice(0, Math.floor(Math.random() * 2) + 1) : [],
  };
}

export function getMockTips() {
  const tips = [
    { text: "Amazing place, truly worth visiting! Excellent service and very reasonable prices.", author: "Ahmed Mahmoud" },
    { text: "Tried many similar places and this is by far the best. Highly recommend to everyone.", author: "Sarah Ali" },
    { text: "An exceptional experience — I will definitely be coming back again.", author: "Mohamed Khaled" },
    { text: "The place is clean, and the staff are respectful and very professional.", author: "Noura Ibrahim" },
    { text: "High quality and very fair pricing for the service provided.", author: "Karim Reda" },
  ];
  return tips.map((t, i) => ({
    id: `tip-${i}`,
    text: t.text,
    created: new Date(Date.now() - i * 864000000).toISOString(),
    author: { name: t.author, avatar: `https://i.pravatar.cc/60?img=${i + 10}` },
    agree: Math.floor(5 + Math.random() * 50),
    disagree: Math.floor(Math.random() * 5),
  }));
}
