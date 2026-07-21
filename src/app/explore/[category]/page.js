"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Star, MapPin, ArrowLeft, Search, Clock, Heart, Award, Flame, Wifi,
  Building, UtensilsCrossed, Compass, Telescope,
  Car, Coffee, Pill, ShoppingBag, TreePine,
  Train, Bus, Plane, Ship, Dog, Music, Camera,
  ChevronDown, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { searchPlaces } from "@/lib/api/explore";
import styles from "./category.module.css";

gsap.registerPlugin(ScrollTrigger);

// =============================================
// CATEGORY CONFIG — each has unique layout type
// =============================================
const LAYOUTS = {
  hotels: "premium_grid",
  restaurants: "food_gallery",
  trips: "heritage_timeline",
  activities: "adventure_grid",
  transport: "transit_board",
  cafes: "cozy_corner",
  essentials: "directory",
  malls: "storefront",
  parks: "nature",
};

const CONFIG = {
  hotels: {
    icon: Building, labelEn: "Hotels", count: 24,
    gradient: "linear-gradient(135deg, #0f0c08, #1a1410)",
    accent: "#f59e0b", heroImg: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80",
    heroTitleEn: "Find Your Perfect Stay",
  },
  restaurants: {
    icon: UtensilsCrossed, labelEn: "Restaurants", count: 36,
    gradient: "linear-gradient(135deg, #1a0a0a, #2c1010)",
    accent: "#ef4444", heroImg: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=1400&q=80",
    heroTitleEn: "Taste the Flavors of Egypt",
  },
  trips: {
    icon: Compass, labelEn: "Landmarks", count: 18,
    gradient: "linear-gradient(135deg, #0e0a1a, #1a1030)",
    accent: "#8b5cf6", heroImg: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1400&q=80",
    heroTitleEn: "Journey Through History",
  },
  activities: {
    icon: Telescope, labelEn: "Activities", count: 15,
    gradient: "linear-gradient(135deg, #000d1a, #001a2c)",
    accent: "#06b6d4", heroImg: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=80",
    heroTitleEn: "Adventure Awaits",
  },
  transport: {
    icon: Car, labelEn: "Transport", count: 12,
    gradient: "linear-gradient(135deg, #001a0f, #002c1a)",
    accent: "#10b981", heroImg: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1400&q=80",
    heroTitleEn: "Get Around with Ease",
  },
  cafes: {
    icon: Coffee, labelEn: "Cafes", count: 20,
    gradient: "linear-gradient(135deg, #1a0f08, #2c1810)",
    accent: "#d97706", heroImg: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&q=80",
    heroTitleEn: "Where Every Sip Tells a Story",
  },
  essentials: {
    icon: Pill, labelEn: "Services", count: 9,
    gradient: "linear-gradient(135deg, #0a0a1a, #10102c)",
    accent: "#6366f1", heroImg: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1400&q=80",
    heroTitleEn: "Everything You Need",
  },
  malls: {
    icon: ShoppingBag, labelEn: "Shopping", count: 14,
    gradient: "linear-gradient(135deg, #1a0a14, #2c1020)",
    accent: "#ec4899", heroImg: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1400&q=80",
    heroTitleEn: "Shop 'Til You Drop",
  },
  parks: {
    icon: TreePine, labelEn: "Parks", count: 11,
    gradient: "linear-gradient(135deg, #001a08, #002c10)",
    accent: "#22c55e", heroImg: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
    heroTitleEn: "Nature's Escape",
  },
};

const cuisineFilters = ["Egyptian", "Italian", "Seafood", "Asian", "Fast Food", "Fine Dining"];

// =============================================
// CARD VARIANTS — one per layout
// =============================================
function HotelCard({ place, index, accent, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { y: 50, opacity: 0, rotateX: 10 }, {
      y: 0, opacity: 1, rotateX: 0, duration: 0.6, delay: index * 0.08, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none none" },
    });
  }, []);
  const stars = Math.floor(Number(place.rating) || 0);
  return (
    <div className={styles.hotelCard} ref={ref} onClick={onClick}>
      <div className={styles.hotelBgDecor}>
        <span className={styles.hotelEmoji}>🏨</span>
        <span className={styles.hotelEmoji}>⭐</span>
      </div>
      <div className={styles.hotelImgWrap}>
        <img src={place.photo} alt={place.name} className={styles.hotelImg} loading="lazy" onError={(e) => { e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image"; }} />
        <div className={styles.hotelImgOverlay} />
        <span className={styles.hotelPrice}>{place.price ? "$".repeat(place.price) : "$$"}</span>
        {place.open && <span className={styles.hotelOpen}>Open</span>}
      </div>
      <div className={styles.hotelBody}>
        <div className={styles.hotelStars}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} fill={i < stars ? accent : "none"} color={i < stars ? accent : "var(--border)"} />
          ))}
          <span className={styles.hotelRating}>{place.rating}</span>
        </div>
        <h3 className={styles.hotelName}>{place.name}</h3>
        <p className={styles.hotelAddr}><MapPin size={12} /> {place.address}</p>
        <div className={styles.hotelFeatures}>
          {place.verified && <span className={styles.hotelFeat}>✓ Verified</span>}
          {place.tastes?.slice(0, 2).map((t, i) => (
            <span key={i} className={styles.hotelFeat}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FoodCard({ place, index, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { scale: 0.9, opacity: 0, rotateY: 15 }, {
      scale: 1, opacity: 1, rotateY: 0, duration: 0.5, delay: index * 0.06, ease: "back.out(1.5)",
      scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
    });
  }, []);
  return (
    <div className={styles.foodCard} ref={ref} onClick={onClick}>
      <div className={styles.foodBgDecor}>
        <span className={styles.foodEmoji}>🍔</span>
        <span className={styles.foodEmoji}>🍕</span>
        <span className={styles.foodEmoji}>🌮</span>
      </div>
      <div className={styles.foodImgWrap}>
        <img src={place.photo} alt={place.name} className={styles.foodImg} loading="lazy" onError={(e) => { e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image"; }} />
        <div className={styles.foodOverlay} />
        <span className={styles.foodPrice}>{place.price ? "$".repeat(place.price) : "$$"}</span>
      </div>
      <div className={styles.foodBody}>
        <h3 className={styles.foodName}>{place.name}</h3>
        <div className={styles.foodTags}>
          <span className={`${styles.foodTag} ${place.open ? styles.foodOpen : styles.foodClosed}`}>
            {place.open ? "Open Now" : "Closed"}
          </span>
          {place.rating && <span className={styles.foodRating}>★ {place.rating}</span>}
        </div>
        <p className={styles.foodAddr}><MapPin size={11} /> {place.address}</p>
      </div>
    </div>
  );
}

function TimelineCard({ place, index, onClick }) {
  const ref = useRef(null);
  const isLeft = index % 2 === 0;
  useEffect(() => {
    gsap.fromTo(ref.current, { x: isLeft ? -60 : 60, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.7, delay: index * 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
    });
  }, []);
  return (
    <div className={`${styles.timelineCard} ${isLeft ? styles.timelineLeft : styles.timelineRight}`} ref={ref} onClick={onClick}>
      <div className={styles.timelineBgDecor}>
        <span className={styles.tripEmoji}>🏛️</span>
        <span className={styles.tripEmoji}>🗺️</span>
      </div>
      <div className={styles.timelineDot} />
      <div className={styles.timelineImgWrap}>
        <img src={place.photo} alt={place.name} className={styles.timelineImg} loading="lazy" onError={(e) => { e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image"; }} />
        <div className={styles.timelineOverlay} />
        <span className={styles.timelineBadge}>Must See</span>
      </div>
      <div className={styles.timelineBody}>
        <h3 className={styles.timelineName}>{place.name}</h3>
        <p className={styles.timelineAddr}><MapPin size={12} /> {place.address}</p>
        <div className={styles.timelineMeta}>
          <span className={styles.timelineRating}>★ {place.rating || "—"}</span>
          <span className={styles.timelineDist}>{place.distance ? `${(place.distance/1000).toFixed(1)}km` : ""}</span>
        </div>
      </div>
    </div>
  );
}

function AdventureCard({ place, index, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { scale: 0.8, opacity: 0, rotate: -5 }, {
      scale: 1, opacity: 1, rotate: 0, duration: 0.6, delay: index * 0.07, ease: "back.out(1.7)",
      scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
    });
  }, []);
  const adrenaline = Math.floor((Number(place.rating) || 3) * 20);
  return (
    <div className={styles.advCard} ref={ref} onClick={onClick}>
      <div className={styles.advBgDecor}>
        <span className={styles.activityEmoji}>🎿</span>
        <span className={styles.activityEmoji}>🏄</span>
        <span className={styles.activityEmoji}>🎯</span>
      </div>
      <div className={styles.advImgWrap}>
        <img src={place.photo} alt={place.name} className={styles.advImg} loading="lazy" onError={(e) => { e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image"; }} />
        <div className={styles.advOverlay} />
        <span className={styles.advDiff}>
          {adrenaline > 70 ? "Hard" : adrenaline > 40 ? "Medium" : "Easy"}
        </span>
      </div>
      <div className={styles.advBody}>
        <h3 className={styles.advName}>{place.name}</h3>
        <p className={styles.advAddr}><MapPin size={11} /> {place.address}</p>
        <div className={styles.advAdrenaline}>
          <span className={styles.advALabel}>
            <Flame size={12} color="#ef4444" /> Adrenaline
          </span>
          <div className={styles.advBar}>
            <div className={styles.advFill} style={{ width: `${adrenaline}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TransitCard({ place, index, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { x: 50, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.4, delay: index * 0.04, ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
    });
  }, []);
  const types = [Train, Bus, Car, Plane, Ship];
  const TypeIcon = types[index % types.length];
  return (
    <div className={styles.transitCard} ref={ref} onClick={onClick}>
      <div className={styles.transitBgDecor}>
        <span className={styles.transitEmoji}>✈️</span>
        <span className={styles.transitEmoji}>🚕</span>
        <span className={styles.transitEmoji}>🚂</span>
      </div>
      <div className={styles.transitIcon}><TypeIcon size={20} /></div>
      <div className={styles.transitInfo}>
        <h3 className={styles.transitName}>{place.name}</h3>
        <p className={styles.transitAddr}><MapPin size={11} /> {place.address}</p>
      </div>
      <div className={styles.transitMeta}>
        <span className={styles.transitPrice}>{place.price ? "$".repeat(place.price) : "$$"}</span>
        <span className={styles.transitRating}>★ {place.rating || "—"}</span>
      </div>
    </div>
  );
}

function CozyCard({ place, index, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { y: 30, opacity: 0, scale: 0.95, rotate: 3 }, {
      y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.5, delay: index * 0.06, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
    });
  }, []);
  return (
    <div className={styles.cozyCard} ref={ref} onClick={onClick}>
      <div className={styles.cozyBgDecor}>
        <span className={styles.cafeEmoji}>☕</span>
        <span className={styles.cafeEmoji}>🧁</span>
        <span className={styles.cafeEmoji}>🍩</span>
      </div>
      <div className={styles.cozyImgWrap}>
        <img src={place.photo} alt={place.name} className={styles.cozyImg} loading="lazy" onError={(e) => { e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image"; }} />
        <div className={styles.cozyOverlay} />
        <span className={styles.cozyWifi}><Wifi size={12} /> Free WiFi</span>
      </div>
      <div className={styles.cozyBody}>
        <h3 className={styles.cozyName}>{place.name}</h3>
        <div className={styles.cozyRating}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < Math.floor(Number(place.rating)||0) ? "#d97706" : "none"} color="#d97706" />
          ))}
          <span>{place.rating}</span>
        </div>
        <p className={styles.cozyHours}><Clock size={11} /> {place.hours || "9:00 AM - 11:00 PM"}</p>
      </div>
    </div>
  );
}

function DirCard({ place, index, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { scale: 0.9, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.4, delay: index * 0.04, ease: "back.out(1.5)",
      scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
    });
  }, []);
  return (
    <div className={styles.dirCard} ref={ref} onClick={onClick}>
      <div className={styles.dirBgDecor}>
        <span className={styles.essentialEmoji}>💊</span>
        <span className={styles.essentialEmoji}>🏥</span>
        <span className={styles.essentialEmoji}>🏦</span>
      </div>
      <div className={styles.dirLeft}>
        <div className={styles.dirIcon}>{place.categories?.[0]?.charAt(0) || "S"}</div>
      </div>
      <div className={styles.dirBody}>
        <h3 className={styles.dirName}>{place.name}</h3>
        <p className={styles.dirAddr}><MapPin size={11} /> {place.address}</p>
        <div className={styles.dirTags}>
          {place.verified && <span className={styles.dirTag}>✓ Verified</span>}
          {place.open !== null && (
            <span className={`${styles.dirTag} ${place.open ? styles.dirOpen : styles.dirClosed}`}>
              {place.open ? "Open" : "Closed"}
            </span>
          )}
        </div>
      </div>
      <div className={styles.dirDist}>
        {place.distance ? `${(place.distance/1000).toFixed(1)}km` : ""}
      </div>
    </div>
  );
}

function MallCard({ place, index, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { y: 40, opacity: 0, rotateX: 15 }, {
      y: 0, opacity: 1, rotateX: 0, duration: 0.5, delay: index * 0.06, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
    });
  }, []);
  return (
    <div className={styles.mallCard} ref={ref} onClick={onClick}>
      <div className={styles.mallBgDecor}>
        <span className={styles.mallEmoji}>🛍️</span>
        <span className={styles.mallEmoji}>👗</span>
        <span className={styles.mallEmoji}>👟</span>
      </div>
      <div className={styles.mallImgWrap}>
        <img src={place.photo} alt={place.name} className={styles.mallImg} loading="lazy" onError={(e) => { e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image"; }} />
        <div className={styles.mallOverlay} />
        <span className={styles.mallSale}>SALE</span>
      </div>
      <div className={styles.mallBody}>
        <h3 className={styles.mallName}>{place.name}</h3>
        <div className={styles.mallRating}>
          <Star size={13} fill="#ec4899" color="#ec4899" />
          <span>{place.rating || "—"}</span>
          <span className={styles.mallDot}>·</span>
          <span>{place.categories?.[0] || "Shopping"}</span>
        </div>
      </div>
    </div>
  );
}

function ParkCard({ place, index, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { scale: 0.85, opacity: 0, rotate: -3 }, {
      scale: 1, opacity: 1, rotate: 0, duration: 0.5, delay: index * 0.06, ease: "back.out(1.6)",
      scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
    });
  }, []);
  return (
    <div className={styles.parkCard} ref={ref} onClick={onClick}>
      <div className={styles.parkBgDecor}>
        <span className={styles.parkEmoji}>🌳</span>
        <span className={styles.parkEmoji}>🌸</span>
        <span className={styles.parkEmoji}>🦋</span>
      </div>
      <div className={styles.parkImgWrap}>
        <img src={place.photo} alt={place.name} className={styles.parkImg} loading="lazy" onError={(e) => { e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image"; }} />
        <div className={styles.parkOverlay} />
        <span className={styles.parkFamily}>👨‍👩‍👧‍👦 Family Friendly</span>
      </div>
      <div className={styles.parkBody}>
        <h3 className={styles.parkName}>{place.name}</h3>
        <p className={styles.parkAddr}><MapPin size={11} /> {place.address}</p>
        <div className={styles.parkFacilities}>
          <span className={styles.parkFac}>🌳 Playground</span>
          <span className={styles.parkFac}>🧺 Picnic</span>
          {place.verified && <span className={styles.parkFac}>✓ Verified</span>}
        </div>
      </div>
    </div>
  );
}

// =============================================
// SKELETON LOADER
// =============================================
function SkeletonGrid({ layout }) {
  const count = layout === "transit_board" ? 6 : layout === "directory" ? 6 : 6;
  return (
    <div className={styles[`skel_${layout}`] || styles.grid}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={styles.skelCard}>
          <div className={styles.skel} style={{ height: layout === "transit_board" ? "60px" : layout === "directory" ? "80px" : "160px", borderRadius: "12px" }} />
        </div>
      ))}
    </div>
  );
}

// =============================================
// MAIN PAGE
// =============================================
export default function CategoryPage() {
  const { category } = useParams();
  const router = useRouter();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCuisine, setActiveCuisine] = useState("All");
  const heroRef = useRef(null);
  const sectionRef = useRef(null);

  const cfg = CONFIG[category];
  const layout = LAYOUTS[category];
  const Icon = cfg?.icon || Building;

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    searchPlaces({ category, near: "Cairo, Egypt", limit: 20 })
      .then((data) => setPlaces(Array.isArray(data) ? data : data.places || []))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    if (!cfg) return;
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.querySelectorAll("." + styles.heroLine),
          { y: 50, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.15, ease: "power4.out" }
        );
        gsap.fromTo(heroRef.current.querySelector("." + styles.heroImg),
          { scale: 1.1 }, { scale: 1, duration: 1.5, ease: "power2.out" }
        );
      }
    });
    return () => ctx.revert();
  }, [cfg]);

  if (!cfg) return (
    <main>
      <Navbar />
      <div className={styles.notFound}>
        <h1>Category not found</h1>
        <button onClick={() => router.push("/explore")} className={styles.backBtn}>
          <ArrowLeft size={18} /> Go back
        </button>
      </div>
      <Footer />
    </main>
  );

  const goToPlace = (id) => router.push(`/explore/${category}/${id}`);

  // Filter for restaurants
  const filteredPlaces = activeCuisine === "All"
    ? places
    : places.filter((p) => p.tastes?.includes(activeCuisine) || p.categories?.includes(activeCuisine));

  return (
    <main>
      <Navbar />

      {/* ── HERO with parallax image ── */}
      <section className={styles.hero} ref={heroRef} style={{ background: cfg.gradient }}>
        <img src={cfg.heroImg} alt="" className={styles.heroImg} onError={(e) => { e.target.src = "https://placehold.co/600x400/1a1a2e/ffffff?text=Image"; }} />
        <div className={styles.heroOverlayGrad} style={{ background: cfg.gradient }} />
        <div className={styles.heroContent}>
          <div className={styles.heroLine}>
            <button className={styles.backBtn} onClick={() => router.push("/explore")}>
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
          <div className={styles.heroLine}>
            <div className={styles.heroIcon} style={{ borderColor: cfg.accent }}>
              <Icon size={34} />
            </div>
          </div>
          <div className={styles.heroLine}>
            <h1 className={styles.heroTitle}>
              {cfg.labelEn}
            </h1>
          </div>
          <div className={styles.heroLine}>
            <p className={styles.heroSub}>
              {cfg.heroTitleEn}
            </p>
          </div>
          <div className={styles.heroLine}>
            <div className={styles.heroStatBadge}>
              <Sparkles size={13} color={cfg.accent} />
              <span>{filteredPlaces.length || cfg.count} places</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUISINE FILTERS (only for restaurants) ── */}
      {category === "restaurants" && (
        <div className={styles.cuisineBar}>
          <div className={styles.cuisineScroll}>
            <button
              className={`${styles.cuisinePill} ${activeCuisine === "All" ? styles.cuisineActive : ""}`}
              onClick={() => setActiveCuisine("All")}
            >All</button>
            {cuisineFilters.map((c) => (
              <button key={c}
                className={`${styles.cuisinePill} ${activeCuisine === c ? styles.cuisineActive : ""}`}
                onClick={() => setActiveCuisine(c)}
              >{c}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTENT SECTION ── */}
      <section className={styles.sectionOuter} ref={sectionRef}>
        <div className={styles.sectionInner}>
          {loading ? (
            <SkeletonGrid layout={layout} />
          ) : filteredPlaces.length === 0 ? (
            <div className={styles.emptyState}>
              <Search size={48} />
              <h3>No places found</h3>
            </div>
          ) : (
            /* ── Unique layout per category ── */
            <>
              {layout === "premium_grid" && (
                <div className={styles.grid3}>
                  {filteredPlaces.map((p, i) => (
                    <HotelCard key={p.id} place={p} index={i} accent={cfg.accent} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
              {layout === "food_gallery" && (
                <div className={styles.grid3}>
                  {filteredPlaces.map((p, i) => (
                    <FoodCard key={p.id} place={p} index={i} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
              {layout === "heritage_timeline" && (
                <div className={styles.timelineWrap}>
                  <div className={styles.timelineLine} />
                  {filteredPlaces.map((p, i) => (
                    <TimelineCard key={p.id} place={p} index={i} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
              {layout === "adventure_grid" && (
                <div className={styles.grid3}>
                  {filteredPlaces.map((p, i) => (
                    <AdventureCard key={p.id} place={p} index={i} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
              {layout === "transit_board" && (
                <div className={styles.transitList}>
                  {filteredPlaces.map((p, i) => (
                    <TransitCard key={p.id} place={p} index={i} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
              {layout === "cozy_corner" && (
                <div className={styles.grid3}>
                  {filteredPlaces.map((p, i) => (
                    <CozyCard key={p.id} place={p} index={i} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
              {layout === "directory" && (
                <div className={styles.dirList}>
                  {filteredPlaces.map((p, i) => (
                    <DirCard key={p.id} place={p} index={i} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
              {layout === "storefront" && (
                <div className={styles.grid3}>
                  {filteredPlaces.map((p, i) => (
                    <MallCard key={p.id} place={p} index={i} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
              {layout === "nature" && (
                <div className={styles.grid2}>
                  {filteredPlaces.map((p, i) => (
                    <ParkCard key={p.id} place={p} index={i} onClick={() => goToPlace(p.id)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
