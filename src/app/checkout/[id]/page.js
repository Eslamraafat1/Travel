"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, User, Users, Calendar, CreditCard, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { getTripById } from "@/lib/api/trips";
import { useLanguage } from "@/context/LanguageContext";
import styles from "../checkout.module.css";

export default function CheckoutPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const isRtl = lang === "ar";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    people: 1,
    date: "",
    requests: "",
    payment: "credit",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTripById(id, lang);
        setTrip(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, lang]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <Navbar />
        <div className="container" style={{ textAlign: "center", paddingTop: "80px" }}>
          <div className="spinner" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!trip) {
    return (
      <main className={styles.page}>
        <Navbar />
        <div className="container" style={{ textAlign: "center", paddingTop: "80px" }}>
          <h2 style={{ color: "var(--text-primary)" }}>{t('pages.tripDetail.noTrips')}</h2>
        </div>
        <Footer />
      </main>
    );
  }

  const total = trip.price * form.people;
  const ArrowDir = isRtl ? ChevronLeft : ChevronRight;

  return (
    <main className={styles.page}>
      <Navbar />

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1>{t('pages.checkout.pageTitle')}</h1>
          <p>{trip.title}</p>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {[t('pages.checkout.personalInfo'), t('pages.checkout.bookingDetails'), t('pages.checkout.payment')].map((label, i) => (
            <div key={i}>
              <div className={`${styles.step} ${i <= step ? styles.stepActive : ""}`}>
                <span className={styles.stepNum}>{i + 1}</span>
                {label}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.grid}>
            {/* Left — Form */}
            <div>
              {/* Step 1: Personal Info */}
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: isRtl ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? -20 : 20 }} transition={{ duration: 0.3 }}>
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>
                        <div className={styles.sectionIcon} style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}>
                          <User size={18} />
                        </div>
                        {t('pages.checkout.personalInfo')}
                      </h3>
                      <div className={styles.formGrid}>
                        <div className={`${styles.field} ${styles.formGridFull}`}>
                          <label>{t('pages.checkout.fullName')}</label>
                          <input type="text" placeholder={t('pages.checkout.namePlaceholder')} value={form.name} onChange={e => update("name", e.target.value)} required />
                        </div>
                        <div className={styles.field}>
                          <label>{t('pages.checkout.email')}</label>
                          <input type="email" placeholder={t('pages.checkout.emailPlaceholder')} value={form.email} onChange={e => update("email", e.target.value)} required />
                        </div>
                        <div className={styles.field}>
                          <label>{t('pages.checkout.phone')}</label>
                          <input type="tel" placeholder={t('pages.checkout.phonePlaceholder')} value={form.phone} onChange={e => update("phone", e.target.value)} required />
                        </div>
                      </div>
                    </div>
                    <button type="button" className="btn-primary" onClick={() => setStep(1)} style={{ width: "100%", justifyContent: "center" }}>
                      {t('pages.checkout.bookingDetails')} <ArrowDir size={18} />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Booking Details */}
                {step === 1 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: isRtl ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? -20 : 20 }} transition={{ duration: 0.3 }}>
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>
                        <div className={styles.sectionIcon} style={{ background: "rgba(0,212,255,0.15)", color: "#00d4ff" }}>
                          <Calendar size={18} />
                        </div>
                        {t('pages.checkout.bookingDetails')}
                      </h3>
                      <div className={styles.formGrid}>
                        <div className={styles.field}>
                          <label>{t('pages.checkout.people')}</label>
                          <select value={form.people} onChange={e => update("people", Number(e.target.value))}>
                            {[...Array(Math.min(trip.availableSeats, 10))].map((_, i) => (
                              <option key={i} value={i + 1}>{i + 1} {t('pages.checkout.guests')}</option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.field}>
                          <label>{t('pages.checkout.date')}</label>
                          <input type="date" value={form.date} onChange={e => update("date", e.target.value)} required />
                        </div>
                        <div className={`${styles.field} ${styles.formGridFull}`}>
                          <label>{t('pages.checkout.specialRequests')}</label>
                          <textarea placeholder={t('pages.checkout.requestsPlaceholder')} value={form.requests} onChange={e => update("requests", e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button type="button" className="btn-outline" onClick={() => setStep(0)} style={{ flex: 1, justifyContent: "center" }}>
                        <ArrowLeft size={18} /> {t('pages.checkout.personalInfo')}
                      </button>
                      <button type="button" className="btn-primary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: "center" }}>
                        {t('pages.checkout.payment')} <ArrowDir size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {step === 2 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: isRtl ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? -20 : 20 }} transition={{ duration: 0.3 }}>
                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>
                        <div className={styles.sectionIcon} style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                          <CreditCard size={18} />
                        </div>
                        {t('pages.checkout.payment')}
                      </h3>
                      <div className={styles.paymentOptions}>
                        {[
                          { value: "credit", label: t('pages.checkout.creditCard'), icon: <CreditCard size={20} /> },
                          { value: "paypal", label: t('pages.checkout.paypal'), icon: <CreditCard size={20} /> },
                          { value: "bank", label: t('pages.checkout.bankTransfer'), icon: <CreditCard size={20} /> },
                        ].map(opt => (
                          <label key={opt.value} className={`${styles.paymentOption} ${form.payment === opt.value ? styles.paymentOptionSelected : ""}`}>
                            <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value} onChange={e => update("payment", e.target.value)} />
                            <div className={styles.paymentOptionContent}>
                              {opt.icon}
                              <span>{opt.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button type="button" className="btn-outline" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: "center" }}>
                        <ArrowLeft size={18} /> {t('pages.checkout.bookingDetails')}
                      </button>
                      <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: "center" }}>
                        {submitting ? "..." : t('pages.checkout.confirmBtn')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right — Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.summaryCard}>
                <img src={trip.image} alt={trip.title} className={styles.summaryImg} />
                <div className={styles.summaryBody}>
                  <h3 className={styles.summaryTitle}>{trip.title}</h3>
                  <p className={styles.summaryDest}>
                    <MapPin size={14} /> {trip.destination}
                  </p>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      <Calendar size={16} /> {t('pages.checkout.tripDate')}
                    </span>
                    <span className={styles.summaryValue}>{trip.departureDate}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      <Users size={16} /> {t('pages.checkout.people')}
                    </span>
                    <span className={styles.summaryValue}>{form.people} {t('pages.checkout.guests')}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>{t('pages.tripDetail.duration')}</span>
                    <span className={styles.summaryValue}>{trip.duration}</span>
                  </div>
                  <div className={styles.summaryTotal}>
                    <span className={styles.summaryTotalLabel}>{t('pages.checkout.total')}</span>
                    <span className={styles.summaryTotalValue}>{total.toLocaleString()} {trip.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div className={styles.successOverlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => router.push("/trips")}
          >
            <motion.div className={styles.successCard}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.successIcon}>
                <CheckCircle size={40} />
              </div>
              <h2>{t('pages.checkout.success')}</h2>
              <p>{trip.title}</p>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => router.push("/trips")}
              >
                {t('nav.trips')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
