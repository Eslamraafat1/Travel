"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Search, Star, ArrowRight, ArrowLeft, Compass,
  Loader2, Sparkles, ChevronDown, Plane, Umbrella, Mountain, Building2,
  Tent, Gem, Clock, Heart, Quote, ChevronRight, ChevronLeft,
  Route, RefreshCw
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { getMergedContent } from "@/lib/contentStore";
import { getSuggestions, getMatchedDestinations, destinationsList } from "@/lib/api/planner";
import styles from "./planner.module.css";

// ===== STATIC BILINGUAL DATA =====

const categoriesData = [
  { id: "beach", label: "Beach & Islands", desc: "Enjoy pristine beaches and crystal-clear turquoise waters", icon: <Umbrella size={28} />, color: "#00b4d8", gradient: "linear-gradient(135deg, #00b4d8, #0077b6)" },
  { id: "adventure", label: "Adventure Travel", desc: "Mountain climbing, skydiving, and white-water rafting", icon: <Mountain size={28} />, color: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #166534)" },
  { id: "cultural", label: "Cultural Heritage", desc: "Explore history and heritage at world-famous museums and sites", icon: <Building2 size={28} />, color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #b45309)" },
  { id: "desert", label: "Desert Safari", desc: "Adventures in the heart of the desert under starlit skies", icon: <Tent size={28} />, color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #991b1b)" },
  { id: "luxury", label: "Luxury Travel", desc: "Finest resorts and exclusive services around the world", icon: <Gem size={28} />, color: "#a855f7", gradient: "linear-gradient(135deg, #a855f7, #6b21a8)" },
  { id: "family", label: "Family Trips", desc: "Destinations and activities suitable for the whole family", icon: <Heart size={28} />, color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #9d174d)" },
];

const spotlightData = [
  { id: "swiss-spot", label: "Switzerland", desc: "Breathtaking Alps, blue lakes, and charming villages", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=900", tag: "Switzerland", rating: 4.8, trips: 95 },
  { id: "japan-spot", label: "Japan", desc: "Unique blend of ancient traditions and cutting-edge technology", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900", tag: "Japan", rating: 4.9, trips: 108 },
];

const storiesData = [
  { id: "story1", title: "Trip of a lifetime!", text: "Maldives was the best experience of my life. The overwater villas, stunning views, and excellent service made our honeymoon unforgettable", name: "Ahmed & Mariam", avatar: "https://i.pravatar.cc/80?img=11", location: "Maldives" },
  { id: "story2", title: "Swiss Adventure", text: "Hiking the Alps and riding mountain trains was an extraordinary experience. The scenery is breathtaking", name: "Sarah", avatar: "https://i.pravatar.cc/80?img=5", location: "Switzerland" },
  { id: "story3", title: "Magic of Japan", text: "Cherry blossom season in Japan is indescribable. Ancient temples and modern technology - a wonderful blend", name: "Khaled", avatar: "https://i.pravatar.cc/80?img=9", location: "Japan" },
];

// Static icons for each section
const categoryIconsData = categoriesData.map(c => ({ icon: c.icon, color: c.color, gradient: c.gradient }));
const storyAvatarsData = storiesData.map(s => ({ avatar: s.avatar }));

// ----- MAP DESTINATIONS (visual map pins) -----
const mapDestinations = [
  { id: "md1", label: "Maldives", x: 22, y: 38, color: "#00b4d8", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400", rating: 4.9, tag: "Tropical Paradise" },
  { id: "md2", label: "Switzerland", x: 48, y: 24, color: "#22c55e", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400", rating: 4.8, tag: "Alps" },
  { id: "md3", label: "Japan", x: 82, y: 18, color: "#ef4444", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", rating: 4.9, tag: "Culture & Tradition" },
  { id: "md4", label: "Italy", x: 52, y: 34, color: "#f59e0b", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400", rating: 4.7, tag: "History & Art" },
  { id: "md5", label: "Dubai", x: 38, y: 48, color: "#a855f7", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", rating: 4.6, tag: "Luxury & Modern" },
  { id: "md6", label: "Thailand", x: 70, y: 52, color: "#ec4899", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400", rating: 4.5, tag: "Tropical Islands" },
  { id: "md7", label: "Greece", x: 56, y: 32, color: "#00d4ff", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400", rating: 4.7, tag: "Enchanting Islands" },
  { id: "md8", label: "Turkey", x: 44, y: 30, color: "#ef4444", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400", rating: 4.4, tag: "Culture & History" },
  { id: "md9", label: "Kenya", x: 34, y: 62, color: "#22c55e", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", rating: 4.6, tag: "Safari" },
  { id: "md10", label: "Malaysia", x: 74, y: 44, color: "#f59e0b", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400", rating: 4.3, tag: "Beautiful Nature" },
];

// ----- HIDDEN TREASURES -----
const hiddenData = [
  { id: "soq", label: "Socotra - Yemen", desc: "Land of natural wonders with alien-like Dragon Blood trees and unique biodiversity found nowhere else on Earth", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", rating: 4.7, tag: "Rare Gem" },
  { id: "hua", label: "Huacachina - Peru", desc: "A magical oasis in the heart of the Atacama desert surrounded by golden sand dunes and a turquoise lagoon", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800", rating: 4.5, tag: "Magic Oasis" },
  { id: "hal", label: "Hallstatt - Austria", desc: "Picturesque Alpine village on the shores of a turquoise lake reflecting mountains and forests", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800", rating: 4.8, tag: "Mountain Village" },
  { id: "raj", label: "Raja Ampat - Indonesia", desc: "An underwater paradise with the world's richest marine biodiversity and stunning white sand beaches", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800", rating: 4.9, tag: "Ocean Treasure" },
  { id: "far", label: "Faroe Islands - Denmark", desc: "Dramatic islands in the North Atlantic with towering cliffs, waterfalls, and raw untouched nature", image: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=800", rating: 4.6, tag: "Raw Nature" },
  { id: "che", label: "Chichen Itza - Mexico", desc: "One of the New Seven Wonders, the ancient Mayan city deep in the jungle", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800", rating: 4.8, tag: "World Wonder" },
];

// ----- TRAVEL QUIZ -----
const quizQuestions = [
  {
    id: "q1", question: "What do you prefer in your trips?",
    options: [
      { id: "q1a", label: "Beaches & Relaxation", type: "beach", emoji: "🏖️" },
      { id: "q1b", label: "Adventure & Challenges", type: "adventure", emoji: "🧗" },
      { id: "q1c", label: "Culture & History", type: "culture", emoji: "🏛️" },
      { id: "q1d", label: "Luxury & Premium", type: "luxury", emoji: "👑" },
    ]
  },
  {
    id: "q2", question: "Where do you prefer to stay?",
    options: [
      { id: "q2a", label: "Beach Resort", type: "beach", emoji: "🌴" },
      { id: "q2b", label: "Mountain Camp", type: "adventure", emoji: "⛺" },
      { id: "q2c", label: "Historic City Hotel", type: "culture", emoji: "🏨" },
      { id: "q2d", label: "Private Villa with Service", type: "luxury", emoji: "🏡" },
    ]
  },
  {
    id: "q3", question: "What are your favorite activities?",
    options: [
      { id: "q3a", label: "Swimming & Diving", type: "beach", emoji: "🤿" },
      { id: "q3b", label: "Hiking & Skydiving", type: "adventure", emoji: "🪂" },
      { id: "q3c", label: "Museums & Ruins", type: "culture", emoji: "🏺" },
      { id: "q3d", label: "Shopping & Spas", type: "luxury", emoji: "🛍️" },
    ]
  },
  {
    id: "q4", question: "What's your favorite travel food?",
    options: [
      { id: "q4a", label: "Fresh Seafood", type: "beach", emoji: "🦐" },
      { id: "q4b", label: "Local Adventurous Dishes", type: "adventure", emoji: "🌮" },
      { id: "q4c", label: "Authentic Traditional Food", type: "culture", emoji: "🍜" },
      { id: "q4d", label: "Michelin Star Restaurants", type: "luxury", emoji: "🍽️" },
    ]
  },
];

const quizResults = [
  { type: "beach", icon: "🏖️", title: "Beach Lover", desc: "You love sun, sand, and crystal-clear waters. Your ideal trip involves lounging on pristine beaches, swimming in turquoise seas, and watching golden sunsets. Destinations like Maldives, Seychelles, and Thailand await you!", color: "#00b4d8" },
  { type: "adventure", icon: "🧗", title: "Adventure Seeker", desc: "You thrive on adrenaline and challenges. Your perfect trip includes hiking rugged mountains, diving deep oceans, and exploring uncharted territories. New Zealand, Costa Rica, and Nepal await you!", color: "#22c55e" },
  { type: "culture", icon: "🏛️", title: "Culture Explorer", desc: "You're fascinated by history, art, and traditions. Your dream trip involves visiting ancient monuments, museums, and immersing yourself in local cultures. Egypt, Greece, India, and Japan await your discovery!", color: "#f59e0b" },
  { type: "luxury", icon: "👑", title: "Luxury Traveler", desc: "You appreciate the finer things in life. Your ideal vacation includes five-star resorts, gourmet dining, exclusive experiences, and premium service. Dubai, Monaco, and luxury Maldives await you!", color: "#a855f7" },
];

// ----- STATS DATA (animated counters) -----
const statsData = [
  { id: "trips", icon: "✈️", target: 2847, suffix: "+", color: "#ff6b35", label: "Trips Completed" },
  { id: "travelers", icon: "🧑‍🤝‍🧑", target: 12480, suffix: "+", color: "#00b4d8", label: "Happy Travelers" },
  { id: "countries", icon: "🌍", target: 56, suffix: "", color: "#22c55e", label: "Countries" },
  { id: "partners", icon: "🤝", target: 340, suffix: "+", color: "#a855f7", label: "Partners" },
];

// ----- CLIMATE DATA -----
const climateData = [
  { id: "c1", label: "Maldives", temp: 30, season: "Nov - Apr", condition: "Sunny", icon: "☀️", gradient: "linear-gradient(135deg, #00b4d8, #0077b6)" },
  { id: "c2", label: "Switzerland", temp: 18, season: "Jun - Sep", condition: "Mild", icon: "⛅", gradient: "linear-gradient(135deg, #22c55e, #166534)" },
  { id: "c3", label: "Japan", temp: 22, season: "Mar-May / Oct-Nov", condition: "Pleasant", icon: "🌸", gradient: "linear-gradient(135deg, #ec4899, #9d174d)" },
  { id: "c4", label: "Italy", temp: 25, season: "Apr-Jun / Sep-Oct", condition: "Warm", icon: "🍝", gradient: "linear-gradient(135deg, #f59e0b, #b45309)" },
  { id: "c5", label: "Thailand", temp: 32, season: "Nov - Feb", condition: "Dry", icon: "🌴", gradient: "linear-gradient(135deg, #ef4444, #991b1b)" },
  { id: "c6", label: "New Zealand", temp: 20, season: "Dec - Mar", condition: "Sunny", icon: "🏔️", gradient: "linear-gradient(135deg, #00d4ff, #0369a1)" },
];

// ----- SCENIC ROUTES DATA -----
const scenicRoutesData = [
  { id: "sr1", label: "Pacific Coast Highway", desc: "From California to Washington along the stunning West Coast", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", stops: 8, days: 14, color: "#00b4d8" },
  { id: "sr2", label: "Alpine Route", desc: "Through snowy peaks and green valleys of Switzerland and Austria", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800", stops: 6, days: 10, color: "#22c55e" },
  { id: "sr3", label: "Modern Silk Road", desc: "Journey through Central Asia from Istanbul to Samarkand", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800", stops: 10, days: 21, color: "#f59e0b" },
  { id: "sr4", label: "Garden Route", desc: "South Africa's green coast from Cape Town to Port Elizabeth", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800", stops: 5, days: 7, color: "#ef4444" },
  { id: "sr5", label: "Himalayan Circuit", desc: "Through high mountain passes of Nepal, Tibet, and Bhutan", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800", stops: 7, days: 18, color: "#a855f7" },
];

// ----- WANDER WHEEL (spinning wheel of fortune) -----
const wheelData = [
  { id: "ww1", label: "Maldives", emoji: "🏝️", gradient: "linear-gradient(135deg, #00b4d8, #0077b6)", desc: "Tropical paradise with overwater villas and turquoise waters" },
  { id: "ww2", label: "Japan", emoji: "🗾", gradient: "linear-gradient(135deg, #ef4444, #9d174d)", desc: "Unique blend of ancient traditions and cutting-edge tech" },
  { id: "ww3", label: "Switzerland", emoji: "🏔️", gradient: "linear-gradient(135deg, #22c55e, #166534)", desc: "Breathtaking Alps, sparkling blue lakes" },
  { id: "ww4", label: "Thailand", emoji: "🌴", gradient: "linear-gradient(135deg, #ec4899, #831843)", desc: "Tropical islands, rich culture, irresistible food" },
  { id: "ww5", label: "Italy", emoji: "🍝", gradient: "linear-gradient(135deg, #f59e0b, #92400e)", desc: "Ancient history, magnificent art, world-class cuisine" },
  { id: "ww6", label: "Kenya", emoji: "🦁", gradient: "linear-gradient(135deg, #f97316, #9a3412)", desc: "Thrilling safaris and incredible wildlife" },
  { id: "ww7", label: "New Zealand", emoji: "🌿", gradient: "linear-gradient(135deg, #00d4ff, #0369a1)", desc: "Stunning green landscapes and unforgettable adventures" },
  { id: "ww8", label: "Greece", emoji: "🏛️", gradient: "linear-gradient(135deg, #0ea5e9, #1e3a5f)", desc: "Enchanting islands and unmatched sunsets" },
];

// ----- DESTINY DNA (radar chart traits) -----
const dnaData = [
  { id: "d1", label: "Maldives", desc: "Peaceful haven for sea lovers and relaxation", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400", traits: [2, 9, 5, 4, 10, 3], color: "#00b4d8" },
  { id: "d2", label: "Switzerland", desc: "Perfect destination for nature lovers and adventures", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400", traits: [5, 10, 6, 8, 6, 3], color: "#22c55e" },
  { id: "d3", label: "Japan", desc: "Where ancient history meets cutting-edge technology", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", traits: [10, 5, 9, 3, 4, 7], color: "#ef4444" },
  { id: "d4", label: "Italy", desc: "Cradle of art, food, and history", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400", traits: [9, 4, 10, 3, 6, 7], color: "#f59e0b" },
  { id: "d5", label: "Dubai", desc: "Luxury and modernity in the golden desert", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", traits: [2, 2, 7, 5, 8, 10], color: "#a855f7" },
  { id: "d6", label: "Thailand", desc: "Vibrant tropical paradise full of life and culture", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400", traits: [6, 7, 9, 7, 8, 6], color: "#ec4899" },
];

// ----- PASSPORT STAMPS (flip cards) -----
const stampData = [
  { id: "st1", label: "Maldives", emoji: "🏝️", year: "2024", desc: "Coral islands and crystal waters" },
  { id: "st2", label: "Japan", emoji: "🗾", year: "2024", desc: "Cherry blossoms and ancient temples" },
  { id: "st3", label: "Italy", emoji: "🍝", year: "2023", desc: "Colosseum and authentic pizza" },
  { id: "st4", label: "Switzerland", emoji: "🏔️", year: "2023", desc: "Snowy peaks and mountain trains" },
  { id: "st5", label: "Dubai", emoji: "🌆", year: "2024", desc: "Skyscrapers and golden desert" },
  { id: "st6", label: "Greece", emoji: "🏛️", year: "2023", desc: "White-washed Santorini islands" },
  { id: "st7", label: "Kenya", emoji: "🦁", year: "2024", desc: "Masai Mara safari" },
  { id: "st8", label: "Thailand", emoji: "🌴", year: "2023", desc: "Stunning Phuket beaches" },
];

// ----- COLOR VIBES (gradient bars with meanings) -----
const vibeData = [
  { id: "v1", label: "Maldives", colors: ["#00b4d8","#0077b6","#90e0ef","#023e8a"], meanings: ["Ocean", "Depth", "Breeze", "Sunset"] },
  { id: "v2", label: "Switzerland", colors: ["#22c55e","#166534","#86efac","#14532d"], meanings: ["Forests", "Peaks", "Meadows", "Pines"] },
  { id: "v3", label: "Japan", colors: ["#ef4444","#ec4899","#fca5a5","#9d174d"], meanings: ["Cherry", "Sakura", "Dawn", "Tradition"] },
  { id: "v4", label: "Italy", colors: ["#f59e0b","#92400e","#fde68a","#b45309"], meanings: ["Sun", "Pizza", "Sand", "Wine"] },
  { id: "v5", label: "Dubai", colors: ["#a855f7","#6b21a8","#d8b4fe","#3b0764"], meanings: ["Luxury", "Gold", "Lights", "Desert"] },
  { id: "v6", label: "Greece", colors: ["#0ea5e9","#1e3a5f","#7dd3fc","#0f172a"], meanings: ["Sea", "Night", "Sky", "White"] },
  { id: "v7", label: "Kenya", colors: ["#f97316","#9a3412","#fdba74","#431407"], meanings: ["Sunrise", "Earth", "Gold", "Soil"] },
];

// ----- SKY LENS (camera viewfinder) -----
const lensData = [
  { id: "l1", label: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600", tag: "Islands" },
  { id: "l2", label: "Switzerland", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600", tag: "Mountains" },
  { id: "l3", label: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600", tag: "Culture" },
  { id: "l4", label: "Italy", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600", tag: "History" },
  { id: "l5", label: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600", tag: "City" },
  { id: "l6", label: "Greece", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600", tag: "Islands" },
  { id: "l7", label: "Kenya", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600", tag: "Safari" },
  { id: "l8", label: "Thailand", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600", tag: "Islands" },
];

function StatCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);
  useEffect(() => {
    if (!ref.current || counted.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { clearInterval(timer); setCount(target); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref} className={styles.statsNumber}>{count}{suffix}</span>;
}

export default function PlannerPage() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [contentVer, setContentVer] = useState(0);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [focusField, setFocusField] = useState(null);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [storyIdx, setStoryIdx] = useState(0);
  const [mapHover, setMapHover] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelPick, setWheelPick] = useState(null);
  const [dnaActive, setDnaActive] = useState(0);
  const [vibeHover, setVibeHover] = useState(null);
  const [lensActive, setLensActive] = useState(false);
  const [lensPick, setLensPick] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const [budgetLevel, setBudgetLevel] = useState(1);
  const [budgetDays, setBudgetDays] = useState(7);
  const [budgetPeople, setBudgetPeople] = useState(2);
  const [climateHover, setClimateHover] = useState(null);
  const router = useRouter();

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      const seed = (i * 7.3 + 13.7) % 1;
      arr.push({
        left: `${((i * 5.1 + 3.9) % 100)}%`,
        top: `${((i * 7.7 + 11.3) % 100)}%`,
        size: `${2 + ((i * 3.1 + 1.7) % 1) * 4}px`,
        delay: (i * 0.37 + 0.13) % 4,
        duration: 3 + ((i * 0.53 + 0.71) % 1) * 4,
      });
    }
    return arr;
  }, []);

  const bubbleParticles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      left: `${(i * 7.1 + 3.3) % 100}%`,
      delay: (i * 0.43 + 0.17) % 5,
      size: 4 + ((i * 2.9 + 1.3) % 1) * 8,
      duration: 6 + ((i * 0.61 + 0.37) % 1) * 6,
    }));
  }, []);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const resultsRef = useRef(null);

  const forceUpdate = useCallback(() => setContentVer(v => v + 1), []);
  useEffect(() => {
    window.addEventListener("storage", forceUpdate);
    return () => window.removeEventListener("storage", forceUpdate);
  }, [forceUpdate]);
  const ct = useCallback((k) => getMergedContent(k, t(k), lang), [t, lang]);

  useEffect(() => {
    const handler = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setFocusField(f => f === "from" ? null : f);
      if (toRef.current && !toRef.current.contains(e.target)) setFocusField(f => f === "to" ? null : f);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (storiesData.length === 0) return;
    const interval = setInterval(() => setStoryIdx(i => (i + 1) % storiesData.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const updateFrom = (val) => {
    setFrom(val);
    setSelectedFrom(null);
    const matches = getMatchedDestinations(val, lang);
    setFromSuggestions(matches);
  };

  const updateTo = (val) => {
    setTo(val);
    setSelectedTo(null);
    const matches = getMatchedDestinations(val, lang);
    setToSuggestions(matches);
  };

  const selectFrom = (d) => {
    setFrom(d[lang]);
    setSelectedFrom(d);
    setFromSuggestions([]);
    setFocusField("to");
    toRef.current?.querySelector("input")?.focus();
  };

  const selectTo = (d) => {
    setTo(d[lang]);
    setSelectedTo(d);
    setToSuggestions([]);
  };

  const handleSearch = () => {
    const q = selectedTo ? selectedTo[lang] : to;
    if (!q.trim()) return;
    setSearching(true);
    setSearched(false);
    setTimeout(() => {
      const suggestions = getSuggestions(from, to, lang);
      setResults(suggestions);
      setSearching(false);
      setSearched(true);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 800);
  };

  // Merge locale data with static visuals
  const cats = categoriesData.map(c => ({
    ...c,
    title: c[lang],
    desc: lang === "ar" ? c.descAr : c.descEn,
  }));

  const spots = spotlightData.map(s => ({
    ...s,
    tag: lang === "ar" ? s.tagAr : s.tagEn,
    desc: lang === "ar" ? s.descAr : s.descEn,
    title: s[lang],
  }));

  const stories = storiesData.map(s => ({
    ...s,
    text: lang === "ar" ? s.textAr : s.textEn,
    name: lang === "ar" ? s.nameAr : s.nameEn,
    location: lang === "ar" ? s.locationAr : s.locationEn,
  }));

  const curStory = stories[storyIdx] || {};

  // New section merges
  const mapItems = mapDestinations.map(m => ({
    ...m,
    tag: lang === "ar" ? m.tagAr : m.tagEn,
    title: m[lang],
  }));

  const hiddenItems = hiddenData.map(h => ({
    ...h,
    title: h[lang],
    desc: lang === "ar" ? h.descAr : h.descEn,
    tag: lang === "ar" ? h.tagAr : h.tagEn,
  }));

  const quizQ = quizQuestions.map(q => ({
    ...q,
    question: lang === "ar" ? q.questionAr : q.questionEn,
    options: q.options.map(o => ({ ...o, label: lang === "ar" ? o.ar : o.en })),
  }));

  const resultData = quizResults.map(r => ({
    ...r,
    title: lang === "ar" ? r.titleAr : r.titleEn,
    desc: lang === "ar" ? r.descAr : r.descEn,
  }));

  const statsItems = statsData.map(s => ({
    ...s,
    label: lang === "ar" ? s.labelAr : s.labelEn,
  }));

  const climateItems = climateData.map(c => ({
    ...c,
    title: c[lang],
    season: lang === "ar" ? c.seasonAr : c.seasonEn,
    condition: lang === "ar" ? c.conditionAr : c.conditionEn,
  }));

  const scenicRoutes = scenicRoutesData.map(r => ({
    ...r,
    title: r[lang],
    desc: lang === "ar" ? r.descAr : r.descEn,
  }));

  const wheelItems = wheelData.map(w => ({
    ...w,
    desc: lang === "ar" ? w.descAr : w.descEn,
  }));

  const dnaItems = dnaData.map(d => ({
    ...d,
    title: d[lang],
    desc: lang === "ar" ? d.descAr : d.descEn,
  }));

  const stampItems = stampData.map(s => ({
    ...s,
    name: s[lang],
    desc: lang === "ar" ? s.descAr : s.descEn,
  }));

  const vibeItems = vibeData.map(v => ({
    ...v,
    name: v[lang],
    meanings: v.meanings.map(m => m[lang]),
  }));

  const lensItems = lensData.map(l => ({
    ...l,
    name: l[lang],
    tag: lang === "ar" ? l.tagAr : l.tagEn,
  }));

  // Budget calculations
  const dailyRate = [80, 200, 500][budgetLevel];
  const accommodationRate = [50, 120, 300][budgetLevel];
  const flightCost = [300, 800, 2000][budgetLevel];
  const totalEstimate = (dailyRate + accommodationRate) * budgetDays * budgetPeople + flightCost;
  const perPerson = Math.round(totalEstimate / budgetPeople);

  const handleQuizAnswer = (type) => {
    const newAnswers = [...quizAnswers, type];
    setQuizAnswers(newAnswers);
    if (quizStep < quizQ.length - 1) {
      setQuizStep(s => s + 1);
    } else {
      const counts = {};
      newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
      const resultType = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      setQuizResult(resultData.find(r => r.type === resultType) || resultData[0]);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  return (
    <main>
      <Navbar />

      {/* ============================
          HERO SECTION
      ============================ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroParticles}>
          {particles.map((p, i) => (
            <motion.div key={i} className={styles.particle}
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            />
          ))}
        </div>
        <div className={styles.heroOverlay} />
        <motion.div className={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span className={styles.heroTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={16} /> {ct('planner.heroTag')}
          </motion.span>
          <h1 className={styles.heroTitle}>
            {ct('planner.heroTitle1')} <span className="gradient-text">{ct('planner.heroTitleAccent')}</span>
          </h1>
          <p className={styles.heroSub}>{ct('planner.heroSubtitle')}</p>
        </motion.div>

        {/* Search Card */}
        <motion.div className={styles.searchCard}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className={styles.searchRow}>
            <div className={styles.searchField} ref={fromRef}>
              <label className={styles.fieldLabel}>
                <Plane size={14} className={styles.fieldIcon} />
                {ct('planner.from')}
              </label>
              <input
                value={from}
                onChange={e => updateFrom(e.target.value)}
                onFocus={() => setFocusField("from")}
                placeholder={ct('planner.fromPlaceholder')}
                className={styles.fieldInput}
              />
              <AnimatePresence>
                {focusField === "from" && fromSuggestions.length > 0 && (
                  <motion.div className={styles.dropdown}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {fromSuggestions.map(d => (
                      <button key={d.id} className={styles.dropdownItem}
                        onClick={() => selectFrom(d)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <span className={styles.dropdownDot} style={{ background: d.color }} />
                        <span>{d[lang]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.swapIcon}>
              <ArrowIcon size={18} />
            </div>

            <div className={styles.searchField} ref={toRef}>
              <label className={styles.fieldLabel}>
                <MapPin size={14} className={styles.fieldIcon} />
                {ct('planner.to')}
              </label>
              <input
                value={to}
                onChange={e => updateTo(e.target.value)}
                onFocus={() => setFocusField("to")}
                placeholder={ct('planner.toPlaceholder')}
                className={styles.fieldInput}
              />
              <AnimatePresence>
                {focusField === "to" && toSuggestions.length > 0 && (
                  <motion.div className={styles.dropdown}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {toSuggestions.map(d => (
                      <button key={d.id} className={styles.dropdownItem}
                        onClick={() => selectTo(d)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <span className={styles.dropdownDot} style={{ background: d.color }} />
                        <span>{d[lang]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button className={styles.searchBtn}
              onClick={handleSearch}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={searching}
            >
              {searching ? <Loader2 size={20} className={styles.spin} /> : <Search size={20} />}
              {ct('planner.searchBtn')}
            </motion.button>
          </div>

          <div className={styles.popularRow}>
            <span className={styles.popularLabel}>{ct('planner.popular')}</span>
            <div className={styles.popularTags}>
              {["Maldives", "Switzerland", "Japan", "Italy"].map(name => {
                const d = destinationsList.find(x => x.en === name);
                if (!d) return null;
                return (
                  <button key={d.id} className={styles.popularTag}
                    onClick={() => { setTo(d[lang]); setSelectedTo(d); }}
                  >
                    {d[lang]}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ============================
          TRAVEL CATEGORIES
      ============================ */}
      <section className={`section ${styles.categoriesSection}`}>
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.categoriesTag')}</span>
            <h2 className="section-title">
              {ct('planner.categoriesTitle1')}<span className="gradient-text">{ct('planner.categoriesTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.categoriesSubtitle')}</p>
          </motion.div>

          <div className={styles.catGrid}>
            {cats.map((cat, i) => (
              <motion.button key={cat.id} className={styles.catCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={styles.catIconWrap} style={{ background: cat.gradient }}>
                  {cat.icon}
                </div>
                <h3 className={styles.catTitle}>{cat.title}</h3>
                <p className={styles.catDesc}>{cat.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          INTERACTIVE MAP
      ============================ */}
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.mapTag')}</span>
            <h2 className="section-title">
              {ct('planner.mapTitle1')}<span className="gradient-text">{ct('planner.mapTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.mapSubtitle')}</p>
          </motion.div>

          <div className={styles.mapWorld}>
            <div className={styles.mapGrid} />
            {mapItems.map((m, i) => (
              <div key={m.id} className={styles.mapPinWrapper}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                onMouseEnter={() => setMapHover(m.id)}
                onMouseLeave={() => setMapHover(null)}
              >
                <motion.div className={styles.mapPin}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                  style={{ background: m.color }}
                >
                  <motion.div className={styles.mapPulse}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 + (i * 0.15) % 2 }}
                    style={{ background: m.color }}
                  />
                </motion.div>
                <motion.div className={styles.mapLabel}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: mapHover === m.id ? 1 : 0, x: mapHover === m.id ? 0 : -10 }}
                >
                  {m.title}
                </motion.div>
                <AnimatePresence>
                  {mapHover === m.id && (
                    <motion.div className={styles.mapCard}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.mapCardImage}>
                        <img src={m.image} alt={m.title} />
                      </div>
                      <div className={styles.mapCardBody}>
                        <div className={styles.mapCardRating}>
                          <Star size={12} fill="#ffd700" color="#ffd700" />
                          <span>{m.rating}</span>
                        </div>
                        <h4>{m.title}</h4>
                        <span className={styles.mapCardTag}>{m.tag}</span>
                        <button className={styles.mapCardBtn}
                          onClick={() => { router.push(`/packages?dest=${encodeURIComponent(m.title)}`); }}
                        >
                          {ct('planner.mapExplore')} <ArrowIcon size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          RESULTS SECTION
      ============================ */}
      {(searched || searching) && (
        <section className={styles.resultsSection} ref={resultsRef}>
          <div className="container">
            {searching ? (
              <div className={styles.loadingState}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                  <Compass size={48} className={styles.loadingIcon} />
                </motion.div>
                <motion.p className={styles.loadingText}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {ct('planner.searching')}
                </motion.p>
              </div>
            ) : (
              <>
                <motion.div className={styles.resultsHeader}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2>{ct('planner.resultsTitle')}</h2>
                  <p>{ct('planner.resultsSubtitle')}</p>
                </motion.div>
                <div className={styles.resultsGrid}>
                  {results.map((item, i) => (
                    <motion.div key={item.id} className={styles.resultCard}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      whileHover={{ y: -8 }}
                    >
                      <div className={styles.resultImage}>
                        <img src={item.image} alt={item.title} />
                        <div className={styles.resultBadge}>
                          <span>{lang === "ar" ? item.tag : (item.tagEn || item.tag)}</span>
                        </div>
                      </div>
                      <div className={styles.resultBody}>
                        <div className={styles.resultRating}>
                          <Star size={14} fill="#ffd700" color="#ffd700" />
                          <span>{item.rating}</span>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <div className={styles.resultFooter}>
                          <div className={styles.resultPrice}>
                            <span className={styles.priceLabel}>{ct('planner.fromPrice')}</span>
                            <span className={styles.priceValue}>${item.price.toLocaleString()}</span>
                          </div>
                          <Link href={`/packages`} className={styles.resultBtn}>
                            {ct('planner.exploreBtn')} <ArrowIcon size={16} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ============================
          SPOTLIGHT DESTINATIONS
      ============================ */}
      <section className="section section-alt" id="spotlight">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.spotlightTag')}</span>
            <h2 className="section-title">
              {ct('planner.spotlightTitle1')}<span className="gradient-text">{ct('planner.spotlightTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.spotlightSubtitle')}</p>
          </motion.div>

          <div className={styles.spotlightGrid}>
            {spots.map((spot, i) => (
              <motion.div key={spot.id} className={styles.spotlightCard}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                onClick={() => router.push(`/packages?dest=${encodeURIComponent(spot.title)}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={`${styles.spotlightImage} ${i % 2 === 1 ? styles.spotlightImageRight : ""}`}>
                  <img src={spot.image} alt={spot.title} />
                  <div className={styles.spotlightImageOverlay} />
                  <div className={styles.spotlightTagBadge}>
                    <MapPin size={12} /> {spot.tag}
                  </div>
                </div>
                <div className={styles.spotlightContent}>
                  <div className={styles.spotlightRating}>
                    <Star size={16} fill="#ffd700" color="#ffd700" />
                    <span>{spot.rating}</span>
                    <span className={styles.spotlightTrips}>{spot.trips}+ trips</span>
                  </div>
                  <h3>{spot.title}</h3>
                  <p>{spot.desc}</p>
                  <span className="btn-primary" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    {ct('planner.travelNow')} <ArrowIcon size={18} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          BUDGET CALCULATOR
      ============================ */}
      <section className={styles.budgetSection}>
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.budgetTag')}</span>
            <h2 className="section-title">
              {ct('planner.budgetTitle1')}<span className="gradient-text">{ct('planner.budgetTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.budgetSubtitle')}</p>
          </motion.div>

          <div className={styles.budgetGrid}>
            <div className={styles.budgetControls}>
              <div className={styles.budgetControl}>
                <div className={styles.budgetLabel}>
                  <span>{ct('planner.budgetBudget')}</span>
                  <span className={styles.budgetValue}>
                    {budgetLevel === 0 ? ct('planner.budgetLow') : budgetLevel === 1 ? ct('planner.budgetMid') : ct('planner.budgetHigh')}
                  </span>
                </div>
                <div className={styles.budgetSliderTrack}>
                  {[0, 1, 2].map(i => (
                    <button key={i} className={`${styles.budgetSliderBtn} ${budgetLevel === i ? styles.budgetSliderActive : ""}`}
                      style={budgetLevel === i ? { background: ["#22c55e", "#f59e0b", "#a855f7"][i] } : {}}
                      onClick={() => setBudgetLevel(i)}
                    >
                      <span className={styles.budgetSliderIcon}>{["💰", "⭐", "👑"][i]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.budgetControl}>
                <div className={styles.budgetLabel}>
                  <span>{ct('planner.budgetDuration')}</span>
                  <span className={styles.budgetValue}>{budgetDays} {ct('planner.budgetNights')}</span>
                </div>
                <input type="range" min="1" max="30" value={budgetDays}
                  onChange={e => setBudgetDays(Number(e.target.value))}
                  className={styles.budgetRange}
                />
                <div className={styles.budgetRangeLabels}>
                  <span>1</span><span>7</span><span>14</span><span>21</span><span>30</span>
                </div>
              </div>

              <div className={styles.budgetControl}>
                <div className={styles.budgetLabel}>
                  <span>{ct('planner.budgetTravelers')}</span>
                  <span className={styles.budgetValue}>{budgetPeople} {ct('planner.budgetPerson')}</span>
                </div>
                <input type="range" min="1" max="8" value={budgetPeople}
                  onChange={e => setBudgetPeople(Number(e.target.value))}
                  className={styles.budgetRange}
                />
                <div className={styles.budgetRangeLabels}>
                  <span>1</span><span>2</span><span>4</span><span>6</span><span>8</span>
                </div>
              </div>
            </div>

            <div className={styles.budgetResult}>
              <motion.div className={styles.budgetTotalCard}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className={styles.budgetTotalLabel}>{ct('planner.budgetTotal')}</div>
                <motion.div className={styles.budgetTotalAmount}
                  key={`${totalEstimate}-${lang}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ${totalEstimate.toLocaleString()}
                </motion.div>
                <div className={styles.budgetPerPerson}>
                  {ct('planner.budgetPerPerson')}: <strong>${perPerson.toLocaleString()}</strong>
                </div>
              </motion.div>

              <div className={styles.budgetBreakdown}>
                <div className={styles.budgetBreakdownTitle}>{ct('planner.budgetBreakdown')}</div>
                {[
                  { label: ct('planner.budgetAccommodation'), value: accommodationRate * budgetDays * budgetPeople, color: "#00b4d8" },
                  { label: ct('planner.budgetFlights'), value: flightCost, color: "#f59e0b" },
                  { label: ct('planner.budgetFood'), value: dailyRate * 0.6 * budgetDays * budgetPeople, color: "#22c55e" },
                  { label: ct('planner.budgetOther'), value: dailyRate * 0.4 * budgetDays * budgetPeople, color: "#a855f7" },
                ].map((item, i) => {
                  const pct = totalEstimate > 0 ? (item.value / totalEstimate) * 100 : 0;
                  return (
                    <div key={i} className={styles.budgetBreakdownItem}>
                      <div className={styles.budgetBreakdownHeader}>
                        <span className={styles.budgetBreakdownLabel}>
                          <span className={styles.budgetBreakdownDot} style={{ background: item.color }} />
                          {item.label}
                        </span>
                        <span className={styles.budgetBreakdownAmount}>${Math.round(item.value).toLocaleString()}</span>
                      </div>
                      <div className={styles.budgetBreakdownBar}>
                        <motion.div className={styles.budgetBreakdownFill}
                          style={{ background: item.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(pct, 100)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          CLIMATE & WEATHER GUIDE
      ============================ */}
      <section className={styles.climateSection}>
        <div className={styles.climateBgDecor}>
          <motion.div className={styles.climateSun}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            ☀️
          </motion.div>
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.climateTag')}</span>
            <h2 className="section-title">
              {ct('planner.climateTitle1')}<span className="gradient-text">{ct('planner.climateTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.climateSubtitle')}</p>
          </motion.div>

          <div className={styles.climateGrid}>
            {climateItems.map((c, i) => (
              <motion.div key={c.id} className={styles.climateCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onMouseEnter={() => setClimateHover(c.id)}
                onMouseLeave={() => setClimateHover(null)}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => router.push(`/packages?dest=${encodeURIComponent(c.title)}&season=${encodeURIComponent(c.season)}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.climateCardBg} style={{ background: c.gradient }} />
                <motion.div className={styles.climateTempBadge}
                  animate={climateHover === c.id ? { rotate: [0, -10, 10, -5, 0], scale: 1.1 } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {c.icon}
                </motion.div>
                <h3 className={styles.climateDestName}>{c.title}</h3>
                <div className={styles.climateTemp}>
                  <motion.span className={styles.climateTempValue}
                    key={c.temp}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {c.temp}
                  </motion.span>
                  <span className={styles.climateTempUnit}>{ct('planner.climateTemp')}</span>
                </div>
                <div className={styles.climateSeason}>
                  <span>{c.season}</span>
                </div>
                <div className={styles.climateCond}>
                  <span>{c.condition}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          SCENIC ROUTES EXPLORER
      ============================ */}
      <section className={styles.panoramaSection}>
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.panoramaTag')}</span>
            <h2 className="section-title">
              {ct('planner.panoramaTitle1')}<span className="gradient-text">{ct('planner.panoramaTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.panoramaSubtitle')}</p>
          </motion.div>

          <div className={styles.panoramaGrid}>
            {scenicRoutes.map((r, i) => (
              <motion.div key={r.id} className={styles.panoramaCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.01 }}
                onClick={() => router.push(`/packages?route=${encodeURIComponent(r.title)}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.panoramaImage}>
                  <img src={r.image} alt={r.title} />
                  <div className={styles.panoramaOverlay} />
                  <div className={styles.panoramaRouteLine}>
                    {Array.from({ length: r.stops }).map((_, j) => (
                      <motion.div key={j} className={styles.panoramaStop}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                      />
                    ))}
                  </div>
                  <div className={styles.panoramaBadge} style={{ background: r.color }}>
                    <Route size={12} /> {r.stops} stops
                  </div>
                </div>
                <div className={styles.panoramaBody}>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                  <div className={styles.panoramaMeta}>
                    <div className={styles.panoramaMetaItem}>
                      <Clock size={14} />
                      <span>{r.days} {ct('planner.panoramaDays')}</span>
                    </div>
                    <div className={styles.panoramaMetaItem}>
                      <MapPin size={14} />
                      <span>{r.stops} stops</span>
                    </div>
                  </div>
                  <span className={styles.panoramaBtn} style={{ borderColor: r.color, color: r.color }}>
                    {ct('planner.panoramaDiscover')} <ArrowIcon size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          TRAVELER STORIES
      ============================ */}
      <section className="section section-alt" id="stories">
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.storiesTag')}</span>
            <h2 className="section-title">
              {ct('planner.storiesTitle1')}<span className="gradient-text">{ct('planner.storiesTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.storiesSubtitle')}</p>
          </motion.div>

          <div className={styles.storiesWrapper}>
            <AnimatePresence mode="wait">
              {stories.length > 0 && (
                <motion.div key={storyIdx} className={styles.storyCard}
                  initial={{ opacity: 0, x: isRtl ? 60 : -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? -60 : 60 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={styles.storyBgDecor} />
                  <button className={styles.storyNavLeft}
                    onClick={() => setStoryIdx(i => (i - 1 + stories.length) % stories.length)}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className={styles.storyContent}>
                    <Quote size={36} className={styles.storyQuote} />
                    <p className={styles.storyText}>{curStory.text}</p>
                    <div className={styles.storyAuthor}>
                      <img src={curStory.avatar} alt={curStory.name} className={styles.storyAvatar} />
                      <div>
                        <h4 className={styles.storyName}>{curStory.name}</h4>
                        <span className={styles.storyLocation}>
                          <MapPin size={12} /> {curStory.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className={styles.storyNavRight}
                    onClick={() => setStoryIdx(i => (i + 1) % stories.length)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.storyDots}>
              {stories.map((_, i) => (
                <button key={i} className={`${styles.storyDot} ${i === storyIdx ? styles.storyDotActive : ""}`}
                  onClick={() => setStoryIdx(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          LIVE STATS DASHBOARD
      ============================ */}
      <section className={styles.statsSection}>
        <div className={styles.statsBgDecor}>
          {[1,2,3,4,5,6].map(i => (
            <motion.div key={i} className={styles.statsOrb}
              style={{
                width: 100 + i * 40,
                height: 100 + i * 40,
                top: `${10 + (i * 13) % 70}%`,
                left: `${5 + (i * 17) % 80}%`,
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.statsTag')}</span>
            <h2 className="section-title">
              {ct('planner.statsTitle1')}<span className="gradient-text">{ct('planner.statsTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.statsSubtitle')}</p>
          </motion.div>

          <div className={styles.statsGrid}>
            {statsItems.map((s, i) => (
              <motion.div key={s.id} className={styles.statsCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className={styles.statsIcon} style={{ background: `${s.color}18`, color: s.color }}>
                  {s.icon}
                </div>
                <StatCounter target={s.target} suffix={s.suffix} />
                <span className={styles.statsLabel}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          HIDDEN TREASURES
      ============================ */}
      <section className={styles.hiddenSection}>
        <div className={styles.hiddenBg}>
          {bubbleParticles.map((b, i) => (
            <motion.div key={i} className={styles.hiddenBubble}
              style={{ left: b.left, width: b.size, height: b.size }}
              animate={{ y: [0, -600, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: "linear" }}
            />
          ))}
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.hiddenTag')}</span>
            <h2 className="section-title">
              {ct('planner.hiddenTitle1')}<span className="gradient-text">{ct('planner.hiddenTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.hiddenSubtitle')}</p>
          </motion.div>

          <div className={styles.hiddenGrid}>
            {hiddenItems.map((h, i) => (
              <motion.div key={h.id} className={styles.hiddenCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => router.push(`/packages?dest=${encodeURIComponent(h.title)}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.hiddenImage}>
                  <img src={h.image} alt={h.title} />
                  <div className={styles.hiddenGlow} style={{ background: `radial-gradient(ellipse at center, ${i % 2 === 0 ? '#00d4ff' : '#a855f7'}40, transparent 70%)` }} />
                  <div className={styles.hiddenBadge}>
                    <Sparkles size={12} /> {h.tag}
                  </div>
                </div>
                <div className={styles.hiddenBody}>
                  <div className={styles.hiddenRating}>
                    <Star size={13} fill="#ffd700" color="#ffd700" />
                    <span>{h.rating}</span>
                  </div>
                  <h3>{h.title}</h3>
                  <p>{h.desc}</p>
                  <span className={styles.hiddenBtn}>
                    {ct('planner.learnMore')} <ArrowIcon size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          TRAVEL QUIZ
      ============================ */}
      <section className={styles.quizSection}>
        <div className={styles.quizBgDecor}>
          <div className={styles.quizOrb} />
          <div className={styles.quizOrb2} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {!quizStarted ? (
            <motion.div className={styles.quizIntro}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-tag">{ct('planner.quizTag')}</span>
              <h2 className="section-title">
                {ct('planner.quizTitle1')}<span className="gradient-text">{ct('planner.quizTitleAccent')}</span>
              </h2>
              <p className="section-subtitle">{ct('planner.quizSubtitle')}</p>
              <motion.button className={styles.quizStartBtn}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setQuizStarted(true)}
              >
                <Sparkles size={20} /> {ct('planner.quizStart')}
              </motion.button>
            </motion.div>
          ) : quizResult ? (
            <motion.div className={styles.quizResultBox}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
              <motion.div className={styles.quizResultIcon}
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                {quizResult.icon}
              </motion.div>
              <motion.h3 className={styles.quizResultTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {quizResult.title}
              </motion.h3>
              <motion.p className={styles.quizResultDesc}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {quizResult.desc}
              </motion.p>
              <motion.button className={styles.quizRetryBtn}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={resetQuiz}
              >
                <RefreshCw size={18} /> {ct('planner.quizRetry')}
              </motion.button>
            </motion.div>
          ) : (
            <div className={styles.quizContent}>
              <motion.div className={styles.quizProgress}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                <div className={styles.quizProgressBar}>
                  <motion.div className={styles.quizProgressFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${((quizStep + 1) / quizQ.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className={styles.quizStepText}>
                  {ct('planner.quizQuestion')} {quizStep + 1} {ct('planner.quizOf')} {quizQ.length}
                </span>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div key={quizStep} className={styles.quizQuestionBox}
                  initial={{ opacity: 0, x: isRtl ? 60 : -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? -60 : 60 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className={styles.quizQuestionText}>{quizQ[quizStep].question}</h3>
                  <div className={styles.quizOptions}>
                    {quizQ[quizStep].options.map((opt) => (
                      <motion.button key={opt.id} className={styles.quizOption}
                        whileHover={{ scale: 1.03, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleQuizAnswer(opt.type)}
                      >
                        <span className={styles.quizOptionEmoji}>{opt.emoji}</span>
                        <span className={styles.quizOptionLabel}>{opt.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ============================
          ALL DESTINATIONS
      ============================ */}
      <section className={styles.allDestSection}>
        <div className="container">
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.destinationsTag')}</span>
            <h2 className="section-title">
              {ct('planner.destinationsTitle1')}<span className="gradient-text">{ct('planner.destinationsTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.destinationsSubtitle')}</p>
          </motion.div>

          <div className={styles.destGrid}>
            {destinationsList.map((d, i) => (
              <motion.button key={d.id} className={styles.destCard}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => { setTo(d[lang]); setSelectedTo(d); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <div className={styles.destIcon} style={{ background: `${d.color}20`, color: d.color }}>
                  <MapPin size={22} />
                </div>
                <span className={styles.destName}>{d[lang]}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          WANDER WHEEL
      ============================ */}
      <section className={styles.wheelSection}>
        <div className={styles.wheelContainer}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.wheelTag')}</span>
            <h2 className="section-title">
              {ct('planner.wheelTitle1')}<span className="gradient-text">{ct('planner.wheelTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.wheelSubtitle')}</p>
          </motion.div>

          <div className={styles.wheelContent}>
            <div className={styles.wheelOuter}>
              <div className={styles.wheelNeedle} />
              <motion.div className={styles.wheel}
                animate={{ rotate: wheelRotation }}
                transition={{ duration: 3, ease: [0.17, 0.67, 0.12, 0.99] }}
                style={{
                  background: `conic-gradient(${wheelItems.map((w, i) => {
                    const start = (360 / wheelItems.length) * i;
                    const end = (360 / wheelItems.length) * (i + 1);
                    return `${w.gradient} ${start}deg ${end}deg`;
                  }).join(', ')})`,
                }}
              >
                {wheelItems.map((w, i) => {
                  const midAngle = (360 / wheelItems.length) * i + (360 / wheelItems.length) / 2;
                  return (
                    <div key={w.id} className={styles.wheelSegment}
                      style={{
                        transform: `rotate(${midAngle}deg) translateY(-80px) rotate(-${midAngle}deg)`,
                      }}
                    >
                      <span className={styles.wheelSegmentIcon}>{w.emoji}</span>
                      <span className={styles.wheelSegmentLabel}>{w[lang]}</span>
                    </div>
                  );
                })}
              </motion.div>
              <div className={styles.wheelCenter}>🎯</div>
            </div>

            <div className={styles.wheelSide}>
              {!wheelPick ? (
                <motion.button className={styles.wheelBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={spinning}
                  onClick={() => {
                    if (spinning) return;
                    setSpinning(true);
                    setWheelPick(null);
                    const spins = 5 + Math.floor(Math.random() * 5);
                    const target = Math.floor(Math.random() * wheelItems.length);
                    const segAngle = 360 / wheelItems.length;
                    const rotation = spins * 360 + target * segAngle + segAngle / 2;
                    setWheelRotation(prev => prev + rotation);
                    setTimeout(() => {
                      setWheelPick(wheelItems[target]);
                      setSpinning(false);
                    }, 3200);
                  }}
                >
                  {spinning ? '🔄' : ct('planner.wheelSpin')}
                </motion.button>
              ) : (
                <motion.div className={styles.wheelResult}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <span className={styles.wheelResultLabel}>{ct('planner.wheelResult')}</span>
                  <div className={styles.wheelResultEmoji}>{wheelPick.emoji}</div>
                  <h3 className={styles.wheelResultName}>{wheelPick[lang]}</h3>
                  <p className={styles.wheelResultDesc}>{wheelPick.desc}</p>
                  <motion.button className={styles.wheelBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWheelPick(null)}
                  >
                    {ct('planner.wheelTry')}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          DESTINY DNA
      ============================ */}
      <section className={styles.dnaSection}>
        <div className={styles.dnaContainer}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.dnaTag')}</span>
            <h2 className="section-title">
              {ct('planner.dnaTitle1')}<span className="gradient-text">{ct('planner.dnaTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.dnaSubtitle')}</p>
          </motion.div>

          <div className={styles.dnaGrid}>
            <div className={styles.dnaChart}>
              <svg viewBox="0 0 300 300" className={styles.dnaSvg}>
                {[0,1,2,3,4,5].map(i => {
                  const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                  const x = 150 + 120 * Math.cos(angle);
                  const y = 150 + 120 * Math.sin(angle);
                  return (
                    <line key={i} x1="150" y1="150" x2={x} y2={y}
                      stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                    />
                  );
                })}
                {[1,2,3].map(level => (
                  <polygon key={level}
                    points={[0,1,2,3,4,5].map(i => {
                      const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                      const r = 120 * (level / 4);
                      return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                    }).join(' ')}
                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                  />
                ))}
                {dnaItems.length > 0 && (
                  <motion.polygon
                    key={dnaActive}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    points={dnaItems[dnaActive].traits.map((t, i) => {
                      const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                      const r = (t / 10) * 120;
                      return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                    }).join(' ')}
                    fill={dnaItems[dnaActive].color + "40"}
                    stroke={dnaItems[dnaActive].color}
                    strokeWidth="2.5"
                  />
                )}
                {dnaItems.length > 0 && dnaItems[dnaActive].traits.map((t, i) => {
                  const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                  const r = (t / 10) * 120;
                  const cx = 150 + r * Math.cos(angle);
                  const cy = 150 + r * Math.sin(angle);
                  return (
                    <motion.circle key={i} cx={cx} cy={cy} r="4"
                      fill={dnaItems[dnaActive].color}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                    />
                  );
                })}
              </svg>
              <div className={styles.dnaLabels}>
                {[
                  ct('planner.dnaTrait1'), ct('planner.dnaTrait2'), ct('planner.dnaTrait3'),
                  ct('planner.dnaTrait4'), ct('planner.dnaTrait5'), ct('planner.dnaTrait6'),
                ].map((label, i) => {
                  const angle = (360 / 6) * i;
                  return (
                    <div key={i} className={styles.dnaAxis}
                      style={{ transform: `rotate(${angle}deg) translateY(-130px) rotate(-${angle}deg)` }}
                    >
                      <span className={styles.dnaAxisLabel}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.dnaPicks}>
              {dnaItems.map((d, i) => (
                <motion.button key={d.id} className={`${styles.dnaPick} ${dnaActive === i ? styles.dnaPickActive : ''}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDnaActive(i)}
                >
                  <div className={styles.dnaPickDot} style={{ background: d.color }} />
                  <span className={styles.dnaPickName}>{d[lang]}</span>
                </motion.button>
              ))}
              {dnaItems.length > 0 && (
                <motion.p key={dnaActive} className={styles.dnaPickDesc}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {dnaItems[dnaActive].desc}
                </motion.p>
              )}
              {dnaItems.length > 0 && (
                <motion.button className={styles.dnaBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/packages?dest=${encodeURIComponent(dnaItems[dnaActive][lang])}`)}
                >
                  {ct('planner.dnaExplore')} <ArrowRight size={14} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          PASSPORT STAMPS
      ============================ */}
      <section className={styles.stampSection}>
        <div className={styles.stampContainer}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.stampTag')}</span>
            <h2 className="section-title">
              {ct('planner.stampTitle1')}<span className="gradient-text">{ct('planner.stampTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.stampSubtitle')}</p>
          </motion.div>

          <div className={styles.stampGrid}>
            {stampItems.map((s, i) => (
              <motion.div key={s.id} className={styles.stampCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className={styles.stampInner}>
                  <div className={styles.stampFront}>
                    <div className={styles.stampEmoji}>{s.emoji}</div>
                    <div className={styles.stampName}>{s.name}</div>
                    <div className={styles.stampYear}>{s.year}</div>
                  </div>
                  <div className={styles.stampBack}>
                    <div className={styles.stampBackEmoji}>🖇️</div>
                    <p className={styles.stampDesc}>{s.desc}</p>
                    <div className={styles.stampYear}>{s.year}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          COLOR VIBES
      ============================ */}
      <section className={styles.vibeSection}>
        <div className={styles.vibeContainer}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.vibeTag')}</span>
            <h2 className="section-title">
              {ct('planner.vibeTitle1')}<span className="gradient-text">{ct('planner.vibeTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.vibeSubtitle')}</p>
          </motion.div>

          <div className={styles.vibeGrid}>
            {vibeItems.map((v, i) => (
              <motion.div key={v.id} className={styles.vibeBar}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onMouseEnter={() => setVibeHover(v.id)}
                onMouseLeave={() => setVibeHover(null)}
              >
                <div className={styles.vibeBarLabel}>{v.name}</div>
                <div className={styles.vibeBarTrack}>
                  <motion.div className={styles.vibeBarFill}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ background: `linear-gradient(90deg, ${v.colors.join(', ')})` }}
                  />
                </div>
                <div className={styles.vibeSwatches}>
                  {v.colors.map((c, j) => (
                    <div key={j} className={styles.vibeSwatch}
                      onMouseEnter={() => setVibeHover(v.id + '-' + j)}
                      onMouseLeave={() => setVibeHover(null)}
                    >
                      <div className={styles.vibeSwatchDot} style={{ background: c }} />
                      <span className={styles.vibeSwatchName}>
                        {vibeHover === v.id + '-' + j ? v.meanings[j] : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          SKY LENS
      ============================ */}
      <section className={styles.lensSection}>
        <div className={styles.lensContainer}>
          <motion.div className="section-header"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">{ct('planner.lensTag')}</span>
            <h2 className="section-title">
              {ct('planner.lensTitle1')}<span className="gradient-text">{ct('planner.lensTitleAccent')}</span>
            </h2>
            <p className="section-subtitle">{ct('planner.lensSubtitle')}</p>
          </motion.div>

          <div className={styles.lensViewfinder}>
            {!lensActive ? (
              <motion.div className={styles.lensIdle}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              >
                <div className={styles.lensFrame}>
                  <div className={styles.lensCrosshairH} />
                  <div className={styles.lensCrosshairV} />
                  <div className={styles.lensCornerTL} />
                  <div className={styles.lensCornerTR} />
                  <div className={styles.lensCornerBL} />
                  <div className={styles.lensCornerBR} />
                  <motion.div className={styles.lensCircle}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                </div>
                <motion.button className={styles.lensCaptureBtn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const pick = lensItems[Math.floor(Math.random() * lensItems.length)];
                    setLensPick(pick);
                    setLensActive(true);
                    setTimeout(() => setLensActive(false), 4000);
                  }}
                >
                  {ct('planner.lensCapture')}
                </motion.button>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div className={styles.lensResult}
                  initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.3, rotate: 10 }}
                >
                  <div className={styles.lensResultImage}>
                    <img src={lensPick.image} alt={lensPick.name} />
                    <div className={styles.lensResultOverlay} />
                  </div>
                  <div className={styles.lensResultInfo}>
                    <span className={styles.lensResultTag}>{lensPick.tag}</span>
                    <h3 className={styles.lensResultName}>{lensPick.name}</h3>
                  </div>
                  <motion.button className={styles.lensCaptureBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setLensActive(false)}
                  >
                    {ct('planner.lensAgain')}
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
