"use client";
import Link from "next/link";
import { Globe, Phone, Mail, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Footer.module.css";

const footerLinks = {
  pages: [
    { href: "/", labelKey: "nav.home" },
    { href: "/packages", labelKey: "nav.packages" },
    { href: "/trips", labelKey: "nav.trips" },
    { href: "/about", labelKey: "nav.about" },
    { href: "/contact", labelKey: "nav.contact" },
  ]
};

export default function Footer() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const destinations = t('footer.destinations') || [];

  return (
    <footer className={styles.footer}>
      {/* Top CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>{t('footer.ctaTitle')}</h2>
            <p>{t('footer.ctaDesc')}</p>
          </div>
          <Link href="/packages" className="btn-primary">
            {t('footer.ctaBtn')}
            <ArrowIcon size={18} />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}><Globe size={20} /></div>
                <span className={styles.logoText}>Wander<span>lust</span></span>
              </div>
              <p className={styles.brandDesc}>
                {t('footer.desc')}
              </p>
              <div className={styles.socials}>
                <a href="#" className={styles.social} id="footer-facebook" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className={styles.social} id="footer-instagram" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className={styles.social} id="footer-twitter" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className={styles.social} id="footer-youtube" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.col}>
              <h3 className={styles.colTitle}>{t('footer.links')}</h3>
              <ul className={styles.linkList}>
                {footerLinks.pages.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>
                      <ArrowIcon size={14} />
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Destinations */}
            <div className={styles.col}>
              <h3 className={styles.colTitle}>{t('footer.topDestinations')}</h3>
              <ul className={styles.linkList}>
                {Array.isArray(destinations) && destinations.map((dest, i) => (
                  <li key={i}>
                    <span className={styles.footerLink}>
                      <ArrowIcon size={14} />
                      {dest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.col}>
              <h3 className={styles.colTitle}>{t('footer.contact')}</h3>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <Phone size={16} className={styles.contactIcon} />
                  <span dir="ltr">+01234567890</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={16} className={styles.contactIcon} />
                  <span>info@wanderlust.com</span>
                </div>
                <div className={styles.contactItem}>
                  <MapPin size={16} className={styles.contactIcon} />
                  <span>{t('footer.address')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={styles.container}>
          <p>© {new Date().getFullYear()} {t('footer.rights')}</p>
          <div className={styles.bottomLinks}>
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
