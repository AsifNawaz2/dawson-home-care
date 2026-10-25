// content/areas.ts
// Source: 04_CONTENT_INVENTORY.md → "Service area (towns)" (assumptions, TO CONFIRM at reveal).
// Copy: COPY_AREAS.md. Map spec: 07 §5.
//
// RULES
// - Every town is confirmed:false until the client confirms it. `npm run prelaunch` lists them.
// - Town pages exist only for hasPage:true. While confirmed:false they are noindex + out of sitemap.xml.
// - driveMinutes are rough estimates from the office (driveConfirmed:false). Shown as "About {n} min".
// - coords = approximate community center for the SVG map. Not a route, not for navigation.
// - ZIPs can be shared by several towns (e.g. 29902/29906). matchAreas() returns all matches.

export type AreaTier = "primary" | "extended";

export interface Area {
  slug: string;
  name: string;
  /** "in Port Royal" vs "on Lady's Island" */
  preposition: "in" | "on";
  /** Primary county */
  county: string;
  /** Other counties the community or its ZIP reaches into */
  alsoInCounties?: string[];
  zipCodes: string[];
  coords: { lat: number; lng: number };
  tier: AreaTier;
  hasPage: boolean;
  /** Approximate drive from the office, in minutes. min === max for a single figure. */
  driveMinutes: { min: number; max: number };
  driveConfirmed: boolean;
  /** Extra names people type into "Do you serve my town?" */
  searchAliases: string[];
  /** Slugs of nearby towns WITH pages, for the "Also nearby" chips */
  nearby: string[];
  confirmed: boolean;
}

export const OFFICE = {
  name: "Dawson and Dawson Home Care LLC",
  street: "69 Robert Smalls Parkway, Suite 3F",
  city: "Beaufort",
  state: "SC",
  zip: "29906",
  // Approximate. Replace with the geocoded point that matches the Google Business Profile.
  coords: { lat: 32.44, lng: -80.7 },
  coordsConfirmed: false,
} as const;

export const areas: Area[] = [
  // ── Primary (near our office) ──────────────────────────────────────────────
  {
    slug: "beaufort",
    name: "Beaufort",
    preposition: "in",
    county: "Beaufort",
    // 29902 + 29906 = residential; 29901, 29903 = PO boxes; 29904 = MCAS Beaufort; 29905 = Parris Island
    zipCodes: ["29901", "29902", "29903", "29904", "29905", "29906"],
    coords: { lat: 32.4316, lng: -80.6698 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 10, max: 10 },
    driveConfirmed: false,
    searchAliases: ["Downtown Beaufort", "Historic District", "Mossy Oaks", "Pigeon Point"],
    nearby: ["port-royal", "ladys-island", "burton"],
    confirmed: false,
  },
  {
    slug: "port-royal",
    name: "Port Royal",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29935"],
    coords: { lat: 32.3791, lng: -80.6926 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 15, max: 15 },
    driveConfirmed: false,
    searchAliases: ["Old Village"],
    nearby: ["beaufort", "ladys-island", "burton"],
    confirmed: false,
  },
  {
    slug: "ladys-island",
    name: "Lady's Island",
    preposition: "on",
    county: "Beaufort",
    zipCodes: ["29907"],
    coords: { lat: 32.425, lng: -80.64 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 15, max: 15 },
    driveConfirmed: false,
    searchAliases: ["Ladys Island", "Ladies Island", "Lady Island"],
    nearby: ["beaufort", "st-helena-island", "port-royal"],
    confirmed: false,
  },
  {
    slug: "st-helena-island",
    name: "St. Helena Island",
    preposition: "on",
    county: "Beaufort",
    zipCodes: ["29920"],
    coords: { lat: 32.392, lng: -80.573 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 25, max: 25 },
    driveConfirmed: false,
    searchAliases: ["Saint Helena", "Saint Helena Island", "St Helena", "Frogmore"],
    nearby: ["ladys-island", "beaufort"],
    confirmed: false,
  },
  {
    slug: "burton",
    name: "Burton",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29902", "29906"],
    coords: { lat: 32.4206, lng: -80.755 },
    tier: "primary",
    hasPage: true,
    driveMinutes: { min: 5, max: 5 },
    driveConfirmed: false,
    searchAliases: ["Laurel Bay"],
    nearby: ["beaufort", "port-royal", "okatie"],
    confirmed: false,
  },
  {
    slug: "shell-point",
    name: "Shell Point",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29902", "29906"],
    coords: { lat: 32.3833, lng: -80.7424 },
    tier: "primary",
    hasPage: false,
    driveMinutes: { min: 12, max: 12 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["port-royal", "burton"],
    confirmed: false,
  },
  {
    slug: "seabrook",
    name: "Seabrook",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29940"],
    coords: { lat: 32.5527, lng: -80.74 },
    tier: "primary",
    hasPage: false,
    driveMinutes: { min: 20, max: 20 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["burton", "beaufort"],
    confirmed: false,
  },
  {
    slug: "sheldon",
    name: "Sheldon",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29941"],
    coords: { lat: 32.5348, lng: -80.8197 },
    tier: "primary",
    hasPage: false,
    driveMinutes: { min: 25, max: 25 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["burton"],
    confirmed: false,
  },

  // ── Extended service area ──────────────────────────────────────────────────
  {
    slug: "okatie",
    name: "Okatie",
    preposition: "in",
    county: "Beaufort",
    alsoInCounties: ["Jasper"],
    // 29909 is also used by parts of Bluffton (USPS alias); it resolves to Okatie here.
    zipCodes: ["29909"],
    coords: { lat: 32.3277, lng: -80.8933 },
    tier: "extended",
    hasPage: true,
    driveMinutes: { min: 25, max: 30 },
    driveConfirmed: false,
    searchAliases: [
      "Sun City",
      "Sun City Hilton Head",
      "Riverbend",
      "Oldfield",
      "Callawassie Island",
      "Spring Island",
    ],
    nearby: ["bluffton", "burton", "hilton-head-island"],
    confirmed: false,
  },
  {
    slug: "bluffton",
    name: "Bluffton",
    preposition: "in",
    county: "Beaufort",
    zipCodes: ["29910"],
    coords: { lat: 32.2371, lng: -80.8604 },
    tier: "extended",
    hasPage: true,
    driveMinutes: { min: 35, max: 40 },
    driveConfirmed: false,
    searchAliases: ["Old Town Bluffton"],
    nearby: ["okatie", "hilton-head-island"],
    confirmed: false,
  },
  {
    slug: "hilton-head-island",
    name: "Hilton Head Island",
    preposition: "on",
    county: "Beaufort",
    // 29926 (north) + 29928 (south) = residential; 29925, 29938 = PO boxes
    zipCodes: ["29925", "29926", "29928", "29938"],
    coords: { lat: 32.2163, lng: -80.7526 },
    tier: "extended",
    hasPage: true,
    driveMinutes: { min: 45, max: 55 },
    driveConfirmed: false,
    searchAliases: ["Hilton Head", "HHI", "Sea Pines"],
    nearby: ["bluffton", "okatie"],
    confirmed: false,
  },
  {
    slug: "ridgeland",
    name: "Ridgeland",
    preposition: "in",
    county: "Jasper",
    zipCodes: ["29936"],
    coords: { lat: 32.4802, lng: -80.9801 },
    tier: "extended",
    hasPage: false,
    driveMinutes: { min: 30, max: 30 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["okatie"],
    confirmed: false,
  },
  {
    slug: "hardeeville",
    name: "Hardeeville",
    preposition: "in",
    county: "Jasper",
    zipCodes: ["29927"],
    coords: { lat: 32.2871, lng: -81.079 },
    tier: "extended",
    hasPage: false,
    driveMinutes: { min: 40, max: 45 },
    driveConfirmed: false,
    searchAliases: [],
    nearby: ["bluffton"],
    confirmed: false,
  },
  {
    slug: "yemassee",
    name: "Yemassee",
    preposition: "in",
    county: "Hampton",
    alsoInCounties: ["Beaufort"],
    zipCodes: ["29945"],
    coords: { lat: 32.6918, lng: -80.8509 },
    tier: "extended",
    hasPage: false,
    driveMinutes: { min: 30, max: 30 },
    driveConfirmed: false,
    searchAliases: ["Pocotaligo"],
    nearby: ["burton"],
    confirmed: false,
  },
];

// ── Helpers (pure, no side effects) ──────────────────────────────────────────

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);

export const areasWithPages = () => areas.filter((a) => a.hasPage);

export const areasByTier = (tier: AreaTier) =>
  areas.filter((a) => a.tier === tier).sort((a, b) => a.driveMinutes.min - b.driveMinutes.min);

/** "15" or "35–40" (en dash) */
export const formatDrive = ({ min, max }: Area["driveMinutes"]) =>
  min === max ? `${min}` : `${min}–${max}`;

/**
 * "Do you serve my town?" search.
 * - 5-digit input → every town using that ZIP (can be several).
 * - Text (3+ chars) → exact or prefix match on name or alias.
 * Returns [] for no match (UI shows the "We may still be able to help" state).
 */
export function matchAreas(query: string): Area[] {
  const q = query.trim();
  if (/^\d{5}$/.test(q)) return areas.filter((a) => a.zipCodes.includes(q));
  const n = norm(q);
  if (n.length < 3) return [];
  const names = (a: Area) => [a.name, ...a.searchAliases].map(norm);
  const exact = areas.filter((a) => names(a).includes(n));
  if (exact.length) return exact;
  return areas.filter((a) => names(a).some((x) => x.startsWith(n)));
}

/** Id of a town's row in the "Towns we serve" list (map markers for towns without a page link here). */
export const townRowId = (slug: string) => `town-row-${slug}`;
