import type { Metadata, Viewport } from "next";
import { anton, poppins } from "./fonts";
import { HEAD_SCRIPT } from "@/lib/headScript";
import { flags, siteUrl } from "@/content/site.config";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "In-Home Care in Beaufort, SC | Dawson & Dawson Home Care",
  description:
    "Owner-run, non-medical home care in Beaufort, SC since 2002. Personal care, home help, companionship, respite and 24-hour care. Free in-home assessment.",
  applicationName: "Dawson & Dawson Home Care",
  formatDetection: { telephone: false },
  // Preview builds are never indexed (SEO_PLAN §0 rule 8).
  robots: flags.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#FBF8F3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
