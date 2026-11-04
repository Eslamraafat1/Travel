"use client";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Users, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./TripCard.module.css";
import SmartImage from "@/components/SmartImage/SmartImage";

const difficultyColors = {
  easy: "#22c55e",
  medium: "#f59e0b",
  hard: "#ef4444",
};

export default function TripCard({ trip, index = 0 }) {
  const { t } = useLanguage();
  const ArrowIcon = ArrowRight;

  const hasSeats = Number.isFinite(trip.availableSeats) && trip.totalSeats > 0;
  const seatsPercent = hasSeats ? Math.round((trip.availableSeats / trip.totalSeats) * 100) : 0;
  const urgency = hasSeats && trip.availableSeats <= 5;
  const hasPrice = Number.isFinite(trip.price) && trip.price > 0;

  return (
    <motion.div
      className={styles.card}
      data-testid="trip-card"
      data-price={trip.price}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <Link href={`/trips/${trip.id}`} className={styles.imageWrapper}>
        <SmartImage src={trip.image} alt={trip.title} className={styles.image} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        <div className={styles.overlay} />
        {urgency && (
          <span className={styles.urgencyBadge}>
            {t('common.lastSeats', { n: trip.availableSeats })}
          </span>
        )}
        {trip.rating > 0 && (
          <div className={styles.ratingBadge}>
            <Star size={12} fill="#ffd700" color="#ffd700" />
            {trip.rating}
          </div>
        )}
      </Link>

      {/* Body */}
      <div className={styles.body}>
        {/* Header */}
        <div className={styles.header}>
          {trip.difficulty && (
            <span
              className={styles.difficulty}
              style={{ color: difficultyColors[String(trip.difficulty).toLowerCase()] || "#22c55e" }}
            >
              ● {trip.difficulty}
            </span>
          )}
          <span className={styles.type} dir="auto">{trip.type}</span>
        </div>

        <Link href={`/trips/${trip.id}`}>
          <h3 className={styles.title} dir="auto">{trip.title}</h3>
        </Link>
        <p className={styles.desc} dir="auto">{trip.description}</p>

        {/* Info grid */}
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <MapPin size={14} className={styles.infoIcon} />
            <span dir="auto">{trip.destination}</span>
          </div>
          <div className={styles.infoItem}>
            <Clock size={14} className={styles.infoIcon} />
            <span dir="auto">{trip.duration}</span>
          </div>
          {trip.departureDate && (
            <div className={styles.infoItem}>
              <Calendar size={14} className={styles.infoIcon} />
              <span dir="ltr">{trip.departureDate}</span>
            </div>
          )}
          {hasSeats && (
            <div className={styles.infoItem}>
              <Users size={14} className={styles.infoIcon} />
              <span>{trip.availableSeats} {t('common.seatsLeft')}</span>
            </div>
          )}
        </div>

        {/* Seats progress */}
        {hasSeats && (
        <div className={styles.seatsSection}>
          <div className={styles.seatsLabel}>
            <span>{t('pages.tripDetail.availableSeats')}</span>
            <span className={urgency ? styles.urgentText : ""}>{trip.availableSeats}/{trip.totalSeats}</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              whileInView={{ width: `${seatsPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              style={{ background: urgency ? "var(--gradient-primary)" : "var(--gradient-secondary)" }}
            />
          </div>
        </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.pricing}>
            <span className={styles.priceLabel}>{t('common.priceStarts')}</span>
            {hasPrice ? (
              <span className={styles.price}>{trip.price.toLocaleString()} <small>{trip.currency}</small></span>
            ) : (
              <span className={styles.price}>{t('common.priceOnRequest')}</span>
            )}
          </div>
          <Link href={`/trips/${trip.id}`} className={styles.cta} id={`trip-book-${trip.id}`}>
            {t('common.book')} <ArrowIcon size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
