"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./contact.module.css";

export default function ContactPage() {
  const { t } = useLanguage();
  const contactInfo = [
    { icon: <Phone size={22} />, title: t('pages.contact.infoCards.0.title'), value: t('pages.contact.infoCards.0.value'), sub: t('pages.contact.infoCards.0.sub'), color: "#22c55e" },
    { icon: <Mail size={22} />, title: t('pages.contact.infoCards.1.title'), value: t('pages.contact.infoCards.1.value'), sub: t('pages.contact.infoCards.1.sub'), color: "#ff6b35" },
    { icon: <MapPin size={22} />, title: t('pages.contact.infoCards.2.title'), value: t('pages.contact.infoCards.2.value'), sub: t('pages.contact.infoCards.2.sub'), color: "#00d4ff" },
    { icon: <Clock size={22} />, title: t('pages.contact.infoCards.3.title'), value: t('pages.contact.infoCards.3.value'), sub: t('pages.contact.infoCards.3.sub'), color: "#a855f7" },
  ];
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", destination: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 400);
  };

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span className="section-tag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {t('pages.contact.heroTag')}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {t('pages.contact.heroTitle').split(' ').map((word, idx) => idx === 2 ? <span key={idx} className="gradient-text">{word}</span> : word + (idx < t('pages.contact.heroTitle').split(' ').length - 1 ? ' ' : ''))}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {t('pages.contact.heroSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>

            {/* Info Cards */}
            <div className={styles.infoCol}>
              <h2 className={styles.infoTitle}>{t('pages.contact.infoTitle')}</h2>
              <p className={styles.infoSubtitle}>{t('pages.contact.infoSubtitle')}</p>
              <div className={styles.infoCards}>
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={i}
                    className={styles.infoCard}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ x: 6 }}
                  >
                    <div className={styles.infoIcon} style={{ color: item.color, background: `${item.color}18` }}>
                      {item.icon}
                    </div>
                    <div className={styles.infoText}>
                      <h4>{item.title}</h4>
                      <p className={styles.infoValue}>{item.value}</p>
                      <p className={styles.infoSub}>{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form */}
            <motion.div
              className={styles.formCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {submitted ? (
                <motion.div
                  className={styles.successMsg}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle size={60} className={styles.successIcon} />
                  <h3>{t('pages.contact.successTitle')} 🎉</h3>
                  <p>{t('pages.contact.successDesc')}</p>
                  <button className="btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: "16px" }}>
                    {t('pages.contact.successBtn')}
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className={styles.formTitle}>{t('pages.contact.formTitle')}</h2>
                  <p className={styles.formSubtitle}>{t('pages.contact.formSubtitle')}</p>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="contact-name">{t('pages.contact.labels.name')}</label>
                        <input
                          id="contact-name"
                          type="text"
                          placeholder={t('pages.contact.placeholders.name')}
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="contact-phone">{t('pages.contact.labels.phone')}</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          placeholder={t('pages.contact.placeholders.phone')}
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="contact-email">{t('pages.contact.labels.email')}</label>
                        <input
                          id="contact-email"
                          type="email"
                          placeholder={t('pages.contact.placeholders.email')}
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="contact-destination">{t('pages.contact.labels.destination')}</label>
                        <input
                          id="contact-destination"
                          type="text"
                          placeholder={t('pages.contact.placeholders.destination')}
                          value={form.destination}
                          onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-message">{t('pages.contact.labels.message')}</label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder={t('pages.contact.placeholders.message')}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn-primary" id="contact-submit" style={{ width: "100%", justifyContent: "center" }}>
                      <Send size={18} />
                      {t('pages.contact.submit')}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
