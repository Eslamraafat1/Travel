"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./not-found.module.css";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={styles.inner}
        >
          <div className={styles.codeWrapper}>
            <span className={styles.code}>4</span>
            <motion.span
              className={styles.globe}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            >
              🌍
            </motion.span>
            <span className={styles.code}>4</span>
          </div>
          <h1>{t('pages.notFound.title')}</h1>
          <p>{t('pages.notFound.desc')}</p>
          <div className={styles.actions}>
            <Link href="/" className="btn-primary" id="not-found-home">
              <Home size={18} /> {t('pages.notFound.home')}
            </Link>
            <Link href="/packages" className="btn-outline" id="not-found-packages">
              {t('pages.notFound.packages')} <ArrowLeft size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
