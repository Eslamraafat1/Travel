"use client";
import { motion } from "framer-motion";
import { Users, Award, Globe, Heart, Target, Eye, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./about.module.css";

const valueIcons = [
  { icon: <Heart size={24} />, color: "#ec4899" },
  { icon: <CheckCircle size={24} />, color: "#22c55e" },
  { icon: <Target size={24} />, color: "#f59e0b" },
  { icon: <Globe size={24} />, color: "#00d4ff" },
];

const statIcons = [
  { icon: <Users size={28} /> },
  { icon: <Globe size={28} /> },
  { icon: <Award size={28} /> },
  { icon: <Heart size={28} /> },
];

export default function AboutPage() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";

  const values = Array.isArray(t('pages.about.values')) ? t('pages.about.values').map((v, i) => ({ ...v, ...valueIcons[i] })) : [];
  const team = Array.isArray(t('pages.about.team')) ? t('pages.about.team') : [];
  const stats = Array.isArray(t('pages.about.stats')) ? t('pages.about.stats') : [];

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span className="section-tag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {t('pages.about.heroTag')}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {t('pages.about.heroTitle').split(' ').map((word, idx, arr) =>
              idx === arr.length - 1 ? <span key={idx} className="gradient-text">{word}</span> : word + ' '
            )}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {t('pages.about.heroSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className={styles.mvGrid}>
            <motion.div
              className={styles.mvCard}
              initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.mvIcon} style={{ background: "rgba(255,107,53,0.1)", color: "var(--primary)" }}>
                <Target size={32} />
              </div>
              <h2>{t('pages.about.missionTitle')}</h2>
              <p>{t('pages.about.missionDesc')}</p>
            </motion.div>
            <motion.div
              className={styles.mvCard}
              initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.mvIcon} style={{ background: "rgba(0,212,255,0.1)", color: "var(--secondary)" }}>
                <Eye size={32} />
              </div>
              <h2>{t('pages.about.visionTitle')}</h2>
              <p>{t('pages.about.visionDesc')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className={styles.statsBanner}>
        <div className="container">
          <div className={styles.statsRow}>
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className={styles.statItem}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={styles.statIcon}>{statIcons[i]?.icon}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-alt">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{t('pages.about.valuesTag')}</span>
            <h2 className="section-title">{t('pages.about.sectionTitle')}</h2>
          </motion.div>
          <div className={styles.valuesGrid}>
            {values.map((val, i) => (
              <motion.div
                key={i}
                className={styles.valueCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className={styles.valueIcon} style={{ color: val.color, background: `${val.color}18` }}>
                  {val.icon}
                </div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{t('pages.about.teamTag')}</span>
            <h2 className="section-title">
              {t('pages.about.teamTitle').split(' ').map((word, idx, arr) =>
                idx === arr.length - 1 ? <span key={idx} className="gradient-text">{word}</span> : word + ' '
              )}
            </h2>
          </motion.div>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <motion.div
                key={i}
                className={styles.teamCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.avatarWrapper}>
                  <img src={member.avatar} alt={member.name} className={styles.avatar} />
                  <div className={styles.avatarGlow} />
                </div>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
                <span className={styles.memberExp}>{member.exp}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
