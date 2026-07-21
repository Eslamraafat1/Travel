"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Globe, Sun, Moon, Menu, X, Phone } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/packages", label: "Packages" },
    { href: "/explore", label: "Explore" },
    { href: "/trips", label: "Trips" },
    { href: "/planner", label: "Planner" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

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
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>{link.label}</Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className={styles.actions}>
          {/* Theme Toggle */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <div className={styles.toggleTrack}>
              <span className={styles.toggleIcon}>{theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}</span>
              <span className={styles.toggleBall} data-theme={theme} />
            </div>
          </button>

          {/* CTA Button */}
          <Link href="/packages" className={styles.ctaBtn}>
            <Phone size={16} />
            <span>Book Now</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-btn"
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.mobileLinks}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
        </div>
        <Link href="/packages" className="btn-primary" style={{ margin: "16px 20px 0", justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
          Book Now
        </Link>
      </div>
    </nav>
  );
}
