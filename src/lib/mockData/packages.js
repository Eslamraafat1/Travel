// Catalogue mirrored from the client's live site (https://touregyptclub.com,
// public API /api/v1/packages and /api/v1/packages/{slug}), captured 2026-11-04.
// Titles, prices, durations, itineraries and inclusions are copied as published.
// Images are the live site's own photos, stored locally under /public/images/egypt.
// Not copied on purpose: star ratings and review counts (no verifiable review
// source) and template placeholders the live data still contains.
// The live site publishes this content in English only, so Arabic falls back to
// English (see localizeContent.js: add titleAr-style fields when it exists).

export const mockPackages = [
  {
    "id": 1,
    "slug": "hurghada-red-sea-luxury",
    "title": "Hurghada & Red Sea Luxury",
    "description": "Five-star luxury on the Red Sea - crystal waters, private beaches and world-class resorts in Hurghada.",
    "overview": "Escape to the turquoise waters of the Red Sea in this all-inclusive luxury package. Relax on pristine beaches, dive among vibrant coral reefs, and enjoy five-star hospitality with daily boat excursions to the most stunning islands.",
    "destination": "Hurghada, Egypt",
    "duration": "7 Days / 6 Nights",
    "durationDays": 7,
    "price": 12500,
    "currency": "EGP",
    "originalPrice": 15000,
    "badge": "Best Seller",
    "image": "/images/egypt/egypt-redsea.webp",
    "gallery": [
      "/images/egypt/egypt-redsea.webp",
      "/images/egypt/egypt-hotel2.webp",
      "/images/egypt/egypt-fish2.webp",
      "/images/egypt/egypt-nile-sunset.webp",
      "/images/egypt/red-sea-coast.webp",
      "/images/egypt/egypt-desert-resort.webp"
    ],
    "category": "beach-holidays",
    "maxGroupSize": 12,
    "featured": true,
    "highlights": [
      "Private beach access on the Red Sea",
      "Giftun Island cruise & snorkeling",
      "Certified diving excursions",
      "5-star all-inclusive resort",
      "Desert safari with Bedouin dinner",
      "El Gouna lagoon day trip"
    ],
    "guide": "Certified Red Sea guide",
    "meetingPoint": "Hurghada International Airport - Arrival Hall",
    "requirements": [
      "Valid passport (6+ months validity)",
      "Swimwear and sun protection",
      "Travel insurance recommended",
      "Moderate fitness for diving/snorkeling"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival & Private Beach",
        "desc": "Check into a 5-star resort on the Red Sea, relax on the private beach and enjoy a welcome dinner by the shore."
      },
      {
        "day": 2,
        "title": "Giftun Island Cruise",
        "desc": "Sail to Giftun Island, snorkel among colorful coral reefs and swim in the crystal-clear lagoons."
      },
      {
        "day": 3,
        "title": "Desert Safari & Bedouin Camp",
        "desc": "Ride a quad bike across the desert and enjoy dinner with a traditional Bedouin show under the stars."
      },
      {
        "day": 4,
        "title": "Diving in the Red Sea",
        "desc": "Full-day diving excursion exploring world-famous reef walls and marine life with certified instructors."
      },
      {
        "day": 5,
        "title": "El Gouna Day Trip",
        "desc": "Stroll through the canals and marinas of El Gouna, a charming seaside town built around lagoons."
      },
      {
        "day": 6,
        "title": "Spa & Resort Leisure",
        "desc": "Enjoy a full day of spa treatments, pools and water sports at your luxury resort."
      },
      {
        "day": 7,
        "title": "Departure",
        "desc": "Transfer to Hurghada International Airport for your flight home."
      }
    ],
    "includedTrips": [
      3,
      5,
      6
    ],
    "includes": [
      "Round-trip flights",
      "5-star hotel",
      "Daily breakfast",
      "Boat tours"
    ],
    "excluded": [
      "Personal expenses",
      "Entry visa"
    ],
    "faqs": []
  },
  {
    "id": 2,
    "slug": "cairo-giza-pyramids-package",
    "title": "Cairo & Giza Pyramids Package",
    "description": "Walk in the shadow of the Great Pyramids - ancient wonders, the Sphinx, and the treasures of Cairo.",
    "overview": "A once-in-a-lifetime journey to the heart of ancient Egypt. Stand before the last surviving Wonder of the Ancient World, explore the Egyptian Museum's royal treasures, and experience Cairo's vibrant culture from the bazaars to the Nile.",
    "destination": "Giza & Cairo, Egypt",
    "duration": "5 Days / 4 Nights",
    "durationDays": 5,
    "price": 9800,
    "currency": "EGP",
    "originalPrice": 12000,
    "badge": "Limited Offer",
    "image": "/images/egypt/egypt-pyramids.webp",
    "gallery": [
      "/images/egypt/egypt-pyramids.webp",
      "/images/egypt/egypt-camel-pyramid.webp",
      "/images/egypt/egypt-cairo.webp",
      "/images/egypt/egypt-khan.webp",
      "/images/egypt/egypt-market.webp",
      "/images/egypt/egypt-nile.webp"
    ],
    "category": "luxury-tours",
    "maxGroupSize": 15,
    "featured": true,
    "highlights": [
      "Great Pyramid & Solar Boat Museum",
      "Camel ride on the Giza Plateau",
      "King Tut treasures at the Egyptian Museum",
      "Khan el-Khalili bazaar shopping",
      "Coptic Cairo & Hanging Church",
      "Nile dinner cruise with show"
    ],
    "guide": "Certified Egyptologist guide",
    "meetingPoint": "Cairo International Airport - Terminal 3",
    "requirements": [
      "Valid passport (6+ months validity)",
      "Comfortable walking shoes",
      "Moderate fitness for sightseeing",
      "Camera for ancient monuments"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival & Giza Plateau",
        "desc": "Arrive in Cairo and transfer to your hotel with views of the Great Pyramids."
      },
      {
        "day": 2,
        "title": "Pyramids & Sphinx",
        "desc": "Explore the Great Pyramid, the Solar Boat Museum and the enigmatic Sphinx on a camel ride."
      },
      {
        "day": 3,
        "title": "Egyptian Museum & Citadel",
        "desc": "Discover King Tut's golden treasures, then visit the Saladin Citadel and Mohamed Ali Mosque."
      },
      {
        "day": 4,
        "title": "Coptic Cairo & Khan el-Khalili",
        "desc": "Walk the Hanging Church and historic alleyways, then shop at the legendary Khan el-Khalili bazaar."
      },
      {
        "day": 5,
        "title": "Nile Dinner Cruise & Departure",
        "desc": "Sail the Nile at sunset with a live show before your evening flight home."
      }
    ],
    "includedTrips": [
      3,
      4,
      5,
      6
    ],
    "includes": [
      "Round-trip flights",
      "4-star hotel",
      "Scenic train tickets"
    ],
    "excluded": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tipping"
    ],
    "faqs": []
  }
];

// Package categories as used by the live API. `label` is Arabic, `labelEn` English.
export const mockCategories = [
  { id: "all", label: "الكل", labelEn: "All" },
  { id: "beach-holidays", label: "عطلات شاطئية", labelEn: "Beach Holidays" },
  { id: "luxury-tours", label: "جولات فاخرة", labelEn: "Luxury Tours" },
];
