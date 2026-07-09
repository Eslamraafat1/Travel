"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, MapPin, Package, Globe, Plus, Edit3, Trash2, X, Image, Star, Users, Calendar, CheckCircle, TrendingUp, ChevronDown, Compass } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { mockTrips } from "@/lib/mockData/trips";
import { mockPackages, mockCategories } from "@/lib/mockData/packages";
import { useLanguage } from "@/context/LanguageContext";
import { ar } from "@/locales/ar";
import { en } from "@/locales/en";
import { getStoredTrips, setStoredTrips, getStoredPackages, setStoredPackages } from "@/lib/adminStore";
import { getContentOverrides, setContentOverrides } from "@/lib/contentStore";
import styles from "./dashboard.module.css";

const tabs = [
  { id: "overview", icon: <LayoutDashboard size={18} /> },
  { id: "trips", icon: <MapPin size={18} /> },
  { id: "packages", icon: <Package size={18} /> },
  { id: "planner", icon: <Compass size={18} /> },
  { id: "content", icon: <Globe size={18} /> },
];

const emptyTrip = {
  id: 0, title: "", titleEn: "", description: "", descriptionEn: "",
  destination: "", destinationEn: "", duration: "", durationEn: "",
  price: "", currency: "EGP", rating: 4.5, reviewCount: 0,
  image: "", gallery: [], type: "beach", typeEn: "Beach",
  departureDate: "", availableSeats: 10, totalSeats: 20,
  highlights: [], highlightsEn: [], difficulty: "سهل", difficultyEn: "Easy",
  guide: "", guideEn: "", meetingPoint: "", meetingPointEn: "",
  included: [], includedEn: [], excluded: [], excludedEn: [],
  requirements: [], requirementsEn: [], faqs: [], faqsEn: [],
};

const emptyPackage = {
  id: 0, title: "", titleEn: "", description: "", descriptionEn: "",
  destination: "", destinationEn: "", duration: "", durationEn: "",
  price: "", currency: "EGP", rating: 4.5, reviewCount: 0,
  image: "", gallery: [], badge: "", badgeEn: "",
  includes: [], includesEn: [], itinerary: [], itineraryEn: [],
  category: "beach",
};

export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const [activeTab, setActiveTab] = useState("overview");
  const [trips, setTrips] = useState([]);
  const [packages, setPkgs] = useState([]);
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [content, setContent] = useState({
    hero: { slides: [{ tag: "", title: "", titleAccent: "", sub: "" }, { tag: "", title: "", titleAccent: "", sub: "" }, { tag: "", title: "", titleAccent: "", sub: "" }] },
    home: {
      packages: { tag: "", title1: "", titleAccent: "", subtitle: "", viewAll: "" },
      whyUs: { tag: "", title1: "", titleAccent: "", title2: "", subtitle: "", features: [{ title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }, { title: "", desc: "" }] },
      trips: { tag: "", titleAccent: "", title2: "", subtitle: "", viewAll: "" },
      stats: { destinations: 120, travelers: 50000, years: 15 },
      howItWorks: { tag: "", title1: "", titleAccent: "", subtitle: "", steps: [{ num: "01", title: "", desc: "" }, { num: "02", title: "", desc: "" }, { num: "03", title: "", desc: "" }] },
      gallery: { tag: "", title1: "", titleAccent: "", subtitle: "", items: [{ label: "", src: "" }, { label: "", src: "" }, { label: "", src: "" }, { label: "", src: "" }, { label: "", src: "" }] },
      testimonials: { tag: "", title1: "", titleAccent: "", items: [{ name: "", role: "", text: "", destination: "" }, { name: "", role: "", text: "", destination: "" }, { name: "", role: "", text: "", destination: "" }, { name: "", role: "", text: "", destination: "" }] },
      video: { title: "", subtitle: "" },
      apps: { tag: "", title1: "", titleAccent: "", subtitle: "", feature1: "", feature2: "", feature3: "", downloadOn: "", appStore: "", getItOn: "", googlePlay: "", users: "" },
      partners: { tag: "", title1: "", titleAccent: "" },
      newsletter: { title1: "", titleAccent: "", subtitle: "", placeholder: "", btn: "" },
    },
    planner: {
      heroTag: "", heroTitle1: "", heroTitleAccent: "", heroSubtitle: "",
      from: "", to: "", fromPlaceholder: "", toPlaceholder: "",
      searchBtn: "", popular: "", searching: "",
      resultsTitle: "", resultsSubtitle: "", fromPrice: "", exploreBtn: "",
      destinationsTag: "", destinationsTitle1: "", destinationsTitleAccent: "", destinationsSubtitle: "",
    },
  });
  const [sectionsOpen, setSectionsOpen] = useState({});
  const [contentLang, setContentLang] = useState(lang);

  function getLocaleVal(keypath) {
    const locale = contentLang === "ar" ? ar : en;
    const keys = keypath.split(".");
    let val = locale;
    for (const k of keys) {
      if (val && val[k] !== undefined) val = val[k];
      else return "";
    }
    return typeof val === "string" ? val : val;
  }

  function loadContent(lng) {
    const saved = getContentOverrides(lng);
    const sh = saved.home || {};

    const def = (path, fallback) => {
      const v = getLocaleVal(path);
      return v || fallback;
    };

    // Helper: override or locale default
    const or = (savedVal, localePath) => {
      if (savedVal !== undefined && savedVal !== null && !(Array.isArray(savedVal) && savedVal.length === 0) && !(typeof savedVal === "object" && !Array.isArray(savedVal) && Object.keys(savedVal).length === 0)) {
        return savedVal;
      }
      const localeVal = getLocaleVal(localePath);
      return localeVal || savedVal;
    };

    const slides = or(saved.hero?.slides, "hero.slides");
    setContent({
      hero: { slides: Array.isArray(slides) ? slides : content.hero.slides },
      home: {
        packages: {
          tag: or(sh.packages?.tag, "home.packages.tag"),
          title1: or(sh.packages?.title1, "home.packages.title1"),
          titleAccent: or(sh.packages?.titleAccent, "home.packages.titleAccent"),
          subtitle: or(sh.packages?.subtitle, "home.packages.subtitle"),
          viewAll: or(sh.packages?.viewAll, "home.packages.viewAll"),
        },
        whyUs: {
          tag: or(sh.whyUs?.tag, "home.whyUs.tag"),
          title1: or(sh.whyUs?.title1, "home.whyUs.title1"),
          titleAccent: or(sh.whyUs?.titleAccent, "home.whyUs.titleAccent"),
          title2: or(sh.whyUs?.title2, "home.whyUs.title2"),
          subtitle: or(sh.whyUs?.subtitle, "home.whyUs.subtitle"),
          features: or(sh.whyUs?.features, "home.whyUs.features"),
        },
        trips: {
          tag: or(sh.trips?.tag, "home.trips.tag"),
          titleAccent: or(sh.trips?.titleAccent, "home.trips.titleAccent"),
          title2: or(sh.trips?.title2, "home.trips.title2"),
          subtitle: or(sh.trips?.subtitle, "home.trips.subtitle"),
          viewAll: or(sh.trips?.viewAll, "home.trips.viewAll"),
        },
        stats: {
          destinations: sh.stats?.destinations ?? 120,
          travelers: sh.stats?.travelers ?? 50000,
          years: sh.stats?.years ?? 15,
        },
        howItWorks: {
          tag: or(sh.howItWorks?.tag, "home.howItWorks.tag"),
          title1: or(sh.howItWorks?.title1, "home.howItWorks.title1"),
          titleAccent: or(sh.howItWorks?.titleAccent, "home.howItWorks.titleAccent"),
          subtitle: or(sh.howItWorks?.subtitle, "home.howItWorks.subtitle"),
          steps: or(sh.howItWorks?.steps, "home.howItWorks.steps"),
        },
        gallery: {
          tag: or(sh.gallery?.tag, "home.gallery.tag"),
          title1: or(sh.gallery?.title1, "home.gallery.title1"),
          titleAccent: or(sh.gallery?.titleAccent, "home.gallery.titleAccent"),
          subtitle: or(sh.gallery?.subtitle, "home.gallery.subtitle"),
          items: or(sh.gallery?.items, "home.gallery.items"),
        },
        testimonials: {
          tag: or(sh.testimonials?.tag, "home.testimonials.tag"),
          title1: or(sh.testimonials?.title1, "home.testimonials.title1"),
          titleAccent: or(sh.testimonials?.titleAccent, "home.testimonials.titleAccent"),
          items: or(sh.testimonials?.items, "home.testimonials.items"),
        },
        video: {
          title: or(sh.video?.title, "home.video.title"),
          subtitle: or(sh.video?.subtitle, "home.video.subtitle"),
        },
        apps: {
          tag: or(sh.apps?.tag, "home.apps.tag"),
          title1: or(sh.apps?.title1, "home.apps.title1"),
          titleAccent: or(sh.apps?.titleAccent, "home.apps.titleAccent"),
          subtitle: or(sh.apps?.subtitle, "home.apps.subtitle"),
          feature1: or(sh.apps?.feature1, "home.apps.feature1"),
          feature2: or(sh.apps?.feature2, "home.apps.feature2"),
          feature3: or(sh.apps?.feature3, "home.apps.feature3"),
          downloadOn: or(sh.apps?.downloadOn, "home.apps.downloadOn"),
          appStore: or(sh.apps?.appStore, "home.apps.appStore"),
          getItOn: or(sh.apps?.getItOn, "home.apps.getItOn"),
          googlePlay: or(sh.apps?.googlePlay, "home.apps.googlePlay"),
          users: or(sh.apps?.users, "home.apps.users"),
        },
        partners: {
          tag: or(sh.partners?.tag, "home.partners.tag"),
          title1: or(sh.partners?.title1, "home.partners.title1"),
          titleAccent: or(sh.partners?.titleAccent, "home.partners.titleAccent"),
        },
        newsletter: {
          title1: or(sh.newsletter?.title1, "home.newsletter.title1"),
          titleAccent: or(sh.newsletter?.titleAccent, "home.newsletter.titleAccent"),
          subtitle: or(sh.newsletter?.subtitle, "home.newsletter.subtitle"),
          placeholder: or(sh.newsletter?.placeholder, "home.newsletter.placeholder"),
          btn: or(sh.newsletter?.btn, "home.newsletter.btn"),
        },
      },
      planner: {
        heroTag: or(saved.planner?.heroTag, "planner.heroTag"),
        heroTitle1: or(saved.planner?.heroTitle1, "planner.heroTitle1"),
        heroTitleAccent: or(saved.planner?.heroTitleAccent, "planner.heroTitleAccent"),
        heroSubtitle: or(saved.planner?.heroSubtitle, "planner.heroSubtitle"),
        from: or(saved.planner?.from, "planner.from"),
        to: or(saved.planner?.to, "planner.to"),
        fromPlaceholder: or(saved.planner?.fromPlaceholder, "planner.fromPlaceholder"),
        toPlaceholder: or(saved.planner?.toPlaceholder, "planner.toPlaceholder"),
        searchBtn: or(saved.planner?.searchBtn, "planner.searchBtn"),
        popular: or(saved.planner?.popular, "planner.popular"),
        searching: or(saved.planner?.searching, "planner.searching"),
        resultsTitle: or(saved.planner?.resultsTitle, "planner.resultsTitle"),
        resultsSubtitle: or(saved.planner?.resultsSubtitle, "planner.resultsSubtitle"),
        fromPrice: or(saved.planner?.fromPrice, "planner.fromPrice"),
        exploreBtn: or(saved.planner?.exploreBtn, "planner.exploreBtn"),
        destinationsTag: or(saved.planner?.destinationsTag, "planner.destinationsTag"),
        destinationsTitle1: or(saved.planner?.destinationsTitle1, "planner.destinationsTitle1"),
        destinationsTitleAccent: or(saved.planner?.destinationsTitleAccent, "planner.destinationsTitleAccent"),
        destinationsSubtitle: or(saved.planner?.destinationsSubtitle, "planner.destinationsSubtitle"),
      },
    });
  }

  useEffect(() => {
    setTrips(getStoredTrips(mockTrips));
    setPkgs(getStoredPackages(mockPackages));
  }, []);

  useEffect(() => {
    loadContent(contentLang);
  }, [contentLang]);

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Trips CRUD
  const saveTrip = (data) => {
    let updated;
    if (editItem) {
      updated = trips.map(t => t.id === data.id ? { ...t, ...data } : t);
      showToast(t('dashboard.successEdit'));
    } else {
      data.id = Math.max(...trips.map(t => t.id), 0) + 1;
      if (!data.image) data.image = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800";
      updated = [...trips, data];
      showToast(t('dashboard.successAdd'));
    }
    setTrips(updated);
    setStoredTrips(updated);
    setModal(null);
    setEditItem(null);
  };

  const deleteTrip = (id) => {
    const updated = trips.filter(t => t.id !== id);
    setTrips(updated);
    setStoredTrips(updated);
    showToast(t('dashboard.successDelete'));
  };

  // Packages CRUD
  const savePackage = (data) => {
    let updated;
    if (editItem) {
      updated = packages.map(p => p.id === data.id ? { ...p, ...data } : p);
      showToast(t('dashboard.successEdit'));
    } else {
      data.id = Math.max(...packages.map(p => p.id), 0) + 1;
      if (!data.image) data.image = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800";
      updated = [...packages, data];
      showToast(t('dashboard.successAdd'));
    }
    setPkgs(updated);
    setStoredPackages(updated);
    setModal(null);
    setEditItem(null);
  };

  const deletePackage = (id) => {
    const updated = packages.filter(p => p.id !== id);
    setPkgs(updated);
    setStoredPackages(updated);
    showToast(t('dashboard.successDelete'));
  };

  const openModal = (type, item = null) => {
    setEditItem(item);
    setModal(type);
  };

  const saveContent = () => {
    setContentOverrides(contentLang, { hero: content.hero, home: content.home, planner: content.planner });
    showToast(t('dashboard.successEdit'));
    try { window.dispatchEvent(new Event("storage")); } catch {}
  };

  return (
    <main className={styles.page}>
      <Navbar />

      <div className={styles.dashLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>
            <LayoutDashboard size={20} /> {t('dashboard.title')}
          </div>
          <nav className={styles.sidebarNav}>
            {tabs.map(tab => (
              <button key={tab.id} className={`${styles.sidebarLink} ${activeTab === tab.id ? styles.sidebarLinkActive : ""}`}
                onClick={() => setActiveTab(tab.id)}>
                <span className={styles.sidebarIcon}>{tab.icon}</span>
                {t(`dashboard.${tab.id === "overview" ? "overview" : tab.id === "trips" ? "manageTrips" : tab.id === "packages" ? "managePackages" : tab.id === "planner" ? "planner" : "siteContent"}`)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className={styles.main}>
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.pageHeader}>
                <h1>{t('dashboard.overview')}</h1>
                <p>{t('dashboard.dashboardDesc')}</p>
              </div>
              <div className={styles.statsGrid}>
                {[
                  { icon: <MapPin size={22} />, color: "#ff6b35", bg: "rgba(255,107,53,0.15)", label: t('dashboard.totalTrips'), value: trips.length },
                  { icon: <Package size={22} />, color: "#00d4ff", bg: "rgba(0,212,255,0.15)", label: t('dashboard.totalPackages'), value: packages.length },
                  { icon: <Users size={22} />, color: "#22c55e", bg: "rgba(34,197,94,0.15)", label: t('dashboard.totalUsers'), value: "12.4K" },
                  { icon: <TrendingUp size={22} />, color: "#a855f7", bg: "rgba(168,85,247,0.15)", label: t('dashboard.activeBookings'), value: "342" },
                ].map((s, i) => (
                  <div key={i} className={styles.statCard}>
                    <div className={styles.statIconBox} style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                    <div>
                      <div className={styles.statNumber}>{s.value}</div>
                      <div className={styles.statLabel}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TRIPS */}
          {activeTab === "trips" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.sectionHeader}>
                <h2>{t('dashboard.manageTrips')}</h2>
                <button className={styles.addBtn} onClick={() => openModal("trip")}>
                  <Plus size={18} /> {t('dashboard.addTrip')}
                </button>
              </div>
              <div className={styles.tableWrapper}>
                {trips.length === 0 ? (
                  <div className={styles.emptyState}><MapPin size={40} /><p>{t('dashboard.noTrips')}</p></div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th></th>
                        <th>{t('dashboard.titleField')}</th>
                        <th>{t('dashboard.destinationField')}</th>
                        <th>{t('dashboard.priceField')}</th>
                        <th>{t('dashboard.durationField')}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.map(trip => (
                        <tr key={trip.id}>
                          <td><img src={trip.image} alt="" className={styles.tableImg} /></td>
                          <td style={{ fontWeight: 600 }}>{isRtl ? trip.title : trip.titleEn || trip.title}</td>
                          <td>{isRtl ? trip.destination : trip.destinationEn || trip.destination}</td>
                          <td>{trip.price.toLocaleString()} {trip.currency}</td>
                          <td>{isRtl ? trip.duration : trip.durationEn || trip.duration}</td>
                          <td>
                            <div className={styles.tableActions}>
                              <button className={styles.editBtn} onClick={() => openModal("trip", trip)}><Edit3 size={14} /></button>
                              <button className={styles.deleteBtn} onClick={() => { if (confirm(t('dashboard.confirmDelete'))) deleteTrip(trip.id); }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {/* PACKAGES */}
          {activeTab === "packages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.sectionHeader}>
                <h2>{t('dashboard.managePackages')}</h2>
                <button className={styles.addBtn} onClick={() => openModal("package")}>
                  <Plus size={18} /> {t('dashboard.addPackage')}
                </button>
              </div>
              <div className={styles.tableWrapper}>
                {packages.length === 0 ? (
                  <div className={styles.emptyState}><Package size={40} /><p>{t('dashboard.noPackages')}</p></div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th></th>
                        <th>{t('dashboard.titleField')}</th>
                        <th>{t('dashboard.destinationField')}</th>
                        <th>{t('dashboard.priceField')}</th>
                        <th>{t('dashboard.durationField')}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map(pkg => (
                        <tr key={pkg.id}>
                          <td><img src={pkg.image} alt="" className={styles.tableImg} /></td>
                          <td style={{ fontWeight: 600 }}>{isRtl ? pkg.title : pkg.titleEn || pkg.title}</td>
                          <td>{isRtl ? pkg.destination : pkg.destinationEn || pkg.destination}</td>
                          <td>{pkg.price.toLocaleString()} {pkg.currency}</td>
                          <td>{isRtl ? pkg.duration : pkg.durationEn || pkg.duration}</td>
                          <td>
                            <div className={styles.tableActions}>
                              <button className={styles.editBtn} onClick={() => openModal("package", pkg)}><Edit3 size={14} /></button>
                              <button className={styles.deleteBtn} onClick={() => { if (confirm(t('dashboard.confirmDelete'))) deletePackage(pkg.id); }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {/* PLANNER */}
          {activeTab === "planner" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.pageHeader}>
                <h1>{t('dashboard.plannerTitle')}</h1>
                <p>{t('dashboard.plannerDesc')}</p>
              </div>
              <Collapsible title={t('dashboard.heroSection')} id="plHero" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <div className={styles.contentGrid}>
                    <Field label="Hero Tag" full value={content.planner?.heroTag ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, heroTag: v } }))} />
                    <Field label="Hero Title 1" value={content.planner?.heroTitle1 ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, heroTitle1: v } }))} />
                    <Field label="Hero Title Accent" value={content.planner?.heroTitleAccent ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, heroTitleAccent: v } }))} />
                    <Field label="Hero Subtitle" full value={content.planner?.heroSubtitle ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, heroSubtitle: v } }))} />
                    <Field label="From" value={content.planner?.from ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, from: v } }))} />
                    <Field label="To" value={content.planner?.to ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, to: v } }))} />
                    <Field label="From Placeholder" value={content.planner?.fromPlaceholder ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, fromPlaceholder: v } }))} />
                    <Field label="To Placeholder" value={content.planner?.toPlaceholder ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, toPlaceholder: v } }))} />
                    <Field label="Search Button" value={content.planner?.searchBtn ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, searchBtn: v } }))} />
                    <Field label="Popular" value={content.planner?.popular ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, popular: v } }))} />
                    <Field label="Searching" full value={content.planner?.searching ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, searching: v } }))} />
                    <Field label="Results Title" full value={content.planner?.resultsTitle ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, resultsTitle: v } }))} />
                    <Field label="Results Subtitle" full value={content.planner?.resultsSubtitle ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, resultsSubtitle: v } }))} />
                    <Field label="From Price" value={content.planner?.fromPrice ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, fromPrice: v } }))} />
                    <Field label="Explore Button" value={content.planner?.exploreBtn ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, exploreBtn: v } }))} />
                    <Field label="Destinations Tag" full value={content.planner?.destinationsTag ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, destinationsTag: v } }))} />
                    <Field label="Destinations Title 1" value={content.planner?.destinationsTitle1 ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, destinationsTitle1: v } }))} />
                    <Field label="Destinations Title Accent" value={content.planner?.destinationsTitleAccent ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, destinationsTitleAccent: v } }))} />
                    <Field label="Destinations Subtitle" full value={content.planner?.destinationsSubtitle ?? ""} onChange={v => setContent(c => ({ ...c, planner: { ...c.planner, destinationsSubtitle: v } }))} />
                  </div>
                </div>
              </Collapsible>
              <button className={styles.addBtn} style={{ marginTop: "12px" }}
                onClick={() => { setContentOverrides(contentLang, { ...getContentOverrides(contentLang), planner: content.planner }); showToast(t('dashboard.successEdit')); try { window.dispatchEvent(new Event("storage")); } catch {} }}>
                {t('dashboard.save')}
              </button>
            </motion.div>
          )}

          {/* CONTENT */}
          {activeTab === "content" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.pageHeader}>
                <h1>{t('dashboard.editContent')}</h1>
                <p>{t('dashboard.contentDesc')}</p>
                <div className={styles.langToggle}>
                  <button className={`${styles.langBtn} ${contentLang === "ar" ? styles.langBtnActive : ""}`} onClick={() => setContentLang("ar")}>العربية</button>
                  <button className={`${styles.langBtn} ${contentLang === "en" ? styles.langBtnActive : ""}`} onClick={() => setContentLang("en")}>English</button>
                </div>
              </div>

              {/* ── Hero ── */}
              <Collapsible title="Hero Slides" id="hero" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                {content.hero.slides.map((slide, i) => (
                  <div key={i} className={styles.contentCard}>
                    <h4>{t('dashboard.heroSlide')} {i + 1}</h4>
                    <div className={styles.contentGrid}>
                      <Field label="Tag" value={slide.tag} onChange={v => { const s = [...content.hero.slides]; s[i] = { ...s[i], tag: v }; setContent(c => ({ ...c, hero: { ...c.hero, slides: s } })); }} />
                      <Field label="Title" value={slide.title} onChange={v => { const s = [...content.hero.slides]; s[i] = { ...s[i], title: v }; setContent(c => ({ ...c, hero: { ...c.hero, slides: s } })); }} />
                      <Field label="Title Accent" value={slide.titleAccent} onChange={v => { const s = [...content.hero.slides]; s[i] = { ...s[i], titleAccent: v }; setContent(c => ({ ...c, hero: { ...c.hero, slides: s } })); }} />
                      <Field label="Subtitle" full value={slide.sub} onChange={v => { const s = [...content.hero.slides]; s[i] = { ...s[i], sub: v }; setContent(c => ({ ...c, hero: { ...c.hero, slides: s } })); }} />
                    </div>
                  </div>
                ))}
              </Collapsible>

              {/* ── Packages Section ── */}
              <Collapsible title={t('dashboard.sectionHeaders')} id="packages" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <h4>Packages Section</h4>
                  <div className={styles.contentGrid}>
                    <Field label="Tag" value={content.home.packages.tag} onChange={v => setContent(c => ({ ...c, home: { ...c.home, packages: { ...c.home.packages, tag: v } } }))} />
                    <Field label="Title 1" value={content.home.packages.title1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, packages: { ...c.home.packages, title1: v } } }))} />
                    <Field label="Title Accent" value={content.home.packages.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, packages: { ...c.home.packages, titleAccent: v } } }))} />
                    <Field label="Subtitle" full value={content.home.packages.subtitle} onChange={v => setContent(c => ({ ...c, home: { ...c.home, packages: { ...c.home.packages, subtitle: v } } }))} />
                    <Field label="View All" value={content.home.packages.viewAll} onChange={v => setContent(c => ({ ...c, home: { ...c.home, packages: { ...c.home.packages, viewAll: v } } }))} />
                  </div>
                </div>
              </Collapsible>

              {/* ── Why Us Section ── */}
              <Collapsible title={t('dashboard.whyUsSection')} id="whyus" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <h4>Section Headers</h4>
                  <div className={styles.contentGrid}>
                    <Field label="Tag" value={content.home.whyUs.tag} onChange={v => setContent(c => ({ ...c, home: { ...c.home, whyUs: { ...c.home.whyUs, tag: v } } }))} />
                    <Field label="Title 1" value={content.home.whyUs.title1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, whyUs: { ...c.home.whyUs, title1: v } } }))} />
                    <Field label="Title Accent" value={content.home.whyUs.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, whyUs: { ...c.home.whyUs, titleAccent: v } } }))} />
                    <Field label="Title 2" value={content.home.whyUs.title2} onChange={v => setContent(c => ({ ...c, home: { ...c.home, whyUs: { ...c.home.whyUs, title2: v } } }))} />
                    <Field label="Subtitle" full value={content.home.whyUs.subtitle} onChange={v => setContent(c => ({ ...c, home: { ...c.home, whyUs: { ...c.home.whyUs, subtitle: v } } }))} />
                  </div>
                </div>
                {content.home.whyUs.features.map((feat, i) => (
                  <div key={i} className={styles.contentCard}>
                    <h4>{t('dashboard.featureNum')} {i + 1}</h4>
                    <div className={styles.contentGrid}>
                      <Field label={t('dashboard.titleField')} value={feat.title} onChange={v => { const f = [...content.home.whyUs.features]; f[i] = { ...f[i], title: v }; setContent(c => ({ ...c, home: { ...c.home, whyUs: { ...c.home.whyUs, features: f } } })); }} />
                      <Field label={t('dashboard.descriptionField')} full value={feat.desc} textarea onChange={v => { const f = [...content.home.whyUs.features]; f[i] = { ...f[i], desc: v }; setContent(c => ({ ...c, home: { ...c.home, whyUs: { ...c.home.whyUs, features: f } } })); }} />
                    </div>
                  </div>
                ))}
              </Collapsible>

              {/* ── Trips Section ── */}
              <Collapsible title={t('dashboard.tripsSection')} id="tripsSec" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <h4>Trips Section Headers</h4>
                  <div className={styles.contentGrid}>
                    <Field label="Tag" value={content.home.trips.tag} onChange={v => setContent(c => ({ ...c, home: { ...c.home, trips: { ...c.home.trips, tag: v } } }))} />
                    <Field label="Title Accent" value={content.home.trips.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, trips: { ...c.home.trips, titleAccent: v } } }))} />
                    <Field label="Title 2" value={content.home.trips.title2} onChange={v => setContent(c => ({ ...c, home: { ...c.home, trips: { ...c.home.trips, title2: v } } }))} />
                    <Field label="Subtitle" full value={content.home.trips.subtitle} onChange={v => setContent(c => ({ ...c, home: { ...c.home, trips: { ...c.home.trips, subtitle: v } } }))} />
                    <Field label="View All" value={content.home.trips.viewAll} onChange={v => setContent(c => ({ ...c, home: { ...c.home, trips: { ...c.home.trips, viewAll: v } } }))} />
                  </div>
                </div>
              </Collapsible>

              {/* ── Stats ── */}
              <Collapsible title={t('dashboard.stats')} id="stats" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <div className={styles.contentGrid}>
                    <Field label={t('dashboard.destinationField')} type="number" value={content.home.stats.destinations} onChange={v => setContent(c => ({ ...c, home: { ...c.home, stats: { ...c.home.stats, destinations: Number(v) } } }))} />
                    <Field label={t('dashboard.totalUsers')} type="number" value={content.home.stats.travelers} onChange={v => setContent(c => ({ ...c, home: { ...c.home, stats: { ...c.home.stats, travelers: Number(v) } } }))} />
                    <Field label={t('dashboard.experience')} type="number" value={content.home.stats.years} onChange={v => setContent(c => ({ ...c, home: { ...c.home, stats: { ...c.home.stats, years: Number(v) } } }))} />
                  </div>
                </div>
              </Collapsible>

              {/* ── How It Works ── */}
              <Collapsible title={t('dashboard.steps')} id="steps" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <h4>Section Headers</h4>
                  <div className={styles.contentGrid}>
                    <Field label="Tag" value={content.home.howItWorks.tag} onChange={v => setContent(c => ({ ...c, home: { ...c.home, howItWorks: { ...c.home.howItWorks, tag: v } } }))} />
                    <Field label="Title 1" value={content.home.howItWorks.title1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, howItWorks: { ...c.home.howItWorks, title1: v } } }))} />
                    <Field label="Title Accent" value={content.home.howItWorks.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, howItWorks: { ...c.home.howItWorks, titleAccent: v } } }))} />
                    <Field label="Subtitle" full value={content.home.howItWorks.subtitle} onChange={v => setContent(c => ({ ...c, home: { ...c.home, howItWorks: { ...c.home.howItWorks, subtitle: v } } }))} />
                  </div>
                </div>
                {content.home.howItWorks.steps.map((step, i) => (
                  <div key={i} className={styles.contentCard}>
                    <h4>{t('dashboard.stepNum')} {i + 1}</h4>
                    <div className={styles.contentGrid}>
                      <Field label="Number" value={step.num} onChange={v => { const s = [...content.home.howItWorks.steps]; s[i] = { ...s[i], num: v }; setContent(c => ({ ...c, home: { ...c.home, howItWorks: { ...c.home.howItWorks, steps: s } } })); }} />
                      <Field label={t('dashboard.titleField')} value={step.title} onChange={v => { const s = [...content.home.howItWorks.steps]; s[i] = { ...s[i], title: v }; setContent(c => ({ ...c, home: { ...c.home, howItWorks: { ...c.home.howItWorks, steps: s } } })); }} />
                      <Field label={t('dashboard.descriptionField')} full textarea value={step.desc} onChange={v => { const s = [...content.home.howItWorks.steps]; s[i] = { ...s[i], desc: v }; setContent(c => ({ ...c, home: { ...c.home, howItWorks: { ...c.home.howItWorks, steps: s } } })); }} />
                    </div>
                  </div>
                ))}
              </Collapsible>

              {/* ── Gallery ── */}
              <Collapsible title={t('dashboard.gallery')} id="gallery" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <h4>Section Headers</h4>
                  <div className={styles.contentGrid}>
                    <Field label="Tag" value={content.home.gallery.tag} onChange={v => setContent(c => ({ ...c, home: { ...c.home, gallery: { ...c.home.gallery, tag: v } } }))} />
                    <Field label="Title 1" value={content.home.gallery.title1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, gallery: { ...c.home.gallery, title1: v } } }))} />
                    <Field label="Title Accent" value={content.home.gallery.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, gallery: { ...c.home.gallery, titleAccent: v } } }))} />
                    <Field label="Subtitle" full value={content.home.gallery.subtitle} onChange={v => setContent(c => ({ ...c, home: { ...c.home, gallery: { ...c.home.gallery, subtitle: v } } }))} />
                  </div>
                </div>
                {content.home.gallery.items.map((item, i) => (
                  <div key={i} className={styles.contentCard}>
                    <h4>{t('dashboard.galleryItemNum')} {i + 1}</h4>
                    <div className={styles.contentGrid}>
                      <Field label={t('dashboard.labelField')} value={item.label} onChange={v => { const g = [...content.home.gallery.items]; g[i] = { ...g[i], label: v }; setContent(c => ({ ...c, home: { ...c.home, gallery: { ...c.home.gallery, items: g } } })); }} />
                      <Field full label="Image URL" value={item.src} placeholder="https://..." onChange={v => { const g = [...content.home.gallery.items]; g[i] = { ...g[i], src: v }; setContent(c => ({ ...c, home: { ...c.home, gallery: { ...c.home.gallery, items: g } } })); }} />
                    </div>
                  </div>
                ))}
              </Collapsible>

              {/* ── Testimonials ── */}
              <Collapsible title={t('dashboard.testimonials')} id="testimonials" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <h4>Section Headers</h4>
                  <div className={styles.contentGrid}>
                    <Field label="Tag" value={content.home.testimonials.tag} onChange={v => setContent(c => ({ ...c, home: { ...c.home, testimonials: { ...c.home.testimonials, tag: v } } }))} />
                    <Field label="Title 1" value={content.home.testimonials.title1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, testimonials: { ...c.home.testimonials, title1: v } } }))} />
                    <Field label="Title Accent" value={content.home.testimonials.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, testimonials: { ...c.home.testimonials, titleAccent: v } } }))} />
                  </div>
                </div>
                {content.home.testimonials.items.map((item, i) => (
                  <div key={i} className={styles.contentCard}>
                    <h4>{t('dashboard.testimonialNum')} {i + 1}</h4>
                    <div className={styles.contentGrid}>
                      <Field label={t('dashboard.nameField')} value={item.name} onChange={v => { const it = [...content.home.testimonials.items]; it[i] = { ...it[i], name: v }; setContent(c => ({ ...c, home: { ...c.home, testimonials: { ...c.home.testimonials, items: it } } })); }} />
                      <Field label={t('dashboard.roleField')} value={item.role} onChange={v => { const it = [...content.home.testimonials.items]; it[i] = { ...it[i], role: v }; setContent(c => ({ ...c, home: { ...c.home, testimonials: { ...c.home.testimonials, items: it } } })); }} />
                      <Field full textarea label={t('dashboard.textField')} value={item.text} onChange={v => { const it = [...content.home.testimonials.items]; it[i] = { ...it[i], text: v }; setContent(c => ({ ...c, home: { ...c.home, testimonials: { ...c.home.testimonials, items: it } } })); }} />
                      <Field label={t('dashboard.destinationField')} value={item.destination} onChange={v => { const it = [...content.home.testimonials.items]; it[i] = { ...it[i], destination: v }; setContent(c => ({ ...c, home: { ...c.home, testimonials: { ...c.home.testimonials, items: it } } })); }} />
                    </div>
                  </div>
                ))}
              </Collapsible>

              {/* ── Video ── */}
              <Collapsible title={t('dashboard.videoSection')} id="video" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <div className={styles.contentGrid}>
                    <Field label="Title" full value={content.home.video.title} onChange={v => setContent(c => ({ ...c, home: { ...c.home, video: { ...c.home.video, title: v } } }))} />
                    <Field label="Subtitle" full value={content.home.video.subtitle} onChange={v => setContent(c => ({ ...c, home: { ...c.home, video: { ...c.home.video, subtitle: v } } }))} />
                  </div>
                </div>
              </Collapsible>

              {/* ── App Section ── */}
              <Collapsible title={t('dashboard.appSection')} id="apps" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <div className={styles.contentGrid}>
                    <Field label="Tag" value={content.home.apps.tag} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, tag: v } } }))} />
                    <Field label="Title 1" value={content.home.apps.title1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, title1: v } } }))} />
                    <Field label="Title Accent" value={content.home.apps.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, titleAccent: v } } }))} />
                    <Field label="Subtitle" full value={content.home.apps.subtitle} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, subtitle: v } } }))} />
                    <Field label="Feature 1" value={content.home.apps.feature1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, feature1: v } } }))} />
                    <Field label="Feature 2" value={content.home.apps.feature2} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, feature2: v } } }))} />
                    <Field label="Feature 3" value={content.home.apps.feature3} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, feature3: v } } }))} />
                    <Field label="Download On" value={content.home.apps.downloadOn} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, downloadOn: v } } }))} />
                    <Field label="App Store" value={content.home.apps.appStore} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, appStore: v } } }))} />
                    <Field label="Get It On" value={content.home.apps.getItOn} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, getItOn: v } } }))} />
                    <Field label="Google Play" value={content.home.apps.googlePlay} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, googlePlay: v } } }))} />
                    <Field label="Users" full value={content.home.apps.users} onChange={v => setContent(c => ({ ...c, home: { ...c.home, apps: { ...c.home.apps, users: v } } }))} />
                  </div>
                </div>
              </Collapsible>

              {/* ── Partners ── */}
              <Collapsible title={t('dashboard.partnersSection')} id="partners" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <h4>Section Headers</h4>
                  <div className={styles.contentGrid}>
                    <Field label="Tag" value={content.home.partners.tag} onChange={v => setContent(c => ({ ...c, home: { ...c.home, partners: { ...c.home.partners, tag: v } } }))} />
                    <Field label="Title 1" value={content.home.partners.title1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, partners: { ...c.home.partners, title1: v } } }))} />
                    <Field label="Title Accent" value={content.home.partners.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, partners: { ...c.home.partners, titleAccent: v } } }))} />
                  </div>
                </div>
              </Collapsible>

              {/* ── Newsletter ── */}
              <Collapsible title={t('dashboard.newsletterSection')} id="newsletter" sectionsOpen={sectionsOpen} setSectionsOpen={setSectionsOpen}>
                <div className={styles.contentCard}>
                  <div className={styles.contentGrid}>
                    <Field label="Title 1" value={content.home.newsletter.title1} onChange={v => setContent(c => ({ ...c, home: { ...c.home, newsletter: { ...c.home.newsletter, title1: v } } }))} />
                    <Field label="Title Accent" value={content.home.newsletter.titleAccent} onChange={v => setContent(c => ({ ...c, home: { ...c.home, newsletter: { ...c.home.newsletter, titleAccent: v } } }))} />
                    <Field label="Subtitle" full value={content.home.newsletter.subtitle} onChange={v => setContent(c => ({ ...c, home: { ...c.home, newsletter: { ...c.home.newsletter, subtitle: v } } }))} />
                    <Field label="Placeholder" value={content.home.newsletter.placeholder} onChange={v => setContent(c => ({ ...c, home: { ...c.home, newsletter: { ...c.home.newsletter, placeholder: v } } }))} />
                    <Field label="Button" value={content.home.newsletter.btn} onChange={v => setContent(c => ({ ...c, home: { ...c.home, newsletter: { ...c.home.newsletter, btn: v } } }))} />
                  </div>
                </div>
              </Collapsible>

              <button className={styles.addBtn} style={{ marginTop: "20px" }}
                onClick={saveContent}>
                {t('dashboard.save')}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setModal(null); setEditItem(null); }}>
            <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{t(modal === "trip" ? (editItem ? 'dashboard.editTrip' : 'dashboard.addTrip') : (editItem ? 'dashboard.editPackage' : 'dashboard.addPackage'))}</h3>
                <button className={styles.modalClose} onClick={() => { setModal(null); setEditItem(null); }}><X size={18} /></button>
              </div>
              {modal === "trip" ? (
                <TripForm initial={editItem} onSave={saveTrip} onCancel={() => { setModal(null); setEditItem(null); }} t={t} isRtl={isRtl} />
              ) : (
                <PackageForm initial={editItem} onSave={savePackage} onCancel={() => { setModal(null); setEditItem(null); }} t={t} isRtl={isRtl} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div className={`${styles.toast} ${styles.toastSuccess}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <CheckCircle size={18} style={{ display: "inline", verticalAlign: "middle", marginInlineEnd: "8px" }} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function TripForm({ initial, onSave, onCancel, t, isRtl }) {
  const [data, setData] = useState(initial ? { ...initial } : { ...emptyTrip, id: 0 });
  const update = (key, val) => setData(d => ({ ...d, [key]: val }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(data); }}>
      <div className={styles.modalBody}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>{t('dashboard.titleField')} (Ar)</label>
            <input value={data.title} onChange={e => update("title", e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.titleField')} (En)</label>
            <input value={data.titleEn} onChange={e => update("titleEn", e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.formFull}`}>
            <label>{t('dashboard.descriptionField')} (Ar)</label>
            <textarea value={data.description} onChange={e => update("description", e.target.value)} required />
          </div>
          <div className={`${styles.field} ${styles.formFull}`}>
            <label>{t('dashboard.descriptionField')} (En)</label>
            <textarea value={data.descriptionEn} onChange={e => update("descriptionEn", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.destinationField')} (Ar)</label>
            <input value={data.destination} onChange={e => update("destination", e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.destinationField')} (En)</label>
            <input value={data.destinationEn} onChange={e => update("destinationEn", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.priceField')}</label>
            <input type="number" value={data.price} onChange={e => update("price", Number(e.target.value))} required />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.durationField')} (Ar)</label>
            <input value={data.duration} onChange={e => update("duration", e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.durationField')} (En)</label>
            <input value={data.durationEn} onChange={e => update("durationEn", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.imageField')}</label>
            <input value={data.image} onChange={e => update("image", e.target.value)} placeholder="https://..." />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.typeField')}</label>
            <select value={data.type} onChange={e => { update("type", e.target.value); update("typeEn", { beach: "Beach", adventure: "Adventure", cultural: "Cultural", wellness: "Wellness" }[e.target.value] || ""); }}>
              <option value="beach">Beach</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.difficultyField')}</label>
            <select value={data.difficulty} onChange={e => { update("difficulty", e.target.value); update("difficultyEn", { "سهل": "Easy", "متوسط": "Medium", "صعب": "Hard" }[e.target.value] || ""); }}>
              <option value="سهل">Easy</option>
              <option value="متوسط">Medium</option>
              <option value="صعب">Hard</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.seatsField')}</label>
            <input type="number" value={data.availableSeats} onChange={e => update("availableSeats", Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.guideField')}</label>
            <input value={data.guide} onChange={e => update("guide", e.target.value)} />
          </div>
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>{t('dashboard.cancel')}</button>
        <button type="submit" className={styles.submitBtn}>{t('dashboard.save')}</button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, full, type, textarea, placeholder }) {
  const cls = `${styles.field} ${full ? styles.formFull : ""}`;
  return (
    <div className={cls}>
      <label>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input type={type || "text"} value={value} placeholder={placeholder} onChange={e => onChange(type === "number" ? Number(e.target.value) : e.target.value)} />
      )}
    </div>
  );
}

function Collapsible({ title, id, children, sectionsOpen, setSectionsOpen }) {
  const open = sectionsOpen[id] ?? false;
  return (
    <div className={styles.collapsible}>
      <button className={styles.collapsibleHeader} onClick={() => setSectionsOpen(s => ({ ...s, [id]: !open }))}>
        <span>{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className={styles.collapsibleBody}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PackageForm({ initial, onSave, onCancel, t, isRtl }) {
  const [data, setData] = useState(initial ? { ...initial } : { ...emptyPackage, id: 0 });
  const update = (key, val) => setData(d => ({ ...d, [key]: val }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(data); }}>
      <div className={styles.modalBody}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>{t('dashboard.titleField')} (Ar)</label>
            <input value={data.title} onChange={e => update("title", e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.titleField')} (En)</label>
            <input value={data.titleEn} onChange={e => update("titleEn", e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.formFull}`}>
            <label>{t('dashboard.descriptionField')} (Ar)</label>
            <textarea value={data.description} onChange={e => update("description", e.target.value)} required />
          </div>
          <div className={`${styles.field} ${styles.formFull}`}>
            <label>{t('dashboard.descriptionField')} (En)</label>
            <textarea value={data.descriptionEn} onChange={e => update("descriptionEn", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.destinationField')} (Ar)</label>
            <input value={data.destination} onChange={e => update("destination", e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.destinationField')} (En)</label>
            <input value={data.destinationEn} onChange={e => update("destinationEn", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.priceField')}</label>
            <input type="number" value={data.price} onChange={e => update("price", Number(e.target.value))} required />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.durationField')} (Ar)</label>
            <input value={data.duration} onChange={e => update("duration", e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.durationField')} (En)</label>
            <input value={data.durationEn} onChange={e => update("durationEn", e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.imageField')}</label>
            <input value={data.image} onChange={e => update("image", e.target.value)} placeholder="https://..." />
          </div>
          <div className={styles.field}>
            <label>{t('dashboard.typeField')}</label>
            <select value={data.category || data.type} onChange={e => update("category", e.target.value)}>
              <option value="beach">Beach</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>{t('dashboard.cancel')}</button>
        <button type="submit" className={styles.submitBtn}>{t('dashboard.save')}</button>
      </div>
    </form>
  );
}
