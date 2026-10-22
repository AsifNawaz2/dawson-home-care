import { Logo } from "@/components/brand/Logo";
import { CursorRing } from "@/components/cursor/CursorRing";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { flags } from "@/content/site.config";
import { ComfortControls } from "./ComfortControls";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileActionBar } from "./MobileActionBar";
import { OfficeStatusProvider } from "./OfficeStatus";

/**
 * Everything around a page: skip link, header, <main>, footer, sticky phone bar,
 * comfort controls, cursor ring, page transitions (08 §5 "(site)/layout").
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <OfficeStatusProvider>
      <PageTransitionProvider
        holdLogo={
          <Logo variant="stacked" tone="mono-plum" figure={flags.logoFigure} uid="curtain" />
        }
      >
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none" data-inert-when-menu="">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <ComfortControls />
        <CursorRing />
        <SmoothScroll />
      </PageTransitionProvider>
    </OfficeStatusProvider>
  );
}
