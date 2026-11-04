"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PackageCard from "@/components/PackageCard/PackageCard";
import { getAllPackages } from "@/lib/api/packages";
import { mockCategories } from "@/lib/mockData/packages";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./packages.module.css";

export default function PackagesPage() {
  const { t, lang } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllPackages("all", lang);
        setPackages(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang]);

  // Derived state: recomputed when the data or a filter changes.
  const filtered = useMemo(() => {
    let result = [...packages];

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.destination?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "duration") result.sort((a, b) => (a.durationDays ?? parseInt(a.duration)) - (b.durationDays ?? parseInt(b.duration)));

    return result;
  }, [packages, activeCategory, searchQuery, sortBy]);

  return (
    <main>
      <Navbar />

      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('pages.packages.tag')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('pages.packages.title')} <span className="gradient-text">{t('pages.packages.titleAccent')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('pages.packages.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Filters Bar */}
      <section className={styles.filtersSection}>
        <div className="container">
          <div className={styles.filtersBar}>
            {/* Search */}
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                id="packages-search"
                aria-label={t('pages.packages.searchPlaceholder')}
                type="text"
                placeholder={t('pages.packages.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Category Tabs */}
            <div className={styles.categoryTabs}>
              {mockCategories.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  type="button"
                  aria-pressed={activeCategory === cat.id}
                  className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catActive : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {lang === "ar" ? cat.label : cat.labelEn}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className={styles.sortBox}>
              <SlidersHorizontal size={16} />
              <select
                id="packages-sort"
                aria-label="Sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="default">{t('pages.packages.filters.default')}</option>
                <option value="price-asc">{t('pages.packages.filters.priceAsc')}</option>
                <option value="price-desc">{t('pages.packages.filters.priceDesc')}</option>
                <option value="duration">{t('pages.packages.filters.duration')}</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className={styles.resultsCount}>
            {loading ? t('pages.trips.loading') : t('pages.packages.resultsCount', { count: filtered.length })}
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className={styles.packagesSection}>
        <div className="container">
          {loading ? (
            <div className={styles.grid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ borderRadius: "20px", overflow: "hidden", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="skeleton" style={{ height: "220px" }} />
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="skeleton" style={{ height: "22px", width: "65%", borderRadius: "8px" }} />
                    <div className="skeleton" style={{ height: "16px", borderRadius: "8px" }} />
                    <div className="skeleton" style={{ height: "40px", borderRadius: "50px", marginTop: "8px" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              className={styles.empty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className={styles.emptyIcon}>🔍</span>
              <h3>{t('pages.packages.emptyTitle')}</h3>
              <p>{t('pages.packages.emptyDesc')}</p>
            </motion.div>
          ) : (
            <motion.div
              className={styles.grid}
              layout
            >
              <AnimatePresence>
                {filtered.map((pkg, i) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
