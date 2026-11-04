// Tiny localStorage-backed external store for useSyncExternalStore.
// The server snapshot is the default value, so server HTML and the first
// client render always match; the stored value is applied right after hydration.

const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener) {
  listeners.add(listener);
  const onStorage = () => listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function readKey(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeKey(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode) — state simply won't persist
  }
  emit();
}
