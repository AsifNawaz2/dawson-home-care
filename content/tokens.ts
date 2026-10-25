/** The 16 locked color tokens (BRAND_FINAL §2) — used by the styleguide and static logo exports. */
export const colorTokens = [
  { token: "plum-950", hex: "#1C0F3D", use: "Darkest sections, footer, text on leaf buttons" },
  { token: "plum-800", hex: "#2A1856", use: "Primary brand: headings, Call button, logo" },
  { token: "plum-600", hex: "#4B2E91", use: "Hover states, gradient mid-point" },
  { token: "plum-100", hex: "#EEE9F8", use: "Lavender panels, selected states, closed chip" },
  {
    token: "orchid-500",
    hex: "#C25BD9",
    use: "Signature accent: glows, cursor ring, display accents (≥40px)",
  },
  {
    token: "orchid-700",
    hex: "#8E3BA8",
    use: "Accessible orchid: links, eyebrows, icons on light",
  },
  { token: "orchid-100", hex: "#F6EAFB", use: "Blush panels, quiz answers, placeholder chips" },
  {
    token: "leaf-500",
    hex: "#94C723",
    use: "Action green: Free Assessment button (plum-950 text)",
  },
  { token: "leaf-700", hex: "#4A7309", use: "Accessible green for text/icons on light" },
  { token: "leaf-100", hex: "#EEF6DC", use: "Success panels, 'office open' chip" },
  { token: "cream", hex: "#FBF8F3", use: "Page background" },
  { token: "white", hex: "#FFFFFF", use: "Cards, surfaces" },
  { token: "ink", hex: "#1E1A2B", use: "Body text" },
  { token: "muted", hex: "#5B5670", use: "Secondary text, input borders" },
  { token: "line", hex: "#E7E1EE", use: "Decorative borders and dividers only" },
  { token: "alert-700", hex: "#B42318", use: "Errors only: text, icon, 2px border" },
] as const;

type Token = (typeof colorTokens)[number]["token"];
/** token name → hex, for places that can't use CSS variables (OG images, static exports). */
export const tokens = Object.fromEntries(colorTokens.map((t) => [t.token, t.hex])) as Record<
  Token,
  string
>;
