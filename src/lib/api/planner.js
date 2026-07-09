import { getContentOverrides } from "../contentStore";

export const destinationsList = [
  { id: "maldives", ar: "المالديف", en: "Maldives", color: "#00b4d8" },
  { id: "switzerland", ar: "سويسرا", en: "Switzerland", color: "#22c55e" },
  { id: "japan", ar: "اليابان", en: "Japan", color: "#ef4444" },
  { id: "italy", ar: "إيطاليا", en: "Italy", color: "#f59e0b" },
  { id: "kenya", ar: "كينيا", en: "Kenya", color: "#a855f7" },
  { id: "france", ar: "فرنسا", en: "France", color: "#3b82f6" },
  { id: "thailand", ar: "تايلاند", en: "Thailand", color: "#ec4899" },
  { id: "turkey", ar: "تركيا", en: "Turkey", color: "#ff6b35" },
  { id: "egypt", ar: "مصر", en: "Egypt", color: "#d97706" },
  { id: "dubai", ar: "دبي", en: "Dubai", color: "#eab308" },
];

const suggestionsPool = {
  maldives: { image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", tag: "جنة استوائية", tagEn: "Tropical Paradise", rating: 4.9 },
  switzerland: { image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800", tag: "جبال الألب", tagEn: "Swiss Alps", rating: 4.8 },
  japan: { image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", tag: "سحر اليابان", tagEn: "Magic of Japan", rating: 4.9 },
  italy: { image: "https://images.unsplash.com/photo-1493707553966-283afac8c358?w=800", tag: "رومانسية إيطاليا", tagEn: "Romantic Italy", rating: 4.7 },
  kenya: { image: "https://images.unsplash.com/photo-1516426122078-c23e76319888?w=800", tag: "سفاري كينيا", tagEn: "Kenya Safari", rating: 4.8 },
  france: { image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", tag: "سحر باريس", tagEn: "Paris Magic", rating: 4.7 },
  thailand: { image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800", tag: "تايلاند الخلابة", tagEn: "Amazing Thailand", rating: 4.6 },
  turkey: { image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800", tag: "تركيا الساحرة", tagEn: "Enchanting Turkey", rating: 4.7 },
  egypt: { image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800", tag: "مصر القديمة", tagEn: "Ancient Egypt", rating: 4.8 },
  dubai: { image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", tag: "دبي الفاخرة", tagEn: "Luxury Dubai", rating: 4.9 },
};

function matchDestinations(query, lang) {
  if (!query) return [];
  const q = query.toLowerCase();
  return destinationsList.filter(d =>
    d[lang].toLowerCase().includes(q) || d.id.includes(q)
  );
}

export function getSuggestions(fromQuery, toQuery, lang) {
  const from = matchDestinations(fromQuery, lang);
  const to = matchDestinations(toQuery, lang);

  let results = [];
  // If specific destination chosen, show suggestions for those
  if (to.length > 0 && to.length <= 3) {
    to.forEach(d => {
      if (suggestionsPool[d.id]) {
        const pool = suggestionsPool[d.id];
        results.push({
          id: d.id,
          image: pool.image,
          title: lang === "ar" ? `رحلة إلى ${d.ar}` : `Trip to ${d.en}`,
          tag: pool.tag,
          tagEn: pool.tagEn,
          rating: pool.rating,
          price: Math.floor(500 + Math.random() * 3000),
          description: lang === "ar" ? `استمتع بأجمل الأوقات في ${d.ar} مع باقة سياحية متكاملة تشمل الفنادق والجولات والمواصلات` : `Enjoy the best times in ${d.en} with a complete travel package including hotels, tours, and transportation`,
        });
      }
    });
  }

  // Fallback: random popular
  if (results.length === 0) {
    const keys = Object.keys(suggestionsPool);
    const shuffled = keys.sort(() => Math.random() - 0.5).slice(0, 4);
    shuffled.forEach(id => {
      const d = destinationsList.find(x => x.id === id);
      if (!d) return;
      const pool = suggestionsPool[id];
      results.push({
        id,
        image: pool.image,
        title: lang === "ar" ? `رحلة إلى ${d.ar}` : `Trip to ${d.en}`,
        tag: pool.tag,
        tagEn: pool.tagEn,
        rating: pool.rating,
        price: Math.floor(500 + Math.random() * 3000),
        description: lang === "ar" ? `استمتع بأجمل الأوقات في ${d.ar} مع باقة سياحية متكاملة` : `Enjoy the best times in ${d.en} with a complete travel package`,
      });
    });
  }

  return results;
}

export function getMatchedDestinations(query, lang) {
  return matchDestinations(query, lang);
}
