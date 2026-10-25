/**
 * JSON-LD builders (SEO_PLAN §3). Every node is built from the data files and references the
 * business by @id. Rules (§0.4–0.5, §3.2 field notes):
 *  - No computed years, no placeholders: any field whose fact is unconfirmed is left out.
 *  - Office hours on the business; 24/7 care hours on each Service.
 *  - No Review / AggregateRating, no medical types, no FAQPage on Home or the areas hub.
 */
import {
  address,
  business,
  contact,
  credentials,
  hours,
  links,
  FOUNDED_YEAR,
} from "@/content/site.config";
import { areas, OFFICE, type Area } from "@/content/areas";
import type { Block } from "@/content/blocks";
import { faqItems } from "@/content/faq";
import { getPageSeo, type Crumb } from "@/content/seo";
import type { ServicePage } from "@/content/services";
import type { ServiceSlug } from "@/content/navigation";
import { ORIGIN, absolute } from "@/lib/seo";

type Node = Record<string, unknown>;
const BUSINESS_ID = `${ORIGIN}/#business`;
const ref = (id: string) => ({ "@id": id });
const tel = (e164: string) => e164.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "+1-$1-$2-$3");

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const ALL_DAYS = [...WEEKDAYS, "Saturday", "Sunday"];
const officeHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: WEEKDAYS,
  opens: hours.office.value.open,
  closes: hours.office.value.close,
};
const careHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ALL_DAYS,
  opens: "00:00",
  closes: "23:59",
};

/** SEO_PLAN §3.6: incorporated places are City, unincorporated communities Place. */
const CITIES = new Set([
  "beaufort",
  "port-royal",
  "bluffton",
  "hilton-head-island",
  "ridgeland",
  "hardeeville",
  "yemassee",
]);
const placeNode = (a: Area) => ({
  "@type": CITIES.has(a.slug) ? "City" : "Place",
  name: a.name,
  containedInPlace: {
    "@type": "AdministrativeArea",
    name: `${a.county} County, South Carolina`,
  },
});

/** Confirmed towns only; Beaufort (the office city) until any are confirmed. */
function areaServed() {
  const confirmed = areas.filter((a) => a.confirmed);
  if (confirmed.length) return confirmed.map(placeNode);
  return [
    {
      "@type": "City",
      name: "Beaufort",
      containedInPlace: { "@type": "State", name: "South Carolina" },
    },
  ];
}

const SERVICE_SCHEMA: Record<
  ServiceSlug,
  {
    alternateName: string;
    serviceType: string;
    description: string;
    audienceType: string;
    related: [ServiceSlug, ServiceSlug];
  }
> = {
  "personal-care": {
    alternateName: "Help with daily living (ADLs)",
    serviceType: "Non-medical personal care at home",
    description:
      "Gentle, non-medical help at home with bathing, dressing, using the bathroom and moving around safely.",
    audienceType: "Older adults who need hands-on help with daily living, and their families",
    related: ["home-help", "24-hour-care"],
  },
  "home-help": {
    alternateName: "Homemaker care",
    serviceType: "Homemaker services",
    description:
      "Meals, laundry, light housekeeping, groceries, errands and medication reminders at home. Non-medical.",
    audienceType: "Older adults who want help keeping their home running",
    related: ["companionship", "personal-care"],
  },
  companionship: {
    alternateName: "Companion care",
    serviceType: "Companion care for older adults",
    description:
      "Friendly company, conversation, games, walks and outings for older adults at home. Non-medical.",
    audienceType: "Older adults who spend a lot of time alone, and their families",
    related: ["home-help", "respite-care"],
  },
  "respite-care": {
    alternateName: "Respite",
    serviceType: "In-home respite care",
    description:
      "Care at home so a family caregiver can rest, work or travel — a few hours, a weekend or longer. Non-medical.",
    audienceType: "Family caregivers and the people they care for",
    related: ["personal-care", "24-hour-care"],
  },
  "24-hour-care": {
    alternateName: "Round-the-clock care",
    serviceType: "Overnight and 24-hour non-medical home care",
    description:
      "A caregiver through the night, or care around the clock in shifts, 7 days a week. Non-medical.",
    audienceType: "Older adults who shouldn't be alone at night, and their families",
    related: ["personal-care", "respite-care"],
  },
};
const SERVICE_NAMES: Record<ServiceSlug, string> = {
  "personal-care": "Personal Care",
  "home-help": "Home Help",
  companionship: "Companionship",
  "respite-care": "Respite Care",
  "24-hour-care": "24-Hour & Overnight Care",
};
const serviceId = (slug: string) => `${ORIGIN}/care/${slug}#service`;

/** §3.2 — on every page (root layout). */
export function localBusiness(): Node {
  const node: Node = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: business.legalName.value,
    legalName: business.legalName.value,
    alternateName: ["Dawson & Dawson Home Care", "Dawson and Dawson Home Care"],
    description:
      "Owner-run, non-medical home care in Beaufort, South Carolina, since 2002: personal care, home help, companionship, respite care, and 24-hour and overnight care.",
    url: `${ORIGIN}/`,
    logo: { "@type": "ImageObject", url: `${ORIGIN}/icons/icon-512.png`, width: 512, height: 512 },
    image: `${ORIGIN}/og/home`,
    telephone: tel(contact.phone.value.tel),
    faxNumber: tel(contact.fax.value.tel),
    email: contact.email.value,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.street.value}, ${address.suite.value}`,
      addressLocality: address.city.value,
      addressRegion: address.region.value,
      postalCode: address.postalCode.value,
      addressCountry: address.country,
    },
    openingHoursSpecification: [officeHours],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: tel(contact.phone.value.tel),
        email: contact.email.value,
        areaServed: "US",
        hoursAvailable: officeHours,
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: tel(contact.tollFree.value.tel),
        contactOption: "TollFree",
        areaServed: "US",
      },
      {
        "@type": "ContactPoint",
        contactType: "referrals",
        telephone: tel(contact.phone.value.tel),
        faxNumber: tel(contact.fax.value.tel),
        url: `${ORIGIN}/for-professionals`,
      },
    ],
    foundingDate: String(FOUNDED_YEAR),
    areaServed: areaServed(),
    knowsAbout: [
      "Non-medical home care",
      "Personal care",
      "Homemaker services",
      "Companion care",
      "Respite care",
      "Overnight care",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Home care services",
      itemListElement: (Object.keys(SERVICE_NAMES) as ServiceSlug[]).map((slug) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": serviceId(slug),
          name: SERVICE_NAMES[slug],
          url: `${ORIGIN}/care/${slug}`,
        },
      })),
    },
    sameAs: [links.instagram.value],
  };
  // Confirmed-only fields.
  if (links.googleMaps.confirmed) node.hasMap = links.googleMaps.value;
  if (OFFICE.coordsConfirmed)
    node.geo = {
      "@type": "GeoCoordinates",
      latitude: OFFICE.coords.lat,
      longitude: OFFICE.coords.lng,
    };
  if (credentials.scLicenseNumber.confirmed && credentials.scLicenseNumber.value)
    node.identifier = {
      "@type": "PropertyValue",
      name: "South Carolina in-home care provider license",
      value: credentials.scLicenseNumber.value,
    };
  if (links.googleReviews.confirmed && links.googleReviews.value)
    (node.sameAs as string[]).push(links.googleReviews.value);
  return node;
}

/** §3.3 — Home only. */
export const website = (): Node => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${ORIGIN}/#website`,
  name: "Dawson & Dawson Home Care",
  alternateName: ["Dawson and Dawson Home Care", "dawsonhomecare.com"],
  url: `${ORIGIN}/`,
  publisher: ref(BUSINESS_ID),
  inLanguage: "en-US",
});

/** §3.4 — the 5 service pages. */
export function serviceNode(page: ServicePage): Node {
  const s = SERVICE_SCHEMA[page.slug];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": serviceId(page.slug),
    name: SERVICE_NAMES[page.slug],
    alternateName: s.alternateName,
    serviceType: s.serviceType,
    category: "Non-medical home care",
    description: s.description,
    url: `${ORIGIN}/care/${page.slug}`,
    provider: ref(BUSINESS_ID),
    areaServed: areaServed(),
    hoursAvailable: careHours,
    audience: { "@type": "PeopleAudience", audienceType: s.audienceType },
    isRelatedTo: s.related.map((r) => ref(serviceId(r))),
  };
}

/** §3.5 — /care. */
export const careItemList = (): Node => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${ORIGIN}/care#services`,
  name: "Home care services from Dawson & Dawson Home Care",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: 5,
  itemListElement: (Object.keys(SERVICE_NAMES) as ServiceSlug[]).map((slug, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${ORIGIN}/care/${slug}`,
    name: SERVICE_NAMES[slug],
  })),
});

/** §3.6 — town pages (never a second LocalBusiness). */
export const townService = (a: Area): Node => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${ORIGIN}/areas-we-serve/${a.slug}#service`,
  name: `In-home care ${a.preposition} ${a.name}, SC`,
  serviceType: "Non-medical home care",
  category: "Non-medical home care",
  url: `${ORIGIN}/areas-we-serve/${a.slug}`,
  provider: ref(BUSINESS_ID),
  areaServed: placeNode(a),
  hoursAvailable: careHours,
  isRelatedTo: (Object.keys(SERVICE_NAMES) as ServiceSlug[]).map((s) => ref(serviceId(s))),
});

/** §3.7 — FAQPage from question/answer text exactly as shown in production. */
export function faqPage(path: string, qa: { q: string; a: string }[]): Node | null {
  const items = qa.filter((x) => x.q && x.a.trim());
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absolute(path)}#faq`,
    mainEntity: items.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a.trim() },
    })),
  };
}

/** /faq: production-visible items only (no hideUntilConfirmed, no Pending blocks). */
export const faqPageForFaq = () =>
  faqPage(
    "/faq",
    faqItems
      .filter((f) => f.confirmed || !f.hideUntilConfirmed)
      .map((f) => ({
        q: f.question,
        a: `${blocksToProductionText(f.answer)}${f.link ? ` ${f.link.label}` : ""}`,
      })),
  );

/** Production text of blocks: Pending blocks never ship, whatever the preview flag says. */
function blocksToProductionText(blocks: Block[]) {
  return blocks
    .filter((b) => !(typeof b === "object" && "confirmed" in b))
    .map((b) => (typeof b === "string" ? b : "list" in b ? b.list.join(". ") : ""))
    .join(" ");
}

/** Service pages: confirmed questions; the unconfirmed sentence is dropped. */
export const faqPageForService = (page: ServicePage) =>
  faqPage(
    `/care/${page.slug}`,
    page.faq.items.filter((f) => !f.hidden).map((f) => ({ q: f.q, a: f.a.text })),
  );

/** §3.8 — every inner page; labels match the visible breadcrumb. */
export function breadcrumbList(path: string): Node | null {
  const page = getPageSeo(path);
  const trail: Crumb[] = page?.breadcrumb ?? [];
  if (!trail.length) return null;
  const all = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(i < all.length - 1 ? { item: absolute(c.path) } : {}),
    })),
  };
}
