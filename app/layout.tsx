import type { Metadata, Viewport } from "next";
import { anton, poppins, poppinsItalic } from "./fonts";
import { HEAD_SCRIPT } from "@/lib/headScript";
import { flags, siteUrl } from "@/content/site.config";
import { localBusiness } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { LogoSprite } from "@/components/brand/LogoSprite";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "In-Home Care in Beaufort, SC | Dawson & Dawson Home Care",
  description:
    "Owner-run, non-medical home care in Beaufort, SC since 2002. Personal care, home help, companionship, respite and 24-hour care. Free in-home assessment.",
  applicationName: "Dawson & Dawson Home Care",
  openGraph: { siteName: "Dawson & Dawson Home Care", locale: "en_US", type: "website" },
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
    <html
      lang="en"
      className={`${anton.variable} ${poppins.variable} ${poppinsItalic.variable}`}
      data-logo-figure={flags.logoFigure}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>
        <LogoSprite />
        {children}
        {/* Site-wide business node (SEO_PLAN §3.2); pages add their own nodes. */}
        <JsonLd data={[localBusiness()]} />
      </body>
    </html>
  );
}
