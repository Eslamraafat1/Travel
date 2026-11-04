"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Languages, Sun, Moon, Menu, X, Phone } from "lucide-react";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/packages", key: "nav.packages" },
  { href: "/explore", key: "nav.explore" },
  { href: "/trips", key: "nav.trips" },
  { href: "/planner", key: "nav.planner" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, toggleLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // The menu is "open for a given path", so navigating closes it automatically.
  const [menuOpenOn, setMenuOpenOn] = useState(null);
  const menuOpen = menuOpenOn === pathname;
  const closeMenu = () => setMenuOpenOn(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));
  const nextLangCode = lang === "ar" ? "en" : "ar";

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`} aria-label="Main">
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Tour Egypt Club — home">
          <div className={styles.logoIcon} aria-hidden="true">
            <Globe size={22} />
          </div>
          <span className={styles.logoText} dir="ltr">
            Tour Egypt <span className={styles.logoAccent}>Club</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.active : ""}`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className={styles.actions}>
          {/* Language Toggle */}
          <button
            id="lang-toggle"
            type="button"
            onClick={toggleLang}
            className={styles.langBtn}
            aria-label={nextLangCode === "en" ? "Switch to English" : "التبديل إلى العربية"}
            lang={nextLangCode}
          >
            <span className={styles.langIcon} aria-hidden="true">
              <Languages size={14} />
            </span>
            <span className={styles.langLabel}>{t("nav.langToggle")}</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle"
            type="button"
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={t("nav.themeToggle")}
            aria-pressed={theme === "dark"}
            title={t("nav.themeToggle")}
          >
            <div className={styles.toggleTrack}>
              <span className={styles.toggleIcon}>{theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}</span>
              <span className={styles.toggleBall} data-theme={theme} />
            </div>
          </button>

          {/* CTA Button */}
          <Link href="/packages" className={styles.ctaBtn}>
            <Phone size={16} aria-hidden="true" />
            <span>{t("nav.bookNow")}</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-btn"
            type="button"
            className={styles.hamburger}
            onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
            aria-label={t("nav.menuToggle")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.mobileLinks}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${isActive(link.href) ? styles.mobileActive : ""}`}
              aria-current={isActive(link.href) ? "page" : undefined}
              tabIndex={menuOpen ? undefined : -1}
              onClick={closeMenu}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
        <Link
          href="/packages"
          className="btn-primary"
          style={{ margin: "16px 20px 0", justifyContent: "center" }}
          tabIndex={menuOpen ? undefined : -1}
          onClick={closeMenu}
        >
          {t("nav.bookNow")}
        </Link>
      </div>
    </nav>
  );
}
