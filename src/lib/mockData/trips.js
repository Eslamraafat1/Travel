// Catalogue mirrored from the client's live site (https://touregyptclub.com,
// public API /api/v1/trips and /api/v1/trips/{slug}), captured 2026-11-04.
// Titles, prices, durations, itineraries and inclusions are copied as published.
// Images are the live site's own photos, stored locally under /public/images/egypt.
// Not copied on purpose: star ratings and review counts (no verifiable review
// source) and template placeholders the live data still contains.
// The live site publishes this content in English only, so Arabic falls back to
// English (see localizeContent.js: add titleAr-style fields when it exists).

export const mockTrips = [
  {
    "id": 7,
    "slug": "vip-tour-inside-giza-pyramids",
    "title": "VIP tour inside Giza Pyramids",
    "description": "Experience an exclusive VIP journey exploring the interiors and royal monuments of the Giza Plateau, the Great Sphinx, and Valley Temple.",
    "overview": "Your day begins at the Giza Plateau, home to the three main royal pyramids and the Great Sphinx. Rather than simply viewing these monuments, your visit explores how they formed part of a wider royal funerary landscape. This exploration goes beyond viewing the monuments from the outside, allowing you to discover their interiors as well. Through what you hear and see, you will be transported into a world of imagination, feeling as though you are living in the time of the pharaohs rather than in your own world.",
    "destination": "Giza Plateau, Egypt",
    "duration": "3–4 Hours",
    "durationDays": 1,
    "price": 3800,
    "currency": "EGP",
    "originalPrice": 4500,
    "badge": "VIP Exclusive",
    "image": "/images/egypt/egypt-pyramids.webp",
    "gallery": [
      "/images/egypt/egypt-pyramids.webp",
      "/images/egypt/egypt-camel-pyramid.webp",
      "/images/egypt/egypt-cairo.webp"
    ],
    "category": null,
    "maxGroupSize": 10,
    "featured": true,
    "highlights": [
      "Great Pyramid of Khufu: Interior visit to the Grand Gallery and King's Chamber.",
      "Pyramid of Khafre: Exterior visit.",
      "Pyramid of Menkaure: Exterior visit.",
      "Great Sphinx: Exterior visit only.",
      "Valley Temple of Khafre.",
      "Panoramic viewpoint overlooking the Giza pyramids."
    ],
    "guide": "Professional Egyptologist Guide",
    "meetingPoint": "Hotel Pickup & Drop-off (Private Vehicle)",
    "requirements": [
      "Valid passport or official ID",
      "Comfortable walking shoes suitable for climbing interior stone ramps",
      "Moderate physical fitness (crouching & climbing required inside the Great Pyramid)",
      "Sun protection (hat, sunglasses, sunscreen)"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "The Giza Pyramids from the Outside",
        "desc": "Located on the Giza Plateau near Cairo, the three main pyramids of Khufu, Khafre, and Menkaure were built around 4,500 years ago during Egypt’s Old Kingdom. More than royal tombs, they reflect the ancient Egyptians’ architectural skills, religious beliefs, and understanding of the afterlife."
      },
      {
        "day": 2,
        "title": "The Great Pyramid of Khufu – Interior Visit",
        "desc": "Enter the Great Pyramid, built for King Khufu during Egypt's Fourth Dynasty, around 2589–2566 BC. Follow the standard visitor route to explore the Grand Gallery and the King's Chamber.\n\n• Look Closer: The Grand Gallery features a high, corbelled ceiling formed by successive layers of stone projecting inward.\n\n• Medical Advice: If you have heart, respiratory, or bone conditions, entering the pyramid is not recommended due to the narrow passages, steep climbing, and crouching required. Your guide will provide you with all the necessary information.\n\n• Note: Access to additional areas inside the Great Pyramid may be possible through a separate Private Access experience, subject to prior authorization from the Egyptian authorities."
      },
      {
        "day": 3,
        "title": "The Pyramid of Khafre – Exterior Visit",
        "desc": "See the second-largest pyramid at Giza, built for King Khafre. Its elevated position and surviving casing stones near the summit contribute to its distinctive appearance.\n\n• Look Closer: The pyramid forms part of a funerary complex associated with the Great Sphinx and the Valley Temple."
      },
      {
        "day": 4,
        "title": "The Pyramid of Menkaure – Exterior Visit",
        "desc": "Discover the smallest of Giza's three main pyramids, built for King Menkaure during the Fourth Dynasty.\n\n• Look Closer: Remains of its granite casing can still be seen near the lower sections of the monument."
      },
      {
        "day": 5,
        "title": "The Great Sphinx – Exterior Visit",
        "desc": "View the Great Sphinx, a monumental limestone sculpture with a human head and a lion's body, commonly associated with King Khafre.\n\n• Note: A separate Private Access experience may be available for the Great Sphinx, subject to prior authorization and official approval. This is not included in the standard exterior visit."
      },
      {
        "day": 6,
        "title": "The Valley Temple of Khafre",
        "desc": "Discover the Valley Temple, an important part of Khafre's funerary complex, constructed using massive limestone blocks and granite elements.\n\n• Look Closer: The temple was connected to the pyramid by a causeway and played a role in royal funerary rituals."
      },
      {
        "day": 7,
        "title": "The Panoramic Viewpoint",
        "desc": "Stop at a panoramic viewpoint to admire the three main pyramids together against the surrounding desert landscape.\n\n• Look Closer: The different sizes and positions of the pyramids reflect the development of royal pyramid construction across successive reigns."
      }
    ],
    "type": "cultural",
    "departureDate": null,
    "availableSeats": 8,
    "totalSeats": 10,
    "difficulty": "Easy",
    "included": [
      "Hotel pickup and drop-off in a private, air-conditioned vehicle. (Transportation within the Giza Pyramids Plateau is provided by the official shuttle bus, in accordance with site regulations.)",
      "A professional Egyptologist guide, available in different languages upon request.",
      "Admission to the Giza Plateau.",
      "Standard admission ticket to the interior of the Great Pyramid of Khufu, including the Grand Gallery and the King's Chamber via the regular visitor route.",
      "Exterior visits to the Pyramids of Khafre and Menkaure.",
      "An exterior visit to the Great Sphinx.",
      "A visit to the Valley Temple of Khafre.",
      "A stop at the panoramic viewpoint overlooking the Giza pyramids.",
      "Lunch at a local restaurant in Giza.",
      "Required tourism permits for the tour.",
      "One bottle of water per person."
    ],
    "excluded": [
      "Tips and gratuities for the guide and driver.",
      "Any additional services not mentioned in the inclusions.",
      "Any additional sites or areas inside the Giza Plateau that require separate entrance tickets."
    ],
    "accessNote": "The standard visit to the Great Pyramid follows the regular visitor route and includes only the areas specified in the itinerary. Private Access experiences are separate arrangements that require prior authorization and are not included in this tour.",
    "upgrades": [
      {
        "title": "Special Access to the Great Pyramid",
        "description": "Arrange a private visit to the Great Pyramid of Khufu outside regular opening hours, subject to special Ministry authorization. This exclusive experience may include access to additional interior areas, such as the Subterranean Chamber and the Queen’s Chamber, depending on the permissions granted."
      },
      {
        "title": "Special Access to the Great Sphinx",
        "description": "Enjoy a private visit inside the Great Sphinx enclosure with special authorization from the relevant authorities. This experience offers a closer view of the Sphinx from within its enclosure, beyond the regular visit from outside."
      },
      {
        "title": "Special Access to the Osiris Shaft",
        "description": "Explore the Osiris Shaft, an underground archaeological site associated with the Giza Plateau, through a specially arranged visit. Access to this area requires authorization from the relevant authorities and may need to take place outside regular opening hours. This experience offers an opportunity to discover a lesser-known part of the Giza archaeological landscape."
      },
      {
        "title": "Private Golf Cart",
        "description": "Upgrade your transportation inside the Giza Plateau with a private golf cart for a specified number of hours. Instead of relying on the shared shuttle bus, you can move more conveniently between different areas of the site. Let us know if you would like to arrange this upgrade."
      },
      {
        "title": "Luxury Vehicle Upgrade",
        "description": "A luxury vehicle can be arranged for your transfers, from pickup to drop-off, including models such as Mercedes-Benz, Rolls-Royce, or another vehicle upon special request. This service is subject to availability and is offered at an additional cost."
      }
    ],
    "optionalExperiences": [
      {
        "title": "Camel or Horse Ride",
        "description": "Enjoy a ride around designated areas of the Giza Plateau and take in the desert scenery surrounding the pyramids."
      },
      {
        "title": "Workers’ Tombs – Semi-VIP Tour",
        "description": "Discover the Workers’ Tombs at the Giza Plateau, where you can explore five tombs and learn more about the lives, burial practices, and artistic traditions of the people who helped build the pyramids. This experience offers a different perspective on the history of the Giza necropolis beyond the royal monuments."
      },
      {
        "title": "Horse Carriage Ride",
        "description": "Enjoy a horse-drawn carriage ride around the Giza area and take in the surrounding scenery at a relaxed pace. It’s an optional experience for visitors who would like to add a traditional ride to their day at the pyramids."
      }
    ],
    "comboTours": [
      {
        "title": "Grand Egyptian Museum (GEM)",
        "description": "You can combine your visit to the Giza Pyramids with the Grand Egyptian Museum, as both are located in the Giza area. Visiting them on the same day helps you save travel time and enjoy a full day exploring ancient Egyptian history."
      },
      {
        "title": "Saqqara",
        "description": "You can combine the Giza Pyramids with a visit to Saqqara to discover the Step Pyramid of Djoser and explore another important site in the history of pyramid construction. This is a great way to see different stages of ancient Egyptian architecture in one day."
      },
      {
        "title": "Dahshur",
        "description": "Dahshur can be added to your pyramid tour along with Saqqara, as both sites are located south of Giza. This combination allows you to explore the Bent Pyramid and the Red Pyramid while learning how pyramid design developed over time."
      }
    ],
    "cancellationPolicy": "Cancellation Procedure\nAll cancellation requests must be submitted in writing by email or fax. Cancellation charges depend on how far in advance the cancellation is received before the scheduled tour date.\n\nCancellation Fees:\n• 40–30 days before the tour: 25% of the total tour price will be charged.\n• 29–15 days before the tour: 50% of the total tour price will be charged.\n• 14–1 day before the tour: 100% of the tour deposit will be charged.\n• No-show: No refund will be provided.",
    "faqs": [
      {
        "q": "What can I see inside the Giza Pyramids complex?",
        "a": "You can explore the three main pyramids of Khufu, Khafre, and Menkaure, see the Great Sphinx from outside its enclosure, visit the Valley Temple, and stop at the panoramic viewpoint to see all three pyramids together."
      },
      {
        "q": "Can I go inside the pyramids?",
        "a": "Yes, you can enter the Great Pyramid of Khufu with an additional ticket. The regular interior visit includes the King’s Chamber and the Grand Gallery.\n\nThe Subterranean Chamber and the Queen’s Chamber are not included in the standard visit. Access to these areas requires special permission from the Ministry of Tourism and Antiquities and must be arranged as a private visit outside regular opening hours.\n\nYou can also enter the Pyramid of Khafre with an additional ticket, while the Pyramid of Menkaure is currently closed to visitors."
      },
      {
        "q": "Can I visit the Sphinx from inside its enclosure?",
        "a": "Yes, but access inside the Sphinx enclosure requires special permission from the Ministry of Tourism and Antiquities. This private visit lasts approximately one hour and offers a closer view of the Sphinx from within its enclosure.\n\nThe regular visit allows you to see the Sphinx from outside the enclosure. Private access is a separate service with a significantly higher cost."
      },
      {
        "q": "How much time do I need to visit the Giza Pyramids?",
        "a": "A typical visit takes around 3 to 4 hours, depending on your interests and how much time you wish to spend exploring the site.\n\nYou should also allow extra time for transportation between your hotel and the Giza Plateau. If your hotel is in the Giza area, you may only need to leave around 30 minutes before the tour, depending on traffic and the exact location.\n\nEntering the Great Pyramid itself usually takes around 20 to 30 minutes."
      },
      {
        "q": "What does a VIP tour of the Giza Pyramids include?",
        "a": "A VIP tour offers a more private and personalized experience, with a private vehicle and a dedicated guide for you and your group, rather than shared transportation or a shared tour.\n\nPlease note that VIP service does not automatically include access outside regular opening hours or entry to restricted areas. These require separate arrangements and special permission from the relevant authorities."
      }
    ]
  },
  {
    "id": 3,
    "slug": "sharm-el-sheikh-diving-adventure",
    "title": "Sharm El-Sheikh Diving Adventure",
    "description": "Enjoy the most beautiful coral reefs and diving in crystal clear Red Sea waters",
    "overview": "An unforgettable trip to the enchanting city of Sharm El-Sheikh. Enjoy diving in the most beautiful marine sites and explore rich underwater life.",
    "destination": "Sharm El-Sheikh, Egypt",
    "duration": "5 Days",
    "durationDays": 5,
    "price": 4500,
    "currency": "EGP",
    "image": "/images/egypt/egypt-redsea.webp",
    "gallery": [
      "/images/egypt/egypt-redsea.webp",
      "/images/egypt/red-sea-coast.webp",
      "/images/egypt/egypt-fish2.webp",
      "/images/egypt/egypt-nile-sunset.webp"
    ],
    "category": "beach-holidays",
    "maxGroupSize": 20,
    "featured": true,
    "highlights": [],
    "guide": "Ahmed Mohamed",
    "meetingPoint": "Sharm El-Sheikh International Airport - Arrival Hall",
    "requirements": [],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival & Beach Day",
        "desc": "Check into your resort on the Red Sea coast and enjoy the golden sands of Naama Bay."
      },
      {
        "day": 2,
        "title": "Ras Mohammed Diving",
        "desc": "Dive or snorkel at one of the world's most famous reefs - sharks, rays and coral walls."
      },
      {
        "day": 3,
        "title": "Desert Safari & Star Gazing",
        "desc": "Ride a quad bike through the Sinai dunes and camp under a sky full of stars."
      },
      {
        "day": 4,
        "title": "Old Market & Departure",
        "desc": "Shop for spices and souvenirs at the Sharm old market before heading home."
      }
    ],
    "type": "beach",
    "departureDate": "2026-09-15",
    "availableSeats": 8,
    "totalSeats": 20,
    "difficulty": null,
    "included": [
      "Snorkeling gear rental",
      "Seafood lunch",
      "Drinks all day"
    ],
    "excluded": [
      "Hotel transfers",
      "International flights",
      "Travel insurance",
      "Diving equipment rental (extra)",
      "Personal expenses",
      "Photography"
    ],
    "faqs": []
  },
  {
    "id": 4,
    "slug": "western-desert-safari",
    "title": "Western Desert Safari",
    "description": "An unforgettable adventure in the desert sands under starry skies",
    "overview": "Explore the vast Western Desert of Egypt. Visit stunning oases, ride camels across golden dunes, and sleep under a canopy of stars.",
    "destination": "Western Desert, Egypt",
    "duration": "3 Days",
    "durationDays": 3,
    "price": 2800,
    "currency": "EGP",
    "image": "/images/egypt/egypt-desert.webp",
    "gallery": [
      "/images/egypt/egypt-desert.webp"
    ],
    "category": "desert-safaris",
    "maxGroupSize": 12,
    "featured": true,
    "highlights": [
      "Camel riding",
      "Camp under the stars",
      "Oasis tour"
    ],
    "guide": "Sameer Abdullah",
    "meetingPoint": "Bahariya Oasis Safari Camp",
    "requirements": [
      "Valid passport",
      "Comfortable desert-appropriate clothing",
      "Sunscreen & hat",
      "Basic fitness for light trekking"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Cairo to Bahariya",
        "desc": "Drive west to the Bahariya Oasis and visit the Black Desert and crystal mountain."
      },
      {
        "day": 2,
        "title": "White Desert Camp",
        "desc": "Camp overnight among the chalk rock formations of the surreal White Desert."
      },
      {
        "day": 3,
        "title": "Siwa Oasis",
        "desc": "Continue to the legendary Siwa Oasis - salt lakes, olive groves and ancient temples."
      },
      {
        "day": 4,
        "title": "Return to Cairo",
        "desc": "Travel back to Cairo with stops at sand dunes and desert springs."
      }
    ],
    "type": "adventure",
    "departureDate": "2026-10-01",
    "availableSeats": 5,
    "totalSeats": 12,
    "difficulty": "Medium",
    "included": [
      "4x4 vehicles",
      "Equipped tents",
      "Breakfast & dinner"
    ],
    "excluded": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Sleeping bags"
    ],
    "accessNote": "Desert safari routes and camping permits are managed under official Egyptian environmental and border regulations. All required security clearances and safari permits are handled in advance.",
    "upgrades": [
      {
        "title": "Private Luxury 4x4 Land Cruiser",
        "description": "Upgrade to a private high-end 4x4 vehicle with customized departure times and dedicated support crew."
      },
      {
        "title": "VIP Glamping Tent Setup",
        "description": "Enjoy an upgraded Bedouin luxury tent with raised bedding, private lantern dinner, and telescope stargazing experience."
      },
      {
        "title": "Professional Stargazing Astrophotographer",
        "description": "A dedicated photographer equipped with specialized astronomy gear to capture your night under the Milky Way."
      }
    ],
    "optionalExperiences": [
      {
        "title": "Sunset Sandboarding on Great Dunes",
        "description": "Glide down golden sand dunes at golden hour with professional dune sandboards."
      },
      {
        "title": "Hot Spring Bathing in Bahariya",
        "description": "Relax in natural sulfur thermal springs renowned for rejuvenating minerals."
      },
      {
        "title": "Bedouin Music & Fireside Tea Ceremony",
        "description": "Traditional acoustic Bedouin music around an open fire with authentic herbal desert tea."
      }
    ],
    "comboTours": [
      {
        "title": "Siwa Oasis Extension (2 Extra Days)",
        "description": "Continue deeper to Siwa Oasis to explore Shali Fortress and Cleopatra Bath."
      },
      {
        "title": "Fayoum Oasis & Wadi El Hitan",
        "description": "Combine your desert expedition with the UNESCO World Heritage Valley of Whales."
      }
    ],
    "cancellationPolicy": "Cancellation Procedure\nAll cancellation requests must be submitted in writing.\n\nCancellation Fees:\n• 30+ days before departure: 10% administrative fee.\n• 29–15 days before departure: 50% charged.\n• 14–0 days before departure: 100% charged.\n• No-show: No refund.",
    "faqs": []
  },
  {
    "id": 5,
    "slug": "pyramids-cairo-explorer",
    "title": "Pyramids & Cairo Explorer",
    "description": "A comprehensive tour of ancient Egyptian civilization wonders",
    "overview": "Discover the wonders of ancient Egypt with visits to the Great Pyramids, the Sphinx, the Egyptian Museum, and the vibrant Khan El-Khalili bazaar.",
    "destination": "Giza & Cairo, Egypt",
    "duration": "4 Days",
    "durationDays": 4,
    "price": 3200,
    "currency": "EGP",
    "image": "/images/egypt/egypt-camel-pyramid.webp",
    "gallery": [
      "/images/egypt/egypt-camel-pyramid.webp",
      "/images/egypt/egypt-pyramids.webp",
      "/images/egypt/egypt-market.webp",
      "/images/egypt/egypt-streets.webp"
    ],
    "category": "historical-tours",
    "maxGroupSize": 25,
    "featured": true,
    "highlights": [
      "Pyramids & Sphinx",
      "Egyptian Museum",
      "Khan El-Khalili"
    ],
    "guide": "Mona Said",
    "meetingPoint": "Tahrir Square - In front of Egyptian Museum",
    "requirements": [
      "Valid passport",
      "Comfortable walking shoes",
      "Sunscreen & hat",
      "Camera"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Giza Pyramids & Sphinx",
        "desc": "Stand before the Great Pyramid of Giza, ride a camel and explore the Sphinx."
      },
      {
        "day": 2,
        "title": "Egyptian Museum & Citadel",
        "desc": "Marvel at King Tut's treasures, then visit the Saladin Citadel and Mohamed Ali Mosque."
      },
      {
        "day": 3,
        "title": "Coptic Cairo & Khan el-Khalili",
        "desc": "Walk the Hanging Church and historic alleyways, then shop at the famous bazaar."
      },
      {
        "day": 4,
        "title": "Saqqara & Memphis",
        "desc": "See the Step Pyramid of Djoser and the ancient capital of Memphis."
      },
      {
        "day": 5,
        "title": "Nile Dinner Cruise",
        "desc": "Sail the Nile at sunset with dinner and a live show to close your journey."
      }
    ],
    "type": "cultural",
    "departureDate": "2026-08-20",
    "availableSeats": 15,
    "totalSeats": 25,
    "difficulty": "Easy",
    "included": [
      "Entry tickets",
      "Tour guide",
      "Lunch"
    ],
    "excluded": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Camel ride (extra)"
    ],
    "faqs": []
  },
  {
    "id": 6,
    "slug": "luxor-aswan-nile-cruise",
    "title": "Luxor & Aswan Nile Cruise",
    "description": "A journey through time exploring ancient temples along the majestic Nile",
    "overview": "Sail the Nile between Luxor and Aswan, visiting the Karnak Temple complex, Valley of the Kings, Abu Simbel, and enjoying breathtaking river views.",
    "destination": "Luxor & Aswan, Egypt",
    "duration": "7 Days",
    "durationDays": 7,
    "price": 5500,
    "currency": "EGP",
    "image": "/images/egypt/egypt-luxor.webp",
    "gallery": [
      "/images/egypt/egypt-luxor.webp",
      "/images/egypt/egypt-temple-karnak.webp",
      "/images/egypt/egypt-temple.webp",
      "/images/egypt/egypt-temple2.webp"
    ],
    "category": "nile-cruises",
    "maxGroupSize": 22,
    "featured": true,
    "highlights": [
      "Karnak Temple",
      "Abu Simbel",
      "Nile cruise"
    ],
    "guide": "Walid Hassan",
    "meetingPoint": "Sofitel Hotel Luxor",
    "requirements": [
      "Valid passport",
      "Comfortable walking shoes",
      "Moderate fitness for temple visits",
      "Sunscreen"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Luxor East Bank",
        "desc": "Explore Karnak and Luxor temples, then walk the Avenue of Sphinxes."
      },
      {
        "day": 2,
        "title": "Valley of the Kings",
        "desc": "Visit royal tombs including Tutankhamun, then the Hatshepsut Temple and Colossi of Memnon."
      },
      {
        "day": 3,
        "title": "Edfo & Kom Ombo",
        "desc": "Cruise the Nile past sugar cane fields to the Temple of Horus and the crocodile temple."
      },
      {
        "day": 4,
        "title": "Aswan & Philae",
        "desc": "Sail to the Temple of Philae and take a felucca ride around Elephantine Island."
      },
      {
        "day": 5,
        "title": "Abu Simbel & Return",
        "desc": "Fly or drive to the majestic Abu Simbel temples before your return journey."
      }
    ],
    "type": "cultural",
    "departureDate": "2026-10-01",
    "availableSeats": 10,
    "totalSeats": 22,
    "difficulty": "Easy",
    "included": [
      "Temple entry tickets",
      "Specialized guide",
      "Selected meals"
    ],
    "excluded": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Beverages on cruise"
    ],
    "faqs": []
  }
];

// Trip types used by the /trips filter. `label` is Arabic, `labelEn` English.
export const mockTripTypes = [
  { id: "all", label: "الكل", labelEn: "All" },
  { id: "beach", label: "شاطئ", labelEn: "Beach" },
  { id: "adventure", label: "مغامرة", labelEn: "Adventure" },
  { id: "cultural", label: "ثقافية", labelEn: "Cultural" },
];
