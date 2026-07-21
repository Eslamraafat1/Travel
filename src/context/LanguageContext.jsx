"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { en } from "../locales/en";
import { ar } from "../locales/ar";

const translations = { en, ar };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("app-lang") || "ar";
    setLang(saved);
    applyLang(saved);
    setMounted(true);
  }, []);

  const applyLang = (l) => {
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
    if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  };

  const toggleLang = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("app-lang", newLang);
    applyLang(newLang);
  };

  const t = (key, params = {}) => {
    const keys = key.split(".");
    let value = translations[lang];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    if (typeof value === "string") {
      return value.replace(/\{(\w+)\}/g, (_, param) => params[param] ?? `{${param}}`);
    }
    return value;
  };

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: "ar", t: (k) => k }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
