"use client";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { en } from "../locales/en";
import { ar } from "../locales/ar";
import { readKey, subscribe, writeKey } from "@/lib/localStore";

export const DEFAULT_LANG = "ar";
const STORAGE_KEY = "app-lang";
const translations = { en, ar };

const getSnapshot = () => {
  const l = readKey(STORAGE_KEY, DEFAULT_LANG);
  return l === "en" || l === "ar" ? l : DEFAULT_LANG;
};
const getServerSnapshot = () => DEFAULT_LANG;

function translate(lang, key, params = {}) {
  let value = translations[lang];
  for (const k of key.split(".")) {
    if (value && value[k] !== undefined) value = value[k];
    else return key; // Fallback to key if not found
  }
  if (typeof value === "string") {
    return value.replace(/\{(\w+)\}/g, (_, param) => params[param] ?? `{${param}}`);
  }
  return value;
}

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  t: (key, params) => translate(DEFAULT_LANG, key, params),
  toggleLang: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep <html lang dir> in sync (the inline script in the root layout sets
  // them before first paint; this handles later toggles).
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l) => writeKey(STORAGE_KEY, l), []);
  const toggleLang = useCallback(() => setLang(getSnapshot() === "ar" ? "en" : "ar"), [setLang]);
  const t = useCallback((key, params) => translate(lang, key, params), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
