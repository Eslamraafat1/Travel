// Server-side proxy for the Foursquare Places API v3.
// The API key (FSQ_KEY) stays on the server — the browser only talks to
// /api/places. Without a key the handler answers { configured: false } and
// the client falls back to built-in demo data (see src/lib/api/explore.js).

const FSQ_BASE = "https://api.foursquare.com/v3";

// Foursquare category IDs for the explore categories
const FSQ_CATEGORIES = {
  restaurants: "13065", // Restaurant (parent)
  hotels: "19014", // Hotel
  trips: "18000", // Landmarks & Outdoors (tours start points)
  activities: "18026", // Recreation
  transport: "19040", // Travel & Transport
  cafes: "13032", // Café / Coffee Shop
  essentials: "17000", // Services (pharmacies, banks, hospitals combined)
  malls: "17106", // Shopping Mall
  parks: "16032", // Park
};

const SEARCH_FIELDS =
  "fsq_id,name,location,geocodes,rating,stats,price,hours,photos,tel,website,description,categories,distance,verified,chains,tastes,features,popularity";
const DETAIL_FIELDS = `${SEARCH_FIELDS},hours_popular,attributes`;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

const json = (body, status = 200, headers = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const clampInt = (v, min, max, dflt) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : dflt;
};

export async function GET(request) {
  const key = process.env.FSQ_KEY;

  const sp = new URL(request.url).searchParams;
  const op = sp.get("op");
  let path;
  const params = new URLSearchParams();

  if (op === "search") {
    const category = sp.get("category");
    if (!FSQ_CATEGORIES[category]) return json({ error: "invalid_category" }, 400);
    params.set("categories", FSQ_CATEGORIES[category]);
    params.set("near", (sp.get("near") || "Cairo, Egypt").slice(0, 80));
    params.set("limit", String(clampInt(sp.get("limit"), 1, 50, 20)));
    params.set("fields", SEARCH_FIELDS);
    params.set("sort", "RELEVANCE");
    const query = sp.get("query");
    if (query) params.set("query", query.slice(0, 80));
    const cursor = sp.get("cursor");
    if (cursor) params.set("cursor", cursor.slice(0, 200));
    path = "/places/search";
  } else if (op === "detail" || op === "tips") {
    const id = sp.get("id") || "";
    if (!ID_RE.test(id)) return json({ error: "invalid_id" }, 400);
    if (op === "detail") {
      params.set("fields", DETAIL_FIELDS);
      path = `/places/${id}`;
    } else {
      params.set("limit", String(clampInt(sp.get("limit"), 1, 20, 6)));
      params.set("sort", "POPULAR");
      path = `/places/${id}/tips`;
    }
  } else {
    return json({ error: "invalid_op" }, 400);
  }

  // 200 rather than an error status, so the demo mode doesn't log console errors.
  if (!key) return json({ configured: false });

  try {
    const res = await fetch(`${FSQ_BASE}${path}?${params}`, {
      headers: { Authorization: key, Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error("[api/places] Foursquare error", res.status);
      return json({ error: "upstream_error", status: res.status }, 502);
    }
    return json(await res.json(), 200, { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" });
  } catch (err) {
    console.error("[api/places] Foursquare request failed", err?.message);
    return json({ error: "upstream_unreachable" }, 502);
  }
}
