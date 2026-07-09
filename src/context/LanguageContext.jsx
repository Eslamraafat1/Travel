"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { ar } from "../locales/ar";
import { en } from "../locales/en";

const translations = { ar, en };
const LanguageContext = createContext();

function getInitialLang() {
  if (typeof window === "undefined") return "ar";
  return localStorage.getItem("app-lang") || "ar";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    // preserve existing data-theme
    if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, [lang]);

  const toggleLanguage = () => {
    const nextLang = lang === "ar" ? "en" : "ar";
    setLang(nextLang);
    localStorage.setItem("app-lang", nextLang);
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

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
