"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft, Share2, Star, MapPin, Phone, Globe,
  Clock, Navigation, Heart, Check, X,
  ThumbsUp, ThumbsDown, Sparkles, Image as ImageIcon,
  Wifi, Car, Coffee, UtensilsCrossed, Dumbbell, Waves,
  Award, Calendar, Users, Building2, ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { getPlaceDetail, getPlaceTips, getRelatedPlaces } from "@/lib/api/explore";
import styles from "./detail.module.css";

gsap.registerPlugin(ScrollTrigger);

const categoryMeta = {
  hotels:      "Hotel",
  restaurants: "Restaurant",
  trips:       "Landmark",
  activities:  "Activity",
  transport:   "Transport",
  cafes:       "Cafe",
  essentials:  "Service",
  malls:       "Mall",
  parks:       "Park",
};

function relativeDate(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export default function PlaceDetailPage() {
  const { category, id } = useParams();
  const router = useRouter();

  const [place, setPlace] = useState(null);
  const [tips, setTips] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);

  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const infoGridRef = useRef(null);
  const mapRef = useRef(null);
  const reviewsRef = useRef(null);
  const relatedRef = useRef(null);
  const galleryRef = useRef(null);
  const amenitiesRef = useRef(null);
  const enhancedReviewsRef = useRef(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(0);

  const label = categoryMeta[category] || category;

  useEffect(() => {
    if (!id || !category) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [p, t, r] = await Promise.all([
          getPlaceDetail(id, category),
          getPlaceTips(id),
          getRelatedPlaces(category, "Cairo, Egypt", 4),
        ]);
        if (!cancelled) {
          setPlace(p);
          setTips(Array.isArray(t) ? t : []);
          setRelated(Array.isArray(r) ? r : []);
        }
      } catch {
        if (!cancelled) { setPlace(null); setTips([]); setRelated([]); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, category]);

  useEffect(() => {
    if (loading || !place) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.querySelector("." + styles.heroImage),
          { scale: 1.15, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
        );
      }

      const sections = contentRef.current?.querySelectorAll("." + styles.section);
      if (sections?.length) {
        gsap.fromTo(sections,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: contentRef.current, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      }

      const infoItems = infoGridRef.current?.querySelectorAll("." + styles.infoItem);
      if (infoItems?.length) {
        gsap.fromTo(infoItems,
          { rotateX: 40, opacity: 0, y: 30 },
          {
            rotateX: 0, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.4)",
            scrollTrigger: { trigger: infoGridRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      // Gallery animation
      if (galleryRef.current) {
        const galleryItems = galleryRef.current.querySelectorAll("." + styles.galleryItem);
        gsap.fromTo(galleryItems,
          { scale: 0.8, opacity: 0, rotateY: 20 },
          {
            scale: 1, opacity: 1, rotateY: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: galleryRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      // Amenities animation
      if (amenitiesRef.current) {
        const amenityItems = amenitiesRef.current.querySelectorAll("." + styles.amenityItem);
        gsap.fromTo(amenityItems,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(1.2)",
            scrollTrigger: { trigger: amenitiesRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      // Enhanced reviews animation
      if (enhancedReviewsRef.current) {
        const reviewItems = enhancedReviewsRef.current.querySelectorAll("." + styles.enhancedReviewCard);
        gsap.fromTo(reviewItems,
          { x: -40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: enhancedReviewsRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      if (mapRef.current) {
        gsap.fromTo(mapRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1, scale: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: mapRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      const reviewCards = reviewsRef.current?.querySelectorAll("." + styles.reviewCard);
      if (reviewCards?.length) {
        gsap.fromTo(reviewCards,
          { x: 40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: reviewsRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      const relCards = relatedRef.current?.querySelectorAll("." + styles.relCard);
      if (relCards?.length) {
        gsap.fromTo(relCards,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: relatedRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [loading, place]);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: place?.name, url: window.location.href }); } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const imgFallback = (e) => { e.target.src = "https://placehold.co/800x600/1a1a2e/ffffff?text=Image"; };

  const photos = place?.photos?.length ? place.photos : place ? [place.photo] : [];
  const galleryImages = place?.gallery?.length ? place.gallery : photos;
  const fullStars = Math.floor(Number(place?.rating) || 0);
  const hasHalf = Number(place?.rating) % 1 >= 0.5;
  const priceLevel = place?.price ? "$".repeat(place.price) : null;
  const amenitiesList = place?.amenities || place?.features || [];
  const reviewsList = place?.reviews || [];
  
  const amenityIcons = {
    "Free WiFi": Wifi,
    "Swimming Pool": Waves,
    "Spa": Sparkles,
    "Fitness Center": Dumbbell,
    "Restaurant": UtensilsCrossed,
    "Room Service": Coffee,
    "Parking": Car,
    "24/7 Front Desk": Clock,
    "Business Center": Building2,
    "Concierge": Users,
    "Airport Shuttle": Navigation,
    "Bar": Coffee,
    "Outdoor Seating": MapPin,
    "Delivery": ArrowLeft,
    "Takeout": Check,
    "Reservations": Calendar,
    "TV": Sparkles,
    "Wheelchair Accessible": Users,
    "Full Bar": Coffee,
    "Accepts Credit Cards": Globe,
    "Good for Kids": Users,
    "Live Music": Sparkles,
  };

  if (!loading && !place) {
    return (
      <main>
        <Navbar />
        <div className={styles.notFound}>
          <Sparkles size={56} />
          <h2>Place not found</h2>
          <button onClick={() => router.push(`/explore/${category}`)} className={styles.backBtn}>
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      {/* ── Hero Gallery ── */}
      <section className={styles.heroSection} ref={heroRef}>
        <div className={styles.heroWrap}>
          {loading ? (
            <div className={`${styles.heroImage} ${styles.skeleton}`} />
          ) : (
            <img
              src={photos[activeImg] || photos[0]}
              alt={place.name}
              className={styles.heroImage}
              onError={imgFallback}
            />
          )}
          <div className={styles.heroOverlay} />

          <button className={styles.heroBackBtn} onClick={() => router.push(`/explore/${category}`)}>
            <ArrowLeft size={18} />
          </button>

          <button className={styles.heroShareBtn} onClick={handleShare}>
            <Share2 size={18} />
          </button>

          {photos.length > 1 && (
            <span className={styles.imgCounter}>
              {activeImg + 1} / {photos.length}
            </span>
          )}

          <button
            className={`${styles.heroFavBtn} ${liked ? styles.favActive : ""}`}
            onClick={() => setLiked((v) => !v)}
          >
            <Heart size={20} fill={liked ? "#ff3b5c" : "none"} />
          </button>
        </div>

        {photos.length > 1 && (
          <div className={styles.thumbStrip}>
            {photos.map((src, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ""}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={src} alt="" onError={imgFallback} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Content Sections ── */}
      <div className={styles.contentWrap} ref={contentRef}>

        {/* Name + Badges Row */}
        <div className={styles.section}>
          <div className={styles.nameRow}>
            <div className={styles.nameGroup}>
              <h1 className={styles.placeName}>{place?.name}</h1>
              {place?.nameEn && <p className={styles.placeNameEn}>{place.nameEn}</p>}
            </div>
            <span className={styles.categoryBadge}>{label}</span>
          </div>

          <div className={styles.metaRow}>
            {place?.rating && (
              <div className={styles.ratingBox}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16}
                    fill={i < fullStars ? "#ffd700" : i === fullStars && hasHalf ? "#ffd700" : "none"}
                    color={i < fullStars || (i === fullStars && hasHalf) ? "#ffd700" : "var(--text-muted)"}
                  />
                ))}
                <span className={styles.ratingNum}>{place.rating}</span>
                {place.ratingCount && (
                  <span className={styles.ratingCount}>({place.ratingCount})</span>
                )}
              </div>
            )}
            {priceLevel && <span className={styles.priceLevel}>{priceLevel}</span>}
            {place && place.open !== null && (
              <span className={`${styles.openBadge} ${place.open ? styles.openNow : styles.isClosed}`}>
                {place.open ? "Open Now" : "Closed"}
              </span>
            )}
          </div>
        </div>

        {/* Info Row — Address / Phone / Web / Distance */}
        <div className={styles.section}>
          <div className={styles.infoList}>
            {place?.address && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><MapPin size={18} /></div>
                <div>
                  <span className={styles.infoLabel}>Address</span>
                  <span className={styles.infoVal}>{place.address}</span>
                </div>
              </div>
            )}
            {place?.phone && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Phone size={18} /></div>
                <div>
                  <span className={styles.infoLabel}>Phone</span>
                  <a href={`tel:${place.phone}`} className={styles.infoVal + " " + styles.infoLink}>{place.phone}</a>
                </div>
              </div>
            )}
            {place?.website && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Globe size={18} /></div>
                <div>
                  <span className={styles.infoLabel}>Website</span>
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className={styles.infoVal + " " + styles.infoLink}>
                    {place.website.replace(/^https?:\/\//, "").slice(0, 35)}…
                  </a>
                </div>
              </div>
            )}
            {place?.distance != null && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Navigation size={18} /></div>
                <div>
                  <span className={styles.infoLabel}>Distance from center</span>
                  <span className={styles.infoVal}>
                    {place.distance >= 1000
                      ? `${(place.distance / 1000).toFixed(1)} km`
                      : `${place.distance} m`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {place?.description && (
          <div className={styles.section}>
            <h3 className={styles.secTitle}>Description</h3>
            <p className={styles.descText}>
              {place.description}
            </p>
            {place?.detailedDescription && (
              <p className={styles.descText} style={{ marginTop: '12px' }}>
                {place.detailedDescription}
              </p>
            )}
          </div>
        )}

        {/* Enhanced Gallery Section */}
        {galleryImages.length > 1 && (
          <div className={styles.section} ref={galleryRef}>
            <h3 className={styles.secTitle}>
              <ImageIcon size={20} />
              Photo Gallery
              <span className={styles.galleryCount}>{galleryImages.length} photos</span>
            </h3>
            <div className={styles.galleryGrid}>
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={styles.galleryItem}
                  onClick={() => {
                    setSelectedGalleryImg(i);
                    setGalleryOpen(true);
                  }}
                >
                  <img src={img} alt={`Gallery ${i + 1}`} onError={imgFallback} />
                  <div className={styles.galleryOverlay}>
                    <ImageIcon size={24} />
                  </div>
                  {i === 0 && <span className={styles.galleryMain}>Main</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities Section */}
        {amenitiesList.length > 0 && (
          <div className={styles.section} ref={amenitiesRef}>
            <h3 className={styles.secTitle}>
              <Check size={20} />
              Amenities & Features
              <span className={styles.amenitiesCount}>{amenitiesList.length}</span>
            </h3>
            <div className={styles.amenitiesGrid}>
              {amenitiesList.map((amenity, i) => {
                const Icon = amenityIcons[amenity] || Check;
                return (
                  <div key={i} className={styles.amenityItem}>
                    <div className={styles.amenityIcon}>
                      <Icon size={18} />
                    </div>
                    <span className={styles.amenityText}>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Reviews Section */}
        {reviewsList.length > 0 && (
          <div className={styles.section} ref={enhancedReviewsRef}>
            <h3 className={styles.secTitle}>
              <Star size={20} fill="#ffd700" color="#ffd700" />
              Customer Reviews
              <span className={styles.reviewsCountBadge}>{reviewsList.length}</span>
            </h3>
            <div className={styles.enhancedReviewsList}>
              {reviewsList.map((review) => (
                <div key={review.id} className={styles.enhancedReviewCard}>
                  <div className={styles.reviewHeader}>
                    <img src={review.avatar} alt={review.author} className={styles.reviewAvatar} onError={imgFallback} />
                    <div className={styles.reviewAuthorInfo}>
                      <span className={styles.reviewAuthor}>{review.author}</span>
                      <div className={styles.reviewMeta}>
                        <div className={styles.reviewStars}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < review.rating ? "#ffd700" : "none"}
                              color={i < review.rating ? "#ffd700" : "var(--text-muted)"}
                            />
                          ))}
                        </div>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.reviewText}>{review.text}</p>
                  <div className={styles.reviewFooter}>
                    <span className={styles.reviewHelpful}>
                      <ThumbsUp size={14} />
                      {review.helpful} helpful
                    </span>
                    {place?.awards?.length > 0 && (
                      <div className={styles.reviewAwards}>
                        {place.awards.map((award, i) => (
                          <span key={i} className={styles.awardBadge}>
                            <Award size={12} />
                            {award}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Info Grid */}
        <div className={styles.section}>
          <div className={styles.infoGrid} ref={infoGridRef}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><Clock size={20} /></div>
              <span className={styles.infoGridLabel}>Hours</span>
              <span className={styles.infoGridVal}>{place?.hours || "—"}</span>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <span style={{ fontWeight: 900, fontSize: "1rem", color: "var(--accent)" }}>$</span>
              </div>
              <span className={styles.infoGridLabel}>Price Level</span>
              <span className={styles.infoGridVal}>{priceLevel || "—"}</span>
            </div>
            {place?.establishedYear && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Calendar size={20} /></div>
                <span className={styles.infoGridLabel}>Established</span>
                <span className={styles.infoGridVal}>{place.establishedYear}</span>
              </div>
            )}
            {place?.capacity && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Users size={20} /></div>
                <span className={styles.infoGridLabel}>Capacity</span>
                <span className={styles.infoGridVal}>{place.capacity} guests</span>
              </div>
            )}
            {place?.roomCount && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Building2 size={20} /></div>
                <span className={styles.infoGridLabel}>Rooms</span>
                <span className={styles.infoGridVal}>{place.roomCount}</span>
              </div>
            )}
            {place?.signatureDishes && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><UtensilsCrossed size={20} /></div>
                <span className={styles.infoGridLabel}>Signature</span>
                <span className={styles.infoGridVal}>{place.signatureDishes.join(", ")}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><Check size={20} /></div>
              <span className={styles.infoGridLabel}>Verified</span>
              <span className={styles.infoGridVal}>
                {place?.verified ? "Yes ✓" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Map */}
        {place?.lat && place?.lng && (
          <div className={styles.section}>
            <h3 className={styles.secTitle}>Location</h3>
            <div className={styles.mapPlaceholder} ref={mapRef}>
              <div className={styles.mapGradient} />
              <div className={styles.mapPin}>
                <MapPin size={32} />
              </div>
              <div className={styles.mapCoords}>
                <span>{place.lat.toFixed(4)}° N</span>
                <span>{place.lng.toFixed(4)}° E</span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapOpenBtn}
              >
                <Navigation size={16} />
                Open in Google Maps
              </a>
            </div>
          </div>
        )}

        {/* Reviews / Tips */}
        {tips.length > 0 && (
          <div className={styles.section} ref={reviewsRef}>
            <h3 className={styles.secTitle}>
              Visitor Reviews
              <span className={styles.reviewCount}>{tips.length}</span>
            </h3>
            <div className={styles.reviewsList}>
              {tips.map((tip) => (
                <div key={tip.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <img src={tip.author.avatar} alt="" className={styles.reviewAvatar} onError={imgFallback} />
                    <div>
                      <span className={styles.reviewAuthor}>{tip.author.name}</span>
                      <span className={styles.reviewDate}>{relativeDate(tip.created)}</span>
                    </div>
                  </div>
                  <p className={styles.reviewText}>{tip.text}</p>
                  <div className={styles.reviewActions}>
                    <span className={styles.reviewVote}><ThumbsUp size={14} /> {tip.agree}</span>
                    <span className={styles.reviewVote}><ThumbsDown size={14} /> {tip.disagree}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Places */}
        {related.length > 0 && (
          <div className={styles.section} ref={relatedRef}>
            <h3 className={styles.secTitle}>
              Related Places
            </h3>
            <div className={styles.relatedScroll}>
              {related.map((r) => (
                <div
                  key={r.id}
                  className={styles.relCard}
                  onClick={() => router.push(`/explore/${r.category}/${r.id}`)}
                >
                  <div className={styles.relImgWrap}>
                    <img src={r.photo} alt={r.name} className={styles.relImg} onError={imgFallback} />
                    <div className={styles.relOverlay} />
                  </div>
                  <div className={styles.relBody}>
                    <h4 className={styles.relName}>{r.name}</h4>
                    {r.address && <p className={styles.relAddr}><MapPin size={12} /> {r.address}</p>}
                    {r.rating && (
                      <div className={styles.relRating}>
                        <Star size={13} fill="#ffd700" color="#ffd700" />
                        <span>{r.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {galleryOpen && (
        <div className={styles.galleryModal} onClick={() => setGalleryOpen(false)}>
          <button className={styles.galleryClose} onClick={() => setGalleryOpen(false)}>
            <X size={28} />
          </button>
          <div className={styles.galleryModalContent} onClick={(e) => e.stopPropagation()}>
            <img src={galleryImages[selectedGalleryImg]} alt="Gallery" onError={imgFallback} />
            <div className={styles.galleryModalNav}>
              <button
                className={styles.galleryNavBtn}
                onClick={() => setSelectedGalleryImg((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
              >
                <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <span className={styles.galleryCounter}>{selectedGalleryImg + 1} / {galleryImages.length}</span>
              <button
                className={styles.galleryNavBtn}
                onClick={() => setSelectedGalleryImg((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
