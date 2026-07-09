const KEY = "admin_content";

function getAll() {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveAll(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getContentOverrides(lang) {
  const all = getAll();
  return all[lang] || {};
}

export function setContentOverrides(lang, data) {
  const all = getAll();
  all[lang] = data;
  saveAll(all);
}

export function getMergedContent(keyPath, localeValue, lang) {
  const overrides = getContentOverrides(lang);
  const keys = keyPath.split(".");
  let val = overrides;
  for (const k of keys) {
    if (val && typeof val === "object" && k in val) val = val[k];
    else return localeValue;
  }
  if (val === undefined || val === null) return localeValue;
  if (Array.isArray(val) && val.length === 0) return localeValue;
  if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return localeValue;
  return val;
}
