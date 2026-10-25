import localFont from "next/font/local";

/** Anton — display headings (self-hosted from docs/design/fonts, SIL OFL). */
export const anton = localFont({
  src: "./fonts/anton-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-anton",
  display: "swap",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
  adjustFontFallback: false,
});

/** Poppins — body and UI. No weight 300 (body text never thinner than 400). */
export const poppins = localFont({
  src: [
    { path: "./fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

/**
 * Poppins italic — quotes only (`.q`), which sit below the fold. Its own family so it isn't
 * preloaded with the fonts every first screen needs (Lighthouse: fewer early requests).
 */
export const poppinsItalic = localFont({
  src: [
    { path: "./fonts/poppins-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/poppins-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-poppins-italic",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
