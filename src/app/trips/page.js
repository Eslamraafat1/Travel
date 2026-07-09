"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Clock, Users, Filter } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import TripCard from "@/components/TripCard/TripCard";
import { getAllTrips } from "@/lib/api/trips";
import { mockTripTypes } from "@/lib/mockData/trips";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./trips.module.css";

export default function TripsPage() {
  const { t, lang } = useLanguage();
  const durations = lang === "ar" ? [
    { id: "all", label: "كل المدد" },
    { id: "short", label: "أقل من 5 أيام" },
    { id: "medium", label: "5-7 أيام" },
    { id: "long", label: "أكثر من 7 أيام" },
  ] : [
    { id: "all", label: "All durations" },
    { id: "short", label: "Under 5 days" },
    { id: "medium", label: "5-7 days" },
    { id: "long", label: "Over 7 days" },
  ];
  const [trips, setTrips] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeType, setActiveType] = useState("all");
  const [activeDuration, setActiveDuration] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(30000);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllTrips("all", lang);
        setTrips(data);
        setFiltered(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang]);

  useEffect(() => {
    let result = [...trips];

    if (activeType !== "all") result = result.filter((t) => t.type === activeType);

    if (activeDuration !== "all") {
      result = result.filter((t) => {
        const days = parseInt(t.duration);
        if (activeDuration === "short") return days < 5;
        if (activeDuration === "medium") return days >= 5 && days <= 7;
        if (activeDuration === "long") return days > 7;
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.title.includes(q) || t.destination.includes(q)
      );
    }

    result = result.filter((t) => t.price <= priceRange);

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "seats") result.sort((a, b) => a.availableSeats - b.availableSeats);

    setFiltered(result);
  }, [trips, activeType, activeDuration, searchQuery, priceRange, sortBy]);

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('pages.trips.tag')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t('pages.trips.title')} <span className="gradient-text-blue">{t('pages.trips.titleAccent')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('pages.trips.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Main Layout */}
      <section className={styles.mainSection}>
        <div className={styles.mainContainer}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <div className={styles.filterBox}>
              <h3 className={styles.filterTitle}><Filter size={16} /> {t('pages.trips.filters.title')}</h3>

              {/* Search */}
              <div className={styles.filterGroup}>
                <label>{t('pages.trips.filters.search')}</label>
                <div className={styles.searchBox}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    id="trips-search"
                    type="text"
                    placeholder={t('pages.trips.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              {/* Trip Type */}
              <div className={styles.filterGroup}>
                <label>{t('pages.trips.filters.type')}</label>
                <div className={styles.typeButtons}>
                  {mockTripTypes.map((type) => (
                    <button
                      key={type.id}
                      id={`trip-type-${type.id}`}
                      className={`${styles.typeBtn} ${activeType === type.id ? styles.typeActive : ""}`}
                      onClick={() => setActiveType(type.id)}
                    >
                      {lang === "ar" ? type.label : type.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className={styles.filterGroup}>
                <label>{t('pages.trips.filters.duration')}</label>
                <div className={styles.typeButtons}>
                  {durations.map((d) => (
                    <button
                      key={d.id}
                      id={`trip-dur-${d.id}`}
                      className={`${styles.typeBtn} ${activeDuration === d.id ? styles.typeActive : ""}`}
                      onClick={() => setActiveDuration(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className={styles.filterGroup}>
                <label>
                  {t('pages.trips.filters.priceRange')} <span className={styles.priceValue}>{priceRange.toLocaleString()} {t('common.currency')}</span>
                </label>
                <input
                  id="trips-price-range"
                  type="range"
                  min="1000"
                  max="30000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <div className={styles.rangeLabels}>
                  <span>1,000</span>
                  <span>30,000</span>
                </div>
              </div>

              {/* Sort */}
              <div className={styles.filterGroup}>
                <label>{t('pages.trips.filters.sortBy')}</label>
                <select
                  id="trips-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="default">{t('pages.trips.filters.default')}</option>
                  <option value="price-asc">{t('pages.trips.filters.priceAsc')}</option>
                  <option value="price-desc">{t('pages.trips.filters.priceDesc')}</option>
                  <option value="rating">{t('pages.trips.filters.rating')}</option>
                  <option value="seats">{t('pages.trips.filters.seats')}</option>
                </select>
              </div>

              {/* Reset */}
              <button
                id="trips-reset-filters"
                className={styles.resetBtn}
                onClick={() => {
                  setActiveType("all");
                  setActiveDuration("all");
                  setSearchQuery("");
                  setPriceRange(30000);
                  setSortBy("default");
                }}
              >
                {t('pages.trips.filters.reset')}
              </button>
            </div>
          </aside>

          {/* Trips Grid */}
          <div className={styles.tripsContent}>
            <div className={styles.tripsHeader}>
              <p className={styles.resultsCount}>
                {loading ? t('pages.trips.loading') : t('pages.trips.resultsCount', { count: filtered.length })}
              </p>
            </div>

            {loading ? (
              <div className={styles.grid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ borderRadius: "20px", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <div className="skeleton" style={{ height: "200px" }} />
                    <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div className="skeleton" style={{ height: "20px", width: "60%", borderRadius: "8px" }} />
                      <div className="skeleton" style={{ height: "16px", borderRadius: "8px" }} />
                      <div className="skeleton" style={{ height: "38px", borderRadius: "50px", marginTop: "8px" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span>🔍</span>
                <h3>{t('pages.trips.emptyTitle')}</h3>
                <p>{t('pages.trips.emptyDesc')}</p>
              </motion.div>
            ) : (
              <div className={styles.grid}>
                <AnimatePresence>
                  {filtered.map((trip, i) => (
                    <TripCard key={trip.id} trip={trip} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
