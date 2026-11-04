"use client";
// MOCK AUTH — there is no back end in this repo. "Logging in" stores a user
// object in localStorage; nothing is verified. Replace with a real session
// (e.g. HTTP-only cookie + server check) before using this in production.
import { createContext, useContext, useSyncExternalStore } from "react";
import { readKey, subscribe, writeKey } from "@/lib/localStore";

const STORAGE_KEY = "egyptGuideUser";

// Cache the parsed object per raw string so the snapshot is referentially stable.
let lastRaw = null;
let lastUser = null;
function getSnapshot() {
  const raw = readKey(STORAGE_KEY, null);
  if (raw !== lastRaw) {
    lastRaw = raw;
    try {
      lastUser = raw ? JSON.parse(raw) : null;
    } catch {
      lastUser = null;
    }
  }
  return lastUser;
}
const getServerSnapshot = () => null;

// `ready` is false during SSR/hydration, so guards don't redirect before
// the stored session has been read.
const getReady = () => true;
const getServerReady = () => false;
const noopSubscribe = () => () => {};

const AuthContext = createContext({ user: null, ready: false });

export function AuthProvider({ children }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, getReady, getServerReady);

  const saveUser = (u) => writeKey(STORAGE_KEY, u ? JSON.stringify(u) : null);

  const login = (email, password) => {
    saveUser({ email, name: email.split("@")[0] });
    return true;
  };

  const register = (name, email, password) => {
    saveUser({ email, name });
    return true;
  };

  const logout = () => saveUser(null);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
