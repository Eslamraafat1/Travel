"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Search, ArrowRight, ArrowLeft, Compass, Clock,
  Loader2, Sparkles, ChevronDown, Plane, Umbrella, Mountain, Building2,
  Tent, Gem, Heart, Route
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SmartImage from "@/components/SmartImage/SmartImage";
import { useLanguage } from "@/context/LanguageContext";
import { getMergedContent } from "@/lib/contentStore";
import { getSuggestions, getMatchedDestinations, destinationsList, popularDestinationIds } from "@/lib/api/planner";
import { mockTrips } from "@/lib/mockData/trips";
import styles from "./planner.module.css";

// ===== CONTENT FROM touregyptclub.com/planner =====
// The live site publishes these cards in English only, so they are shown in
// English in both languages (section headings come from the dictionaries).

const categoriesData = [
  { id: "beach", title: "Beach & Islands", desc: "Enjoy pristine beaches and crystal-clear turquoise waters", href: "/trips", icon: <Umbrella size={28} />, gradient: "linear-gradient(135deg, #00b4d8, #0077b6)" },
  { id: "adventure", title: "Adventure Travel", desc: "Mountain climbing, diving, and desert safaris", href: "/trips", icon: <Mountain size={28} />, gradient: "linear-gradient(135deg, #22c55e, #166534)" },
  { id: "cultural", title: "Cultural Heritage", desc: "Explore history and heritage at world-famous museums and sites", href: "/trips", icon: <Building2 size={28} />, gradient: "linear-gradient(135deg, #f59e0b, #b45309)" },
  { id: "desert", title: "Desert Safari", desc: "Adventures in the heart of the desert under starlit skies", href: "/trips", icon: <Tent size={28} />, gradient: "linear-gradient(135deg, #ef4444, #991b1b)" },
  { id: "luxury", title: "Luxury Travel", desc: "Finest resorts and exclusive services across Egypt", href: "/packages", icon: <Gem size={28} />, gradient: "linear-gradient(135deg, #a855f7, #6b21a8)" },
  { id: "family", title: "Family Trips", desc: "Destinations and activities suitable for the whole family", href: "/packages", icon: <Heart size={28} />, gradient: "linear-gradient(135deg, #ec4899, #9d174d)" },
];

// Featured destinations. Photos are the client's own (public/images/egypt).
const spotlightData = [
  { id: "luxor", title: "Luxor", desc: "Breathtaking temples, Valley of the Kings, and ancient wonders", image: "/images/egypt/egypt-luxor.webp" },
  { id: "aswan", title: "Aswan", desc: "Unique blend of Nubian culture and tranquil Nile scenery", image: "/images/egypt/egypt-temple.webp" },
];

// Scenic routes with the stops and durations published on the live planner.
const scenicRoutesData = [
  { id: "nile-valley", title: "Nile Valley Route", desc: "From Cairo to Aswan along the majestic Nile through ancient history", image: "/images/egypt/egypt-nile.webp", stops: 8, days: 14, color: "#00b4d8" },
  { id: "red-sea-coast", title: "Red Sea Coast", desc: "Through turquoise waters and golden beaches from Hurghada to Marsa Alam", image: "/images/egypt/egypt-desert-resort.webp", stops: 6, days: 10, color: "#22c55e" },
  { id: "western-desert", title: "Western Desert Oases", desc: "Journey through Siwa, Bahariya, Farafra, and the White Desert", image: "/images/egypt/egypt-desert.webp", stops: 10, days: 21, color: "#f59e0b" },
  { id: "sinai", title: "Sinai Circuit", desc: "From Sharm El-Sheikh to Dahab, St. Catherine, and the Colored Canyon", image: "/images/egypt/egypt-redsea.webp", stops: 5, days: 7, color: "#ef4444" },
  { id: "alexandria-siwa", title: "Alexandria to Siwa", desc: "Mediterranean coast to the magical oasis through El Alamein and Marsa Matrouh", image: "/images/egypt/red-sea-coast.webp", stops: 7, days: 18, color: "#a855f7" },
];

// First catalogue trip that visits a destination (for the spotlight CTA).
const tripFor = (name) => mockTrips.find((trip) => trip.destination.toLowerCase().includes(name.toLowerCase()));

export default function PlannerPage() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [contentVer, setContentVer] = useState(0);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [focusField, setFocusField] = useState(null);
  const [results, setResults] = useState({ matched: false, items: [] });
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    left: `${((i * 5.1 + 3.9) % 100)}%`,
    top: `${((i * 7.7 + 11.3) % 100)}%`,
    size: `${2 + ((i * 3.1 + 1.7) % 1) * 4}px`,
    delay: (i * 0.37 + 0.13) % 4,
    duration: 3 + ((i * 0.53 + 0.71) % 1) * 4,
  })), []);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const resultsRef = useRef(null);

  const forceUpdate = useCallback(() => setContentVer(v => v + 1), []);
  useEffect(() => {
    window.addEventListener("storage", forceUpdate);
    return () => window.removeEventListener("storage", forceUpdate);
  }, [forceUpdate]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ct = useCallback((k) => getMergedContent(k, t(k), lang), [t, lang, contentVer]);

  useEffect(() => {
    const handler = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setFocusField(f => f === "from" ? null : f);
      if (toRef.current && !toRef.current.contains(e.target)) setFocusField(f => f === "to" ? null : f);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateFrom = (val) => {
    setFrom(val);
    setFromSuggestions(getMatchedDestinations(val));
  };

  const updateTo = (val) => {
    setTo(val);
    setToSuggestions(getMatchedDestinations(val));
  };

  const selectFrom = (d) => {
    setFrom(d[lang]);
    setFromSuggestions([]);
    setFocusField("to");
    document.getElementById("planner-to")?.focus();
  };

  const selectTo = (d) => {
    setTo(d[lang]);
    setToSuggestions([]);
  };

  const handleSearch = () => {
    if (!to.trim()) return;
    setSearching(true);
    setSearched(false);
    setTimeout(() => {
      setResults(getSuggestions(from, to));
      setSearching(false);
      setSearched(true);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 500);
  };

  const popular = popularDestinationIds.map((id) => destinationsList.find((d) => d.id === id)).filter(Boolean);

  const renderDropdown = (items, onSelect) => (
    <motion.div className={styles.dropdown}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      {items.map(d => (
        <button key={d.id} type="button" className={styles.dropdownItem}
          onClick={() => onSelect(d)}
          onMouseDown={e => e.preventDefault()}
        >
          <span className={styles.dropdownDot} style={{ background: d.color }} />
          <span>{d[lang]}</span>
        </button>
      ))}
    </motion.div>
  );

  return (
    <main>
      <Navbar />

      {/* ============================
          HERO + SEARCH
      ============================ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroParticles}>
          {particles.map((p, i) => (
            <motion.div key={i} className={styles.particle}
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            />
          ))}
        </div>
        <div className={styles.heroOverlay} />
        <motion.div className={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span className={styles.heroTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={16} /> {ct('planner.heroTag')}
          </motion.span>
          <h1 className={styles.heroTitle}>
            {ct('planner.heroTitle1')} <span className="gradient-text">{ct('planner.heroTitleAccent')}</span>
          </h1>
          <p className={styles.heroSub}>{ct('planner.heroSubtitle')}</p>
        </motion.div>

        <motion.div className={styles.searchCard}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className={styles.searchRow}>
            <div className={styles.searchField} ref={fromRef}>
              <label className={styles.fieldLabel} htmlFor="planner-from">
                <Plane size={14} className={styles.fieldIcon} />
                {ct('planner.from')}
              </label>
              <input
                id="planner-from"
                value={from}
                onChange={e => updateFrom(e.target.value)}
                onFocus={() => setFocusField("from")}
                placeholder={ct('planner.fromPlaceholder')}
                className={styles.fieldInput}
                autoComplete="off"
              />
              <AnimatePresence>
                {focusField === "from" && fromSuggestions.length > 0 && renderDropdown(fromSuggestions, selectFrom)}
              </AnimatePresence>
            </div>

            <div className={styles.swapIcon}>
              <ArrowIcon size={18} />
            </div>

            <div className={styles.searchField} ref={toRef}>
              <label className={styles.fieldLabel} htmlFor="planner-to">
                <MapPin size={14} className={styles.fieldIcon} />
                {ct('planner.to')}
              </label>
              <input
                id="planner-to"
                value={to}
                onChange={e => updateTo(e.target.value)}
                onFocus={() => setFocusField("to")}
                onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                placeholder={ct('planner.toPlaceholder')}
                className={styles.fieldInput}
                autoComplete="off"
              />
              <AnimatePresence>
                {focusField === "to" && toSuggestions.length > 0 && renderDropdown(toSuggestions, selectTo)}
              </AnimatePresence>
            </div>

            <motion.button className={styles.searchBtn}
              id="planner-search"
              type="button"
              onClick={handleSearch}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={searching}
            >
              {searching ? <Loader2 size={20} className={styles.spin} /> : <Search size={20} />}
              {ct('planner.searchBtn')}
            </motion.button>
          </div>

          <div className={styles.popularRow}>
            <span className={styles.popularLabel}>{ct('planner.popular')}</span>
            <div className={styles.popularTags}>
              {popular.map((d) => (
                <button key={d.id} type="button" className={styles.popularTag} onClick={() => setTo(d[lang])}>
                  {d[lang]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ============================
          RESULTS (from the catalogue)
      ============================ */}
      {(searched || searching) && (
        <section className={styles.resultsSection} ref={resultsRef}>
          <div className="container">
            {searching ? (
              <div className={styles.loadingState}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                  <Compass size={48} className={styles.loadingIcon} />
                </motion.div>
                <motion.p className={styles.loadingText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  {ct('planner.searching')}
                </motion.p>
              </div>
            ) : (
              <>
                <motion.div className={styles.resultsHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2>{ct('planner.resultsTitle')}</h2>
                  <p>{results.matched ? ct('planner.resultsSubtitle') : ct('planner.noMatch')}</p>
                </motion.div>
                <div className={styles.resultsGrid} data-testid="planner-results">
                  {results.items.map((item, i) => (
                    <motion.div key={`${item.kind}-${item.id}`} className={styles.resultCard} data-testid="planner-result"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      whileHover={{ y: -8 }}
                    >
                      <div className={styles.resultImage}>
                        <SmartImage src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                        <div className={styles.resultBadge}>
                          <span>{item.destination}</span>
                        </div>
                      </div>
                      <div className={styles.resultBody}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <div className={styles.resultFooter}>
                          <div className={styles.resultPrice}>
                            <span className={styles.priceLabel}>{ct('planner.fromPrice')}</span>
                            <span className={styles.priceValue}>
                              {item.price > 0 ? `${item.price.toLocaleString()} ${item.currency}` : t('common.priceOnRequest')}
                            </span>
                          </div>
                          <Link href={item.href} className={styles.resultBtn}>
                            {ct('planner.exploreBtn')} <ArrowIcon size={16} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ============================
          TRAVEL CATEGORIES
      ============================ */}
      <section className={`section ${styles.categoriesSection}`}>
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.categoriesTag')}</span>
            <h2 className="section-title">
              {ct('planner.categoriesTitle1')}<span className="gradient-text">{ct('planner.categoriesTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.categoriesSubtitle')}</p>
          </motion.div>

          <div className={styles.catGrid}>
            {categoriesData.map((cat, i) => (
              <motion.div key={cat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link href={cat.href} className={styles.catCard} lang="en" dir="auto" style={{ height: "100%" }}>
                  <div className={styles.catIconWrap} style={{ background: cat.gradient }}>
                    {cat.icon}
                  </div>
                  <h3 className={styles.catTitle}>{cat.title}</h3>
                  <p className={styles.catDesc}>{cat.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          SPOTLIGHT DESTINATIONS
      ============================ */}
      <section className="section section-alt" id="spotlight">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.spotlightTag')}</span>
            <h2 className="section-title">
              {ct('planner.spotlightTitle1')}<span className="gradient-text">{ct('planner.spotlightTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.spotlightSubtitle')}</p>
          </motion.div>

          <div className={styles.spotlightGrid}>
            {spotlightData.map((spot, i) => {
              const trip = tripFor(spot.title);
              return (
                <motion.div key={spot.id} className={styles.spotlightCard}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                >
                  <div className={`${styles.spotlightImage} ${i % 2 === 1 ? styles.spotlightImageRight : ""}`}>
                    <SmartImage src={spot.image} alt={spot.title} fill sizes="(max-width: 768px) 100vw, 50vw" />
                    <div className={styles.spotlightImageOverlay} />
                    <div className={styles.spotlightTagBadge}>
                      <MapPin size={12} /> {spot.title}
                    </div>
                  </div>
                  <div className={styles.spotlightContent} lang="en" dir="auto">
                    <h3>{spot.title}</h3>
                    <p>{spot.desc}</p>
                    <Link href={trip ? `/trips/${trip.id}` : "/trips"} className="btn-primary"
                      style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {ct('planner.travelNow')} <ArrowIcon size={18} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================
          SCENIC ROUTES
      ============================ */}
      <section className={styles.panoramaSection}>
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.panoramaTag')}</span>
            <h2 className="section-title">
              {ct('planner.panoramaTitle1')}<span className="gradient-text">{ct('planner.panoramaTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.panoramaSubtitle')}</p>
          </motion.div>

          <div className={styles.panoramaGrid}>
            {scenicRoutesData.map((r, i) => (
              <motion.div key={r.id} className={styles.panoramaCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.01 }}
              >
                <div className={styles.panoramaImage}>
                  <SmartImage src={r.image} alt={r.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className={styles.panoramaOverlay} />
                  <div className={styles.panoramaRouteLine}>
                    {Array.from({ length: r.stops }).map((_, j) => (
                      <motion.div key={j} className={styles.panoramaStop}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                      />
                    ))}
                  </div>
                  <div className={styles.panoramaBadge} style={{ background: r.color }}>
                    <Route size={12} /> {r.stops} {ct('planner.panoramaStops')}
                  </div>
                </div>
                <div className={styles.panoramaBody}>
                  <h3 lang="en" dir="auto">{r.title}</h3>
                  <p lang="en" dir="auto">{r.desc}</p>
                  <div className={styles.panoramaMeta}>
                    <div className={styles.panoramaMetaItem}>
                      <Clock size={14} />
                      <span>{r.days} {ct('planner.panoramaDays')}</span>
                    </div>
                    <div className={styles.panoramaMetaItem}>
                      <MapPin size={14} />
                      <span>{r.stops} {ct('planner.panoramaStops')}</span>
                    </div>
                  </div>
                  <Link href="/contact" className={styles.panoramaBtn} style={{ borderColor: r.color, color: r.color }}>
                    {ct('planner.panoramaDiscover')} <ArrowIcon size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
