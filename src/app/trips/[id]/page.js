"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Star, Calendar, CheckCircle, XCircle, Info, Heart, Share2, ArrowLeft, Navigation, AlertTriangle, Shield, X, Sparkles, PlusCircle, Route } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { getTripById, getPopularTrips } from "@/lib/api/trips";
import TripCard from "@/components/TripCard/TripCard";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./trip-detail.module.css";

export default function TripDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [related, setRelated] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [data, popular] = await Promise.all([
          getTripById(id),
          getPopularTrips(5),
        ]);
        if (!data) return notFound();
        setTrip(data);
        setRelated(popular.filter(r => r.id !== data.id).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <main className={styles.loadingMain}>
        <Navbar />
        <div className={styles.spinner}></div>
      </main>
    );
  }

  if (!trip) return null;

  const hasSeats = Number.isFinite(trip.availableSeats) && trip.totalSeats > 0;
  const hasPrice = Number.isFinite(trip.price) && trip.price > 0;
  // Multi-day trips number their itinerary by day; a same-day tour (e.g. the
  // 3–4 hour Giza visit) lists stops instead.
  const itineraryLabel = (n) =>
    t(trip.durationDays > 1 ? 'pages.tripDetail.day' : 'pages.tripDetail.stop', { n });
  const tabs = [
    trip.itinerary?.length ? { id: "itinerary", label: t('pages.tripDetail.tabsItinerary') } : null,
    { id: "tips", label: t('pages.tripDetail.tabsTips') },
  ].filter(Boolean);
  const currentTab = tabs[activeTab] ? tabs[activeTab].id : tabs[0].id;
  const extraSections = [
    { key: "upgrades", title: t('pages.tripDetail.upgrades'), icon: <Sparkles size={20} /> },
    { key: "optionalExperiences", title: t('pages.tripDetail.optionalExperiences'), icon: <PlusCircle size={20} /> },
    { key: "comboTours", title: t('pages.tripDetail.comboTours'), icon: <Route size={20} /> },
  ].filter((section) => trip[section.key]?.length);

  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${trip.image})` }} />
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <motion.div
              className={styles.heroTop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className={styles.destination}><MapPin size={16} /> <span dir="auto">{trip.destination}</span></span>
              <span className={styles.type}>{trip.type}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span dir="auto">{trip.title}</span>
            </motion.h1>

            {trip.rating > 0 && (
              <motion.div
                className={styles.heroMeta}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className={styles.rating}><Star size={16} fill="#ffd700" color="#ffd700" /> {trip.rating} ({trip.reviewCount} {t('common.reviews')})</span>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className="container">
          <div className={styles.layout}>

            {/* Left Column (Details) */}
            <div className={styles.detailsCol}>
              <h2 className={styles.sectionTitle}>{t('pages.tripDetail.overview')}</h2>
              <p className={styles.desc} dir="auto">{trip.overview || trip.description}</p>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <Clock size={24} className={styles.infoIcon} />
                  <div>
                    <h4>{t('pages.tripDetail.duration')}</h4>
                    <p dir="auto">{trip.duration}</p>
                  </div>
                </div>
                {trip.departureDate && (
                  <div className={styles.infoCard}>
                    <Calendar size={24} className={styles.infoIcon} />
                    <div>
                      <h4>{t('pages.tripDetail.departureDate')}</h4>
                      <p>{trip.departureDate}</p>
                    </div>
                  </div>
                )}
                {hasSeats && (
                  <div className={styles.infoCard}>
                    <Users size={24} className={styles.infoIcon} />
                    <div>
                      <h4>{t('pages.tripDetail.availableSeats')}</h4>
                      <p>{trip.availableSeats} / {trip.totalSeats}</p>
                    </div>
                  </div>
                )}
                {trip.difficulty && (
                  <div className={styles.infoCard}>
                    <Info size={24} className={styles.infoIcon} />
                    <div>
                      <h4>{t('pages.tripDetail.difficulty')}</h4>
                      <p dir="auto">{trip.difficulty}</p>
                    </div>
                  </div>
                )}
                {!trip.departureDate && trip.maxGroupSize > 0 && (
                  <div className={styles.infoCard}>
                    <Users size={24} className={styles.infoIcon} />
                    <div>
                      <h4>{t('pages.tripDetail.groupSize')}</h4>
                      <p>{t('pages.tripDetail.maxPeople', { n: trip.maxGroupSize })}</p>
                    </div>
                  </div>
                )}
              </div>

              {trip.accessNote && (
                <div className={styles.cancellationCard} style={{ marginTop: "24px" }}>
                  <Info size={24} className={styles.cancellationIcon} />
                  <div>
                    <h4>{t('pages.tripDetail.goodToKnow')}</h4>
                    <p dir="auto">{trip.accessNote}</p>
                  </div>
                </div>
              )}

              {trip.highlights?.length > 0 && (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>{t('pages.tripDetail.highlights')}</h2>
                  <div className={styles.highlightsGrid}>
                    {trip.highlights.map((hl, i) => (
                      <div key={i} className={styles.highlightItem}>
                        <CheckCircle size={20} className={styles.checkIcon} />
                        <span dir="auto">{hl}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Details sections */}
              {trip.meetingPoint && (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>{t('pages.tripDetail.meetingPoint')}</h2>
                  <div className={styles.meetingPointCard}>
                    <Navigation size={24} className={styles.infoIcon} />
                    <div>
                      <h4>{t('pages.tripDetail.location')}</h4>
                      <p dir="auto">{trip.meetingPoint}</p>
                    </div>
                  </div>
                </>
              )}

              {trip.requirements && trip.requirements.length > 0 && (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>{t('pages.tripDetail.requirements')}</h2>
                  <div className={styles.requirementsBox}>
                    <AlertTriangle size={24} className={styles.warningIcon} />
                    <ul>
                      {trip.requirements.map((req, i) => (
                        <li key={i} dir="auto">{req}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className={styles.includedExcluded}>
                {trip.included && trip.included.length > 0 && (
                  <div className={styles.includedBox}>
                    <h3><CheckCircle size={20} color="#22c55e" /> {t('pages.tripDetail.included')}</h3>
                    <ul>
                      {trip.included.map((item, i) => (
                        <li key={i} dir="auto">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {trip.excluded && trip.excluded.length > 0 && (
                  <div className={styles.excludedBox}>
                    <h3><XCircle size={20} color="#ef4444" /> {t('pages.tripDetail.excluded')}</h3>
                    <ul>
                      {trip.excluded.map((item, i) => (
                        <li key={i} dir="auto">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {extraSections.map((section) => (
                <div key={section.key}>
                  <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>{section.title}</h2>
                  <div className={styles.faqs} data-testid={`trip-${section.key}`}>
                    {trip[section.key].map((item, i) => (
                      <div key={i} className={styles.faqItem}>
                        <h4 dir="auto">{section.icon} {item.title}</h4>
                        <p dir="auto">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {trip.faqs && trip.faqs.length > 0 && (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>{t('pages.tripDetail.faqs')}</h2>
                  <div className={styles.faqs}>
                    {trip.faqs.map((faq, i) => (
                      <div key={i} className={styles.faqItem}>
                        <h4 dir="auto">{faq.q}</h4>
                        <p dir="auto" style={{ whiteSpace: "pre-line" }}>{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {trip.guide && (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>{t('pages.tripDetail.guide')}</h2>
                  <div className={styles.guideCard}>
                    <div className={styles.guideAvatar}>
                      <Users size={28} />
                    </div>
                    <div className={styles.guideInfo}>
                      <h4 dir="auto">{trip.guide}</h4>
                      <p>{t('pages.tripDetail.guide')}</p>
                    </div>
                  </div>
                </>
              )}

              <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>{t('pages.tripDetail.cancellation')}</h2>
              <div className={styles.cancellationCard}>
                <Shield size={24} className={styles.cancellationIcon} />
                <div>
                  <h4>{t('pages.tripDetail.cancellation')}</h4>
                  <p dir="auto" style={{ whiteSpace: "pre-line" }}>{trip.cancellationPolicy || t('pages.tripDetail.cancellationContent')}</p>
                </div>
              </div>

              {trip.gallery && trip.gallery.length > 0 && (
                <>
                  <h2 className={styles.sectionTitle} style={{ marginTop: "40px" }}>{t('pages.tripDetail.gallery')}</h2>
                  <div className={styles.gallery}>
                    {trip.gallery.map((img, i) => (
                      <img key={i} src={img} alt={`${trip.title} — photo ${i + 1}`}
                        className={styles.galleryImg}
                        onClick={() => setLightbox(img)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* TABS */}
              <div className={styles.tabsWrapper}>
                <div className={styles.tabsNav}>
                  {tabs.map((tab, i) => (
                    <button key={tab.id} type="button" className={`${styles.tabBtn} ${currentTab === tab.id ? styles.tabActive : ''}`}
                      onClick={() => setActiveTab(i)}>{tab.label}</button>
                  ))}
                </div>

                <div className={styles.tabPanel}>
                  {currentTab === "itinerary" && (
                    <div className={styles.itinerary} data-testid="trip-itinerary">
                      {trip.itinerary.map((day, i) => (
                        <div key={i} className={styles.itineraryDay}>
                          <div className={styles.itineraryDot} />
                          <h4>{itineraryLabel(day.day || i + 1)}: <span dir="auto">{day.title}</span></h4>
                          <p dir="auto" style={{ whiteSpace: "pre-line" }}>{day.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {currentTab === "tips" && (
                    <div className={styles.tipsGrid}>
                      {[
                        { icon: '☀️', text: 'Bring sunscreen and a hat' },
                        { icon: '👟', text: 'Wear comfortable walking shoes' },
                        { icon: '📷', text: 'Don\'t forget your camera' },
                        { icon: '💧', text: 'Carry a water bottle' },
                      ].map((tip, i) => (
                        <div key={i} className={styles.tipItem}>
                          <div className={styles.tipIcon}>{tip.icon}</div>
                          <span>{tip.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Booking Sticky) */}
            <div className={styles.bookingSidebar}>
              <div className={styles.bookingCard}>
                <div className={styles.priceHeader}>
                  <p className={styles.priceLabel}>{t('pages.tripDetail.priceLabel')}</p>
                  <div className={styles.currentPrice}>
                    {hasPrice ? <>{trip.price.toLocaleString()} <span>{trip.currency}</span></> : t('common.priceOnRequest')}
                  </div>
                  <p className={styles.perPerson}>{t('pages.tripDetail.perPerson')}</p>
                </div>

                <div className={styles.bookingForm}>
                  {hasSeats && (
                  <div className={styles.inputGroup}>
                    <label>{t('pages.tripDetail.availableSeats')}</label>
                    <div className={styles.progressSection}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${(trip.availableSeats / trip.totalSeats) * 100}%` }}
                        />
                      </div>
                      <p>{t('pages.tripDetail.remainingSeats', { count: trip.availableSeats })}</p>
                    </div>
                  </div>
                  )}
                  <div className={styles.inputGroup}>
                    <label>{t('pages.tripDetail.bookingPeople')}</label>
                    <div className={styles.inputWrapper}>
                      <Users size={18} />
                      <input type="number" min="1" max={trip.availableSeats || trip.maxGroupSize || undefined} defaultValue="1" className={styles.input} />
                    </div>
                  </div>
                  <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "10px" }}
                    onClick={() => router.push(`/checkout/${trip.id}`)}>
                    {t('pages.tripDetail.confirmBooking')} <ArrowLeft size={18} />
                  </button>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}><Heart size={18} /> {t('pages.tripDetail.saveTrip')}</button>
                  <button className={styles.actionBtn}><Share2 size={18} /> {t('pages.tripDetail.share')}</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {trip.gallery && trip.gallery.length > 0 && (
        <section className={styles.photoSliderSection}>
          <div className="container" style={{ marginBottom: "32px" }}>
            <motion.div className="section-header"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              <span className="section-tag">{t('pages.tripDetail.photoSlider')}</span>
              <h2 className="section-title">
                {t('pages.tripDetail.photoSlider')}
              </h2>
            </motion.div>
          </div>
          <div className={styles.photoSliderTrack}>
            {[...trip.gallery, ...trip.gallery].map((img, i) => (
              <div key={i} className={styles.photoSlide} onClick={() => setLightbox(img)}>
                <img src={img} alt={`${trip.title} — photo ${(i % trip.gallery.length) + 1}`} />
                <div className={styles.photoSlideOverlay}>
                  <MapPin size={14} /> {trip.destination}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className="container">
            <motion.div className="section-header"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              <span className="section-tag">{t('pages.tripDetail.relatedTrips')}</span>
              <h2 className="section-title">
                <span className="gradient-text">{t('pages.tripDetail.relatedTrips')}</span>
              </h2>
            </motion.div>
            <div className={styles.relatedGrid}>
              {related.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          <img src={lightbox} alt={trip.title} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
