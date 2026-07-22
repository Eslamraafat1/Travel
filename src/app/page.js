"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Star, ArrowLeft, ArrowRight, Play, ChevronDown,
  Shield, HeadphonesIcon, Award, Globe, TrendingUp, Heart,
  Quote, ChevronRight, ChevronLeft, Search, CreditCard,
  Smile, CheckCircle, Download, Smartphone, Zap
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PackageCard from "@/components/PackageCard/PackageCard";
import TripCard from "@/components/TripCard/TripCard";
import { getFeaturedPackages, getHomeStats } from "@/lib/api/packages";
import { getPopularTrips } from "@/lib/api/trips";
import { useLanguage } from "@/context/LanguageContext";
import { getMergedContent } from "@/lib/contentStore";
import styles from "./page.module.css";

// ---- Animated Counter ----
function Counter({ target, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Static icon/visual data (language-independent)
const testimonialData = [
  { id: 1, avatar: "https://i.pravatar.cc/80?img=5", rating: 5 },
  { id: 2, avatar: "https://i.pravatar.cc/80?img=11", rating: 5 },
  { id: 3, avatar: "https://i.pravatar.cc/80?img=9", rating: 5 },
  { id: 4, avatar: "https://i.pravatar.cc/80?img=15", rating: 5 },
];

const featureIcons = [
  { icon: <Shield size={28} />, color: "#22c55e" },
  { icon: <Award size={28} />, color: "#f59e0b" },
  { icon: <HeadphonesIcon size={28} />, color: "#00d4ff" },
  { icon: <TrendingUp size={28} />, color: "#ff6b35" },
  { icon: <Globe size={28} />, color: "#a855f7" },
  { icon: <Heart size={28} />, color: "#ec4899" },
];

const stepIcons = [
  { icon: <Search size={32} />, color: "#ff6b35", bg: "rgba(255,107,53,0.15)" },
  { icon: <CreditCard size={32} />, color: "#00d4ff", bg: "rgba(0,212,255,0.15)" },
  { icon: <Smile size={32} />, color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
];

const heroBgData = [
  { bg: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920" },
  { bg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920" },
  { bg: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920" },
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800", span: "span2x2" },
  { src: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600" },
  { src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600" },
  { src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800", span: "spanWide" },
  { src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600" },
];

const partners = [
  { name: "Emirates", color: "#d71921" },
  { name: "Booking.com", color: "#003580" },
  { name: "Qatar Airways", color: "#8c1533" },
  { name: "Marriott", color: "#1a1a2e" },
  { name: "Expedia", color: "#003580" },
  { name: "Turkish Airlines", color: "#e30a17" },
  { name: "Hilton", color: "#00471b" },
  { name: "Etihad", color: "#a38654" },
];

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ destinations: 120, travelers: 50000, years: 15 });
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const [contentVer, setContentVer] = useState(0);
  const forceUpdate = useCallback(() => setContentVer(v => v + 1), []);
  useEffect(() => {
    window.addEventListener("storage", forceUpdate);
    return () => window.removeEventListener("storage", forceUpdate);
  }, [forceUpdate]);
  const ct = useCallback((k) => getMergedContent(k, t(k), lang), [t, lang, contentVer]);

  useEffect(() => {
    const load = async () => {
      try {
        const [pkgs, trps, st] = await Promise.all([
          getFeaturedPackages(lang),
          getPopularTrips(4, lang),
          getHomeStats(lang),
        ]);
        setPackages(pkgs);
        setTrips(trps);
        setStats(st);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang, contentVer]);

  // Merge translation data with static icon/data (check contentStore overrides first)
  const featuresRaw = ct('home.whyUs.features');
  const features = Array.isArray(featuresRaw)
    ? featuresRaw.map((f, i) => ({ ...f, ...featureIcons[i] }))
    : [];

  const testimonialsRaw = ct('home.testimonials.items');
  const testimonials = Array.isArray(testimonialsRaw)
    ? testimonialsRaw.map((item, i) => ({ ...item, ...testimonialData[i] }))
    : [];

  const stepsRaw = ct('home.howItWorks.steps');
  const steps = Array.isArray(stepsRaw)
    ? stepsRaw.map((s, i) => ({ ...s, ...stepIcons[i] }))
    : [];

  const galleryRaw = ct('home.gallery.items');
  const galleryItems = Array.isArray(galleryRaw)
    ? galleryRaw.map((g, i) => ({ ...g, ...galleryImages[i] }))
    : [];

  // Auto-rotate testimonials
  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <main>
      <Navbar />

      {/* ============================
          HERO SECTION - AGENCY STYLE
      ============================ */}
      <section className={styles.agencyHero} id="hero">
        <div className={styles.agencyHeroBg}></div>
        
        <div className="container">
          <div className={styles.agencyHeroGrid}>
            
            {/* Left Image Card */}
            <motion.div 
              className={styles.agencyLeftCard}
              initial={{ opacity: 0, x: -300, scale: 0.7, skewY: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1, skewY: 10 }}
              transition={{ 
                type: "spring", 
                stiffness: 60, 
                damping: 12, 
                mass: 0.8 
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=400&h=500&fit=crop" 
                alt="Travel destination"
              />
            </motion.div>

            {/* Center Content */}
            <div className={styles.agencyCenter}>
              
              {/* Top Center Card */}
              <motion.div 
                className={styles.agencyTopCard}
                initial={{ opacity: 0, y: -150, scale: 0.6, rotate: -45, skewY: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -5, skewY: 10 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 80, 
                  damping: 14, 
                  delay: 0.15 
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=200&h=250&fit=crop" 
                  alt="Portrait"
                />
              </motion.div>

              {/* Main Hero Text */}
              <motion.div 
                className={styles.agencyHeroText}
                initial={{ opacity: 0, y: 80, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15, 
                  delay: 0.3 
                }}
              >
                <h1 className={styles.agencyHeroTitle}>
                  DISCOVER<br />
                  EGYPT
                </h1>
                
                <motion.button 
                  className={styles.agencyHeroBtn}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 120, 
                    damping: 10, 
                    delay: 0.7 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Now
                </motion.button>
              </motion.div>

            </div>

            {/* Right Content */}
            <div className={styles.agencyRight}>
              
              {/* Top Right Text */}
              <motion.div 
                className={styles.agencyTopText}
                initial={{ opacity: 0, x: 200, y: -30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 90, 
                  damping: 13, 
                  delay: 0.25 
                }}
              >
                <p>PREMIUM<br />TRAVEL<br />EXPERIENCES</p>
              </motion.div>

              {/* Right Image Card */}
              <motion.div 
                className={styles.agencyRightCard}
                initial={{ opacity: 0, x: 300, scale: 0.7, skewY: 0 }}
                animate={{ opacity: 1, x: 0, scale: 1, skewY: 10 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 65, 
                  damping: 12, 
                  mass: 0.85, 
                  delay: 0.4 
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=300&h=400&fit=crop" 
                  alt="Creative work"
                />
              </motion.div>

              {/* Bottom Right Text */}
              <motion.div 
                className={styles.agencyBottomText}
                initial={{ opacity: 0, x: 150, y: 40 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 14, 
                  delay: 0.5 
                }}
              >
                <p>MAKE YOUR DREAM TRIP COME TRUE<br />WITH US.</p>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* ============================
          STATS SECTION
      ============================ */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { label: ct('home.stats.destinations'), value: stats.destinations, suffix: "+" },
              { label: ct('home.stats.travelers'), value: stats.travelers, suffix: "+" },
              { label: ct('home.stats.years'), value: stats.years, suffix: "" },
              { label: ct('home.stats.rating'), isRating: true },
            ].map((stat, i) => (
              <motion.div key={i} className={styles.statCard}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={styles.statValue}>
                  {stat.isRating ? "4.9" : <Counter target={stat.value} suffix={stat.suffix} />}
                  {stat.isRating && <span className={styles.statSuffix}>/5</span>}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
                {stat.isRating && (
                  <div className={styles.statStars}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#ffd700" color="#ffd700" />)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          FEATURED PACKAGES
      ============================ */}
      <section className="section" id="packages-section">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <span className="section-tag">{ct('home.packages.tag')}</span>
            <h2 className="section-title">
              {ct('home.packages.title1')}<span className="gradient-text">{ct('home.packages.titleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('home.packages.subtitle')}</p>
          </motion.div>

          {loading ? (
            <div className={styles.packagesGrid}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className="skeleton" style={{ height: "220px", borderRadius: "20px 20px 0 0" }} />
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="skeleton" style={{ height: "24px", width: "70%", borderRadius: "8px" }} />
                    <div className="skeleton" style={{ height: "16px", borderRadius: "8px" }} />
                    <div className="skeleton" style={{ height: "40px", borderRadius: "50px", marginTop: "8px" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.packagesGrid}>
              {packages.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)}
            </div>
          )}

          <motion.div className={styles.viewAllWrapper}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
          >
            <Link href="/packages" className="btn-outline" id="home-view-all-packages">
              {ct('home.packages.viewAll')} <ArrowIcon size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================
          HOW IT WORKS (NEW)
      ============================ */}
      <section className={`section section-alt`} id="how-it-works">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <span className="section-tag">{ct('home.howItWorks.tag')}</span>
            <h2 className="section-title">
              {ct('home.howItWorks.title1')}<span className="gradient-text">{ct('home.howItWorks.titleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('home.howItWorks.subtitle')}</p>
          </motion.div>

          <div className={styles.stepsGrid}>
            {steps.map((step, i) => (
              <motion.div key={i} className={styles.stepCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <span className={styles.stepNum}>{step.num}</span>
                <div className={styles.stepIcon} style={{ background: step.bg, color: step.color }}>
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < steps.length - 1 && <div className={styles.stepConnector} />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          WHY CHOOSE US
      ============================ */}
      <section className={`section ${styles.whySection}`} id="why-us">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <span className="section-tag">{ct('home.whyUs.tag')}</span>
            <h2 className="section-title">
              {ct('home.whyUs.title1')}<span className="gradient-text">{ct('home.whyUs.titleAccent')}</span>{ct('home.whyUs.title2')}
            </h2>
            <p className="section-subtitle">{ct('home.whyUs.subtitle')}</p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((feat, i) => (
              <motion.div key={i} className={styles.featureCard}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <div className={styles.featureIcon} style={{ color: feat.color, background: `${feat.color}18` }}>
                  {feat.icon}
                </div>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureDesc}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          POPULAR TRIPS
      ============================ */}
      <section className="section section-alt" id="trips-section">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <span className="section-tag">{ct('home.trips.tag')}</span>
            <h2 className="section-title">
              <span className="gradient-text-blue">{ct('home.trips.titleAccent')}</span>{ct('home.trips.title2')}
            </h2>
            <p className="section-subtitle">{ct('home.trips.subtitle')}</p>
          </motion.div>

          {loading ? (
            <div className={styles.tripsGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ borderRadius: "20px", overflow: "hidden" }}>
                  <div className="skeleton" style={{ height: "200px" }} />
                  <div style={{ padding: "18px", background: "var(--bg-card)", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div className="skeleton" style={{ height: "20px", width: "60%", borderRadius: "8px" }} />
                    <div className="skeleton" style={{ height: "38px", borderRadius: "50px", marginTop: "8px" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.tripsGrid}>
              {trips.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} />)}
            </div>
          )}

          <motion.div className={styles.viewAllWrapper}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
          >
            <Link href="/trips" className="btn-outline" id="home-view-all-trips"
              style={{ borderColor: "var(--secondary)", color: "var(--secondary)" }}
            >
              {ct('home.trips.viewAll')} <ArrowIcon size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================
          PHOTO GALLERY (NEW)
      ============================ */}
      <section className="section" id="gallery">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <span className="section-tag">{ct('home.gallery.tag')}</span>
            <h2 className="section-title">
              {ct('home.gallery.title1')}<span className="gradient-text">{ct('home.gallery.titleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('home.gallery.subtitle')}</p>
          </motion.div>

          <div className={styles.galleryGrid}>
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                className={`${styles.galleryItem} ${item.span ? styles[item.span] : ""}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <img src={item.src} alt={item.label} />
                <div className={styles.galleryOverlay}>
                  <h4><MapPin size={14} style={{ display: "inline", marginInlineEnd: "6px" }} />{item.label}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          TESTIMONIALS
      ============================ */}
      <section className="section section-alt" id="testimonials">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('home.testimonials.tag')}</span>
            <h2 className="section-title">
              {ct('home.testimonials.title1')} <span className="gradient-text">{ct('home.testimonials.titleAccent')}</span>
            </h2>
          </motion.div>

          <div className={styles.testimonialWrapper}>
            <AnimatePresence mode="wait">
              {testimonials.length > 0 && (
                <motion.div key={testimonialIdx} className={styles.testimonialCard}
                  initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? -50 : 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Quote size={40} className={styles.quoteIcon} />
                  <p className={styles.testimonialText}>{testimonials[testimonialIdx].text}</p>
                  <div className={styles.testimonialFooter}>
                    <img src={testimonials[testimonialIdx].avatar} alt={testimonials[testimonialIdx].name} className={styles.avatar} />
                    <div>
                      <h4 className={styles.testimonialName}>{testimonials[testimonialIdx].name}</h4>
                      <p className={styles.testimonialRole}>{testimonials[testimonialIdx].role} • {testimonials[testimonialIdx].destination}</p>
                      <div className={styles.testimonialStars}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#ffd700" color="#ffd700" />)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.testimonialControls}>
              <button id="testimonial-prev" className={styles.testimonialBtn}
                onClick={() => setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
              >
                <ChevronRight size={20} />
              </button>
              <div className={styles.testimonialDots}>
                {testimonials.map((_, i) => (
                  <button key={i} id={`testimonial-dot-${i}`}
                    className={`${styles.testimonialDot} ${i === testimonialIdx ? styles.testimonialDotActive : ""}`}
                    onClick={() => setTestimonialIdx(i)}
                  />
                ))}
              </div>
              <button id="testimonial-next" className={styles.testimonialBtn}
                onClick={() => setTestimonialIdx(i => (i + 1) % testimonials.length)}
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          VIDEO PROMO
      ============================ */}
     

      {/* ============================
          APP SECTION (NEW)
      ============================ */}
    

      {/* ============================
          PARTNERS
      ============================ */}
      <section className="section section-alt">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('home.partners.tag')}</span>
            <h2 className="section-title">{ct('home.partners.title1')}<span className="gradient-text">{ct('home.partners.titleAccent')}</span></h2>
          </motion.div>

          <div className={styles.partnersSlider}>
            <div className={styles.partnersTrack}>
              {[...partners, ...partners].map((p, i) => (
                <div key={i} className={styles.partnerLogo}>
                  <div className={styles.partnerLogoIcon} style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}>
                    <span>{p.name.charAt(0)}</span>
                  </div>
                  <span className={styles.partnerLogoName}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          NEWSLETTER
      ============================ */}
      <section className={styles.newsletter} id="newsletter">
        <div className="container">
          <motion.div className={styles.newsletterCard}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className={styles.newsletterContent}>
              <h2>{ct('home.newsletter.title1')}<span className={styles.newsletterAccent}>{ct('home.newsletter.titleAccent')}</span></h2>
              <p>{ct('home.newsletter.subtitle')}</p>
              <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  id="newsletter-email"
                  placeholder={String(ct('home.newsletter.placeholder'))}
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterBtn} id="newsletter-submit">
                  {ct('home.newsletter.btn')}
                </button>
              </form>
            </div>
            <div className={styles.newsletterDecor}>
              <Globe size={120} className={styles.globeDecor} />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
