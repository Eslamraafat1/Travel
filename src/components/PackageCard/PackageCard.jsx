"use client";
import { motion } from "framer-motion";
import { Star, Clock, Users, MapPin, ArrowLeft, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./PackageCard.module.css";

export default function PackageCard({ pkg, index = 0 }) {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : null;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {/* Image */}
      <Link href={`/packages/${pkg.id}`} className={styles.imageWrapper}>
        <img src={pkg.image} alt={pkg.title} className={styles.image} loading="lazy" />
        <div className={styles.imageOverlay} />

        {/* Top badges */}
        <div className={styles.topBadges}>
          {pkg.badge && (
            <span className={styles.badge}>
              <Zap size={12} /> {pkg.badge}
            </span>
          )}
          {discount && (
            <span className={styles.discountBadge}>-{discount}%</span>
          )}
        </div>

        {/* Category */}
        <span className={styles.category}>{pkg.destination}</span>
      </Link>

      {/* Body */}
      <div className={styles.body}>
        <Link href={`/packages/${pkg.id}`}>
          <h3 className={styles.title}>{pkg.title}</h3>
        </Link>
        <p className={styles.desc}>{pkg.description}</p>

        {/* Meta */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Clock size={14} /> {pkg.duration}
          </span>
          <span className={styles.metaItem}>
            <Users size={14} /> {pkg.maxGroupSize} {t('common.people')}
          </span>
        </div>

        {/* Rating */}
        <div className={styles.rating}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.round(pkg.rating) ? "#ffd700" : "none"}
                color={i < Math.round(pkg.rating) ? "#ffd700" : "#666"}
              />
            ))}
          </div>
          <span className={styles.ratingText}>{pkg.rating} ({pkg.reviewCount?.toLocaleString()})</span>
        </div>

        {/* Includes */}
        <div className={styles.includes}>
          {pkg.includes?.slice(0, 3).map((item, i) => (
            <span key={i} className={styles.includeTag}>{item}</span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className={styles.footer}>
          <div className={styles.pricing}>
            {pkg.originalPrice && (
              <span className={styles.originalPrice}>
                {pkg.originalPrice.toLocaleString()} {pkg.currency}
              </span>
            )}
            <span className={styles.price}>
              {pkg.price.toLocaleString()} <small>{pkg.currency}</small>
            </span>
          </div>
          <Link href={`/packages/${pkg.id}`} className={styles.cta} id={`pkg-book-${pkg.id}`}>
            {t('common.more')} <ArrowIcon size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
