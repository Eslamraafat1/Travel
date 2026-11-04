"use client";
import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { readKey, subscribe, writeKey } from "@/lib/localStore";

const STORAGE_KEY = "tourism-theme";
const DEFAULT_THEME = "light";

const getSnapshot = () => (readKey(STORAGE_KEY, DEFAULT_THEME) === "dark" ? "dark" : "light");
const getServerSnapshot = () => DEFAULT_THEME;
const getMounted = () => true;
const getServerMounted = () => false;
const noopSubscribe = () => () => {};

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  toggleTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(noopSubscribe, getMounted, getServerMounted);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => writeKey(STORAGE_KEY, theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
