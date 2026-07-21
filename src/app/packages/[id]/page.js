"use client";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Users, Star, Calendar, Navigation, Heart, Share2, ArrowLeft, Building, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import TripCard from "@/components/TripCard/TripCard";
import { getPackageById } from "@/lib/api/packages";
import { getTripsByIds } from "@/lib/api/trips";
import { searchPlaces } from "@/lib/api/explore";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./package-detail.module.css";

export default function PackageDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [includedTrips, setIncludedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trips");
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const isRtl = lang === "ar";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPackageById(id, lang);
        if (!data) return notFound();
        setPkg(data);

        if (data.includedTrips && data.includedTrips.length > 0) {
          const tripsData = await getTripsByIds(data.includedTrips, lang);
          setIncludedTrips(tripsData);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, lang]);

  useEffect(() => {
    if (!pkg) return;
    const fetchPlaces = async () => {
      setPlacesLoading(true);
      try {
        const near = pkg.destination + ", Egypt";
        const [hotelData, restData] = await Promise.all([
          searchPlaces({ category: "hotels", near, limit: 6 }),
          searchPlaces({ category: "restaurants", near, limit: 6 }),
        ]);
        setHotels(hotelData?.places || []);
        setRestaurants(restData?.places || []);
      } finally {
        setPlacesLoading(false);
      }
    };
    fetchPlaces();
  }, [pkg]);

  if (loading) {
    return (
      <main className={styles.loadingMain}>
        <Navbar />
        <div className={styles.spinner}></div>
      </main>
    );
  }

  if (!pkg) return null;

  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${pkg.image})` }} />
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <motion.div
              className={styles.heroTop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className={styles.destination}><MapPin size={16} /> {pkg.destination}</span>
              {pkg.badge && <span className={styles.badge}>{pkg.badge}</span>}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {pkg.title}
            </motion.h1>

            <motion.div
              className={styles.heroMeta}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span><Clock size={16} /> {pkg.duration}</span>
              <span><Users size={16} /> {t('common.group')} {pkg.maxGroupSize}</span>
              <span className={styles.rating}><Star size={16} fill="#ffd700" color="#ffd700" /> {pkg.rating} ({pkg.reviewCount})</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className="container">
          <div className={styles.layout}>

            {/* Left Column (Details) */}
            <div className={styles.detailsCol}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tabBtn} ${activeTab === "trips" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("trips")}
                >
                  {t('pages.packageDetail.includedTrips')}
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === "itinerary" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("itinerary")}
                >
                  {t('pages.packageDetail.itineraryTitle')}
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === "gallery" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("gallery")}
                >
                  {t('pages.packageDetail.galleryTitle')}
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === "includes" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("includes")}
                >
                  {t('pages.packageDetail.includesTitle')}
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === "hotels" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("hotels")}
                >
                  <Building size={16} /> {t('pages.packageDetail.hotelsTitle')}
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === "restaurants" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("restaurants")}
                >
                  <UtensilsCrossed size={16} /> {t('pages.packageDetail.restaurantsTitle')}
                </button>
              </div>

              <div className={styles.tabContent}>
                {/* Included Trips Tab */}
                {activeTab === "trips" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className={styles.sectionTitle}>{t('pages.packageDetail.includedTrips')}</h2>
                    <p className={styles.sectionDesc}>{t('pages.packageDetail.includedDesc')}</p>

                    <div className={styles.tripsGrid}>
                      {includedTrips.length > 0 ? (
                        includedTrips.map((trip) => (
                          <TripCard key={trip.id} trip={trip} />
                        ))
                      ) : (
                        <p>{t('pages.packageDetail.noTrips')}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Itinerary Tab */}
                {activeTab === "itinerary" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className={styles.sectionTitle}>{t('pages.packageDetail.itineraryTitle')}</h2>
                    <p className={styles.sectionDesc}>{t('pages.packageDetail.itineraryDesc')}</p>

                    <div className={styles.timeline}>
                      {pkg.itinerary?.map((item, index) => (
                        <motion.div
                          key={index}
                          className={styles.timelineItem}
                          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={styles.timelineDot}>{isRtl ? 'اليوم' : 'Day'} {item.day}</div>
                          <div className={styles.timelineCard}>
                            <h3 className={styles.timelineTitle}>{item.title}</h3>
                            <p className={styles.timelineDesc}>{item.desc}</p>
                          </div>
                        </motion.div>
                      )) || <p>{t('pages.packageDetail.noItinerary')}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Gallery Tab */}
                {activeTab === "gallery" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className={styles.sectionTitle}>{t('pages.packageDetail.galleryTitle')}</h2>
                    <div className={styles.gallery}>
                      {pkg.gallery?.map((img, i) => (
                        <img key={i} src={img} alt={`Gallery ${i}`} className={styles.galleryImg} />
                      )) || <p>{t('pages.packageDetail.noGallery')}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Includes Tab */}
                {activeTab === "includes" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className={styles.sectionTitle}>{t('pages.packageDetail.includesTitle')}</h2>
                    <div className={styles.includesGrid}>
                      {pkg.includes?.map((item, i) => (
                        <div key={i} className={styles.includeItem}>
                          <CheckCircle2 size={20} className={styles.checkIcon} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Hotels Tab */}
                {activeTab === "hotels" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className={styles.sectionTitle}>{t('pages.packageDetail.hotelsTitle')}</h2>
                    <p className={styles.sectionDesc}>{t('pages.packageDetail.hotelsDesc')}</p>
                    {placesLoading ? (
                      <div className={styles.placesGrid}>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className={styles.placeCard}>
                            <div className="skeleton" style={{ height: "160px", borderRadius: "12px 12px 0 0" }} />
                            <div style={{ padding: "16px" }}>
                              <div className="skeleton" style={{ height: "18px", width: "70%", marginBottom: "8px", borderRadius: "8px" }} />
                              <div className="skeleton" style={{ height: "14px", borderRadius: "8px" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : hotels.length === 0 ? (
                      <p>{t('pages.packageDetail.noHotels')}</p>
                    ) : (
                      <div className={styles.placesGrid}>
                        {hotels.map((h) => (
                          <div key={h.id} className={styles.placeCard}>
                            <div className={styles.placeImage}>
                              <img src={h.photo} alt={h.name} />
                              {h.price && <span className={styles.placePrice}>{'$'.repeat(h.price)}</span>}
                            </div>
                            <div className={styles.placeBody}>
                              <h4 className={styles.placeName}>{h.name}</h4>
                              <span className={styles.placeAddr}>{h.address || h.city}</span>
                              <div className={styles.placeMeta}>
                                {h.rating && (
                                  <span className={styles.placeRating}>
                                    <Star size={13} fill="#ffd700" color="#ffd700" /> {h.rating}
                                  </span>
                                )}
                                {h.open !== null && (
                                  <span className={`${styles.placeStatus} ${h.open ? styles.open : styles.closed}`}>
                                    {h.open ? 'Open' : 'Closed'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Restaurants Tab */}
                {activeTab === "restaurants" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className={styles.sectionTitle}>{t('pages.packageDetail.restaurantsTitle')}</h2>
                    <p className={styles.sectionDesc}>{t('pages.packageDetail.restaurantsDesc')}</p>
                    {placesLoading ? (
                      <div className={styles.placesGrid}>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className={styles.placeCard}>
                            <div className="skeleton" style={{ height: "160px", borderRadius: "12px 12px 0 0" }} />
                            <div style={{ padding: "16px" }}>
                              <div className="skeleton" style={{ height: "18px", width: "70%", marginBottom: "8px", borderRadius: "8px" }} />
                              <div className="skeleton" style={{ height: "14px", borderRadius: "8px" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : restaurants.length === 0 ? (
                      <p>{t('pages.packageDetail.noRestaurants')}</p>
                    ) : (
                      <div className={styles.placesGrid}>
                        {restaurants.map((r) => (
                          <div key={r.id} className={styles.placeCard}>
                            <div className={styles.placeImage}>
                              <img src={r.photo} alt={r.name} />
                              {r.price && <span className={styles.placePrice}>{'$'.repeat(r.price)}</span>}
                            </div>
                            <div className={styles.placeBody}>
                              <h4 className={styles.placeName}>{r.name}</h4>
                              <span className={styles.placeAddr}>{r.address || r.city}</span>
                              <div className={styles.placeMeta}>
                                {r.rating && (
                                  <span className={styles.placeRating}>
                                    <Star size={13} fill="#ffd700" color="#ffd700" /> {r.rating}
                                  </span>
                                )}
                                {r.open !== null && (
                                  <span className={`${styles.placeStatus} ${r.open ? styles.open : styles.closed}`}>
                                    {r.open ? 'Open' : 'Closed'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column (Booking Sticky) */}
            <div className={styles.bookingSidebar}>
              <div className={styles.bookingCard}>
                <div className={styles.priceHeader}>
                  {pkg.originalPrice && (
                    <span className={styles.oldPrice}>{pkg.originalPrice.toLocaleString()} {pkg.currency}</span>
                  )}
                  <div className={styles.currentPrice}>
                    {pkg.price.toLocaleString()} <span>{pkg.currency}</span>
                  </div>
                  <p className={styles.perPerson}>{t('pages.packageDetail.perPerson')}</p>
                </div>

                <div className={styles.bookingForm}>
                  <div className={styles.inputGroup}>
                    <label>{t('pages.packageDetail.bookingLabel')}</label>
                    <div className={styles.inputWrapper}>
                      <Calendar size={18} />
                      <input type="date" className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>{t('pages.packageDetail.bookingPeople')}</label>
                    <div className={styles.inputWrapper}>
                      <Users size={18} />
                      <input type="number" min="1" max={pkg.maxGroupSize} defaultValue="2" className={styles.input} />
                    </div>
                  </div>
                  <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}>
                    {t('pages.packageDetail.bookNow')} <ArrowLeft size={18} />
                  </button>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}><Heart size={18} /> {t('pages.packageDetail.saveTrip')}</button>
                  <button className={styles.actionBtn}><Share2 size={18} /> {t('pages.packageDetail.share')}</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
