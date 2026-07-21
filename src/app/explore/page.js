"use client";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building,
  UtensilsCrossed,
  Compass,
  Telescope,
  Car,
  Coffee,
  Pill,
  ShoppingBag,
  TreePine,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./explore.module.css";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: "hotels",
    labelEn: "Hotels",
    descEn: "Luxury stays & budget-friendly rooms across Egypt",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    accent: "#f59e0b",
    count: 24,
  },
  {
    id: "restaurants",
    labelEn: "Restaurants",
    descEn: "From street food to fine dining — taste Egypt",
    image:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&q=80",
    accent: "#ef4444",
    count: 36,
  },
  {
    id: "trips",
    labelEn: "Landmarks",
    descEn: "Pyramids, temples, and UNESCO wonders",
    image:
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600&q=80",
    accent: "#8b5cf6",
    count: 18,
  },
  {
    id: "activities",
    labelEn: "Activities",
    descEn: "Diving, hot air balloons, safaris & more",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    accent: "#06b6d4",
    count: 15,
  },
  {
    id: "transport",
    labelEn: "Transport",
    descEn: "Trains, flights, and local transit made easy",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
    accent: "#10b981",
    count: 12,
  },
  {
    id: "cafes",
    labelEn: "Cafes",
    descEn: "Cozy coffee spots with Nile views",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    accent: "#d97706",
    count: 20,
  },
  {
    id: "essentials",
    labelEn: "Services",
    descEn: "Pharmacies, banks, hospitals — all you need",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80",
    accent: "#6366f1",
    count: 9,
  },
  {
    id: "malls",
    labelEn: "Shopping",
    descEn: "Malls, markets, and local handicrafts",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80",
    accent: "#ec4899",
    count: 14,
  },
  {
    id: "parks",
    labelEn: "Parks",
    descEn: "Green escapes and botanical gardens",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    accent: "#22c55e",
    count: 11,
  },
];

const iconMap = {
  hotels: Building,
  restaurants: UtensilsCrossed,
  trips: Compass,
  activities: Telescope,
  transport: Car,
  cafes: Coffee,
  essentials: Pill,
  malls: ShoppingBag,
  parks: TreePine,
};

const entryDirections = [
  { x: -120, y: 40 },
  { x: 120, y: 40 },
  { x: 0, y: -120 },
  { x: -80, y: -80 },
  { x: 80, y: -80 },
  { x: 0, y: 120 },
  { x: -120, y: 0 },
  { x: 120, y: 0 },
  { x: 0, y: -60 },
];

function CategoryCard({ cat, index, router }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const iconRef = useRef(null);
  const Icon = iconMap[cat.id] || Compass;

  useEffect(() => {
    const el = cardRef.current;
    const glow = glowRef.current;
    const icon = iconRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Different animation per category
      const animations = {
        hotels: { rx: x * 15, ry: y * -15, scale: 1.05 },
        restaurants: { rx: x * 25, ry: y * -20, scale: 1.08 },
        trips: { rx: x * 18, ry: y * -18, scale: 1.06 },
        activities: { rx: x * 22, ry: y * -22, scale: 1.07 },
        transport: { rx: x * 12, ry: y * -12, scale: 1.04 },
        cafes: { rx: x * 20, ry: y * -15, scale: 1.05 },
        essentials: { rx: x * 10, ry: y * -10, scale: 1.03 },
        malls: { rx: x * 18, ry: y * -16, scale: 1.06 },
        parks: { rx: x * 14, ry: y * -14, scale: 1.05 },
      };
      
      const anim = animations[cat.id] || animations.hotels;
      
      gsap.to(el, {
        rotationY: anim.rx,
        rotationX: anim.ry,
        scale: anim.scale,
        transformPerspective: 1000,
        duration: 0.3,
        ease: "power2.out",
      });
      
      gsap.to(glow, {
        x: x * 40,
        y: y * 40,
        opacity: 0.7,
        duration: 0.3,
      });
      
      gsap.to(icon, {
        scale: 1.2,
        rotate: x * 20,
        duration: 0.3,
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
      });
      
      gsap.to(glow, {
        x: 0,
        y: 0,
        opacity: 0.25,
        duration: 0.5,
      });
      
      gsap.to(icon, {
        scale: 1,
        rotate: 0,
        duration: 0.5,
      });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      className={`${styles.cardWrap} ${styles[`card_${cat.id}`]}`}
      ref={cardRef}
      onClick={() => router.push(`/explore/${cat.id}`)}
      style={{ "--accent": cat.accent }}
    >
      <div className={styles.cardGlow} ref={glowRef} />
      <div className={styles.cardShine} />
      
      {/* Category-specific background elements */}
      {cat.id === 'restaurants' && (
        <div className={styles.foodBgElements}>
          <span className={styles.floatingFood} style={{ '--i': 0 }}>🍔</span>
          <span className={styles.floatingFood} style={{ '--i': 1 }}>🍕</span>
          <span className={styles.floatingFood} style={{ '--i': 2 }}>🌮</span>
          <span className={styles.floatingFood} style={{ '--i': 3 }}>🍜</span>
        </div>
      )}
      {cat.id === 'hotels' && (
        <div className={styles.hotelBgElements}>
          <span className={styles.floatingKey} style={{ '--i': 0 }}>🔑</span>
          <span className={styles.floatingKey} style={{ '--i': 1 }}>🏨</span>
          <span className={styles.floatingKey} style={{ '--i': 2 }}>⭐</span>
        </div>
      )}
      {cat.id === 'trips' && (
        <div className={styles.tripsBgElements}>
          <span className={styles.floatingTrip} style={{ '--i': 0 }}>🏛️</span>
          <span className={styles.floatingTrip} style={{ '--i': 1 }}>🐪</span>
          <span className={styles.floatingTrip} style={{ '--i': 2 }}>🗺️</span>
        </div>
      )}
      {cat.id === 'activities' && (
        <div className={styles.activitiesBgElements}>
          <span className={styles.floatingActivity} style={{ '--i': 0 }}>🎿</span>
          <span className={styles.floatingActivity} style={{ '--i': 1 }}>🏄</span>
          <span className={styles.floatingActivity} style={{ '--i': 2 }}>🎯</span>
        </div>
      )}
      {cat.id === 'transport' && (
        <div className={styles.transportBgElements}>
          <span className={styles.floatingTransport} style={{ '--i': 0 }}>✈️</span>
          <span className={styles.floatingTransport} style={{ '--i': 1 }}>🚕</span>
          <span className={styles.floatingTransport} style={{ '--i': 2 }}>🚂</span>
        </div>
      )}
      {cat.id === 'cafes' && (
        <div className={styles.cafesBgElements}>
          <span className={styles.floatingCafe} style={{ '--i': 0 }}>☕</span>
          <span className={styles.floatingCafe} style={{ '--i': 1 }}>🧁</span>
          <span className={styles.floatingCafe} style={{ '--i': 2 }}>🍩</span>
        </div>
      )}
      {cat.id === 'parks' && (
        <div className={styles.parksBgElements}>
          <span className={styles.floatingPark} style={{ '--i': 0 }}>🌳</span>
          <span className={styles.floatingPark} style={{ '--i': 1 }}>🌸</span>
          <span className={styles.floatingPark} style={{ '--i': 2 }}>🦋</span>
        </div>
      )}
      {cat.id === 'malls' && (
        <div className={styles.mallsBgElements}>
          <span className={styles.floatingMall} style={{ '--i': 0 }}>🛍️</span>
          <span className={styles.floatingMall} style={{ '--i': 1 }}>👗</span>
          <span className={styles.floatingMall} style={{ '--i': 2 }}>👟</span>
        </div>
      )}
      {cat.id === 'essentials' && (
        <div className={styles.essentialsBgElements}>
          <span className={styles.floatingEssential} style={{ '--i': 0 }}>💊</span>
          <span className={styles.floatingEssential} style={{ '--i': 1 }}>🏥</span>
          <span className={styles.floatingEssential} style={{ '--i': 2 }}>🏦</span>
        </div>
      )}

      <div className={styles.cardInner}>
        <div className={styles.cardImageWrap}>
          <img
            src={cat.image}
            alt={cat.labelEn}
            className={styles.cardImage}
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x400/1a1a2e/ffffff?text=Image";
            }}
          />
          <div className={styles.cardOverlay} />
          <div className={styles.cardAccentBar} />
          <div className={styles.cardParticles}>
            {[...Array(6)].map((_, i) => (
              <span key={i} className={styles.particleDot} style={{ "--delay": i * 0.2 }} />
            ))}
          </div>
        </div>

        <div className={styles.cardIconBadge} ref={iconRef}>
          <Icon size={20} />
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{cat.labelEn}</h3>
          <p className={styles.cardDesc}>{cat.descEn}</p>
          <div className={styles.cardFooter}>
            <span className={styles.cardCount}>
              <Sparkles size={12} />
              {cat.count} places
            </span>
            <span
              className={styles.cardArrow}
              style={{ background: cat.accent }}
            >
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingParticle({ style }) {
  return <div className={styles.particle} style={style} />;
}

function FloatingDeco({ style, className }) {
  return (
    <div
      className={`${styles.decoElement} ${className || ""}`}
      style={style}
    />
  );
}

export default function ExploreHubPage() {
  const router = useRouter();
  const gridRef = useRef(null);
  const heroRef = useRef(null);
  const particlesRef = useRef(null);
  const decoRef = useRef(null);

  const spawnParticles = useCallback(() => {
    const container = particlesRef.current;
    if (!container) return;
    const colors = ["#ff6b35", "#00d4ff", "#ffd700", "#ff1493", "#8b5cf6", "#22c55e", "#f59e0b"];
    const shapes = ['circle', 'square', 'triangle'];
    const count = 50;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = styles.particle;
      const size = Math.random() * 8 + 2;
      const c = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      let borderRadius = '50%';
      if (shape === 'square') borderRadius = '2px';
      if (shape === 'triangle') borderRadius = '0';
      
      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;top:${Math.random() * 100}%;
        background:${c};opacity:${Math.random() * 0.6 + 0.1};
        position:absolute;border-radius:${borderRadius};pointer-events:none;
        transform: rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(p);
      
      gsap.to(p, {
        y: `random(-120, 120)`,
        x: `random(-60, 60)`,
        rotation: `random(-180, 180)`,
        duration: `random(8, 18)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5,
      });
      gsap.to(p, {
        opacity: `random(0.1, 0.6)`,
        scale: `random(0.8, 1.5)`,
        duration: `random(3, 7)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 4,
      });
    }
  }, []);

  useEffect(() => {
    spawnParticles();

    if (decoRef.current) {
      const decos = decoRef.current.querySelectorAll("." + styles.decoElement);
      decos.forEach((d, i) => {
        gsap.to(d, {
          x: `random(-60, 60)`,
          y: `random(-40, 40)`,
          rotation: `random(-15, 15)`,
          duration: `random(10, 20)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.8,
        });
      });
    }

    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll("." + styles.heroLine),
        { y: 80, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
        }
      );
    }

    const cards = gridRef.current?.querySelectorAll("." + styles.cardWrap);
    if (cards) {
      cards.forEach((card, i) => {
        const dir = entryDirections[i % entryDirections.length];
        gsap.set(card, {
          opacity: 0,
          x: dir.x,
          y: dir.y,
          scale: 0.85,
          rotationY: dir.x * 0.1,
        });
        gsap.to(card, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          delay: i * 0.1,
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (particlesRef.current) particlesRef.current.innerHTML = "";
    };
  }, [spawnParticles]);

  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBg}>
          <div className={styles.heroGlow1} />
          <div className={styles.heroGlow2} />
          <div className={styles.heroGlow3} />
          <div className={styles.heroGlow4} />
          <div className={styles.heroGrid} />
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroOrb3} />
          <div className={styles.particlesWrap} ref={particlesRef} />
        </div>

        <div className={styles.decoWrap} ref={decoRef}>
          <FloatingDeco
            className={styles.decoCircle}
            style={{
              top: "12%",
              left: "6%",
              width: 120,
              height: 120,
              opacity: 0.08,
            }}
          />
          <FloatingDeco
            className={styles.decoCircle}
            style={{
              top: "65%",
              right: "10%",
              width: 80,
              height: 80,
              opacity: 0.1,
            }}
          />
          <FloatingDeco
            className={styles.decoLine}
            style={{
              top: "25%",
              right: "18%",
              width: 140,
              height: 3,
              opacity: 0.1,
              transform: "rotate(45deg)",
            }}
          />
          <FloatingDeco
            className={styles.decoCircle}
            style={{
              bottom: "25%",
              left: "12%",
              width: 50,
              height: 50,
              opacity: 0.12,
            }}
          />
          <FloatingDeco
            className={styles.decoLine}
            style={{
              top: "75%",
              left: "20%",
              width: 100,
              height: 2,
              opacity: 0.08,
              transform: "rotate(-30deg)",
            }}
          />
          <FloatingDeco
            className={styles.decoRing}
            style={{
              top: "20%",
              right: "6%",
              width: 100,
              height: 100,
              opacity: 0.06,
            }}
          />
          <FloatingDeco
            className={styles.decoTriangle}
            style={{
              top: "45%",
              left: "4%",
              width: 0,
              height: 0,
              opacity: 0.07,
              borderLeft_width: "30px",
              borderRight_width: "30px",
              borderBottom_width: "52px",
            }}
          />
          <FloatingDeco
            className={styles.decoHexagon}
            style={{
              bottom: "15%",
              right: "8%",
              width: 60,
              height: 70,
              opacity: 0.06,
            }}
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroLine}>
            <span className={styles.heroTag}>
              <Sparkles size={14} />
              Explore Egypt
            </span>
          </div>
          <div className={styles.heroLine}>
            <h1 className={styles.heroTitle}>
              Discover{" "}
              <span className={styles.heroAccent}>Egypt</span>
            </h1>
          </div>
          <div className={styles.heroLine}>
            <p className={styles.heroSub}>
              Everything for your trip — hotels, restaurants, landmarks,
              activities & more
            </p>
          </div>
          <div className={styles.heroLine}>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>9</span>
                <span className={styles.heroStatLabel}>Categories</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>159+</span>
                <span className={styles.heroStatLabel}>Places</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>24/7</span>
                <span className={styles.heroStatLabel}>Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.gridContainer}>
          <div className={styles.gridHeader}>
            <span className={styles.gridTag}>
              <Compass size={14} />
              Browse Categories
            </span>
            <h2 className={styles.gridTitle}>Pick What Excites You</h2>
            <p className={styles.gridSub}>
              Explore the best places and experiences in Egypt
            </p>
          </div>

          <div className={styles.grid} ref={gridRef}>
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                index={i}
                router={router}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaBg}>
            <div className={styles.ctaGlow1} />
            <div className={styles.ctaGlow2} />
          </div>
          <div className={styles.ctaContent}>
            <Sparkles size={28} className={styles.ctaIcon} />
            <h3 className={styles.ctaTitle}>
              Know a place we should list?
            </h3>
            <p className={styles.ctaSub}>
              Help us build the ultimate Egypt travel guide
            </p>
            <button className={styles.ctaBtn}>
              Suggest a Place
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
