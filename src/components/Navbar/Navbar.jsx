"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Sun, Moon, Menu, X, Globe, Phone } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Globe size={22} />
          </div>
          <span className={styles.logoText}>
            Wander<span className={styles.logoAccent}>lust</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>{t('nav.home')}</Link>
          <Link href="/packages" className={styles.navLink}>{t('nav.packages')}</Link>
          <Link href="/trips" className={styles.navLink}>{t('nav.trips')}</Link>
          <Link href="/planner" className={styles.navLink}>{t('nav.planner')}</Link>
          <Link href="/about" className={styles.navLink}>{t('nav.about')}</Link>
          <Link href="/contact" className={styles.navLink}>{t('nav.contact')}</Link>
          <Link href="/dashboard" className={styles.navLink} style={{ color: "var(--primary)" }}>{t('nav.dashboard')}</Link>
        </div>

        {/* Right Actions */}
        <div className={styles.actions}>
          {/* Language Toggle */}
          <button className={styles.langBtn} onClick={toggleLanguage} aria-label={t('nav.langToggle')}>
            <span className={styles.langIcon}>
              <Globe size={15} />
            </span>
            <span className={styles.langLabel}>
              {lang === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={t('nav.themeToggle')}
            title={t('nav.themeToggle')}
          >
            <div className={styles.toggleTrack}>
              <span className={styles.toggleIcon}>{theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}</span>
              <span className={styles.toggleBall} data-theme={theme} />
            </div>
          </button>

          {/* CTA Button */}
          <Link href="/packages" className={styles.ctaBtn}>
            <Phone size={16} />
            <span>{t('nav.bookNow')}</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-btn"
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t('nav.menuToggle')}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.mobileLinks}>
          <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link href="/packages" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav.packages')}</Link>
          <Link href="/trips" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav.trips')}</Link>
          <Link href="/planner" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav.planner')}</Link>
          <Link href="/about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
          <Link href="/contact" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link>
          <Link href="/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)} style={{ color: "var(--primary)" }}>{t('nav.dashboard')}</Link>
        </div>
        <Link href="/packages" className="btn-primary" style={{ margin: "16px 20px 0", justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
          {t('nav.bookNow')}
        </Link>
      </div>
    </nav>
  );
}
