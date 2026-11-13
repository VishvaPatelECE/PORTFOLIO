import type { Metadata } from "next";

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ||
  "https://www.vishvaprojects.in";

export const SITE_URL = RAW_SITE_URL;
export const SITE_NAME = "VishvaProjects";
export const AUTHOR_NAME = "Vishva Patel";
export const BRAND_TAB_TITLE = "Vishva Patel | Systems & ECE";
export const DEFAULT_TITLE = BRAND_TAB_TITLE;
export const DEFAULT_DESCRIPTION =
  "Electronics & Communication Engineering portfolio by Vishva Patel: RANGraph wireless telemetry compiler, GraphMARL vehicular MARL research at SVNIT, DARVS computer-vision prototype, and USMHACS digital hardware access control.";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Vishva Patel — Systems & ECE Engineering Portfolio",
} as const;

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  index?: boolean;
  absoluteTitle?: boolean;
}): Metadata {
  const canonicalUrl = absoluteUrl(path);
  return {
    title: { absolute: BRAND_TAB_TITLE },
    description,
    keywords,
    alternates: {
      canonical: path === "/" ? "/" : path,
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: canonicalUrl,
      title: title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export function serializeJsonLd(data: Record<string, unknown> | Array<Record<string, unknown>>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    url: SITE_URL,
    email: "mailto:vishvapatel.ece@gmail.com",
    jobTitle: "Electronics & Communication Engineering Undergraduate & Systems Engineer",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Dharmsinh Desai University",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nadiad",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
    },
    sameAs: [
      "https://github.com/VishvaPatelECE",
      "https://www.linkedin.com/in/vishva-patel-ece",
      "https://www.instagram.com/vishva_1503/",
    ],
    knowsAbout: [
      "Wireless Communications",
      "Radio Access Network Telemetry",
      "Domain-Specific Compilers",
      "Multi-Agent Reinforcement Learning",
      "Computer Vision and Liveness Verification",
      "Digital Hardware Logic Design",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
  };
}

export function projectJsonLd({
  name,
  description,
  path,
  keywords,
  type = "SoftwareSourceCode",
  codeRepository,
  programmingLanguage,
}: {
  name: string;
  description: string;
  path: string;
  keywords: string[];
  type?: string;
  codeRepository?: string;
  programmingLanguage?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: absoluteUrl(path),
    author: { "@id": `${SITE_URL}/#person` },
    keywords: keywords.join(", "),
    ...(codeRepository ? { codeRepository } : {}),
    ...(programmingLanguage ? { programmingLanguage } : {}),
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    name: "About Vishva Patel — Engineering Background, Systems & Capabilities",
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function experiencePageJsonLd({
  title,
  description,
  path,
  organization,
}: {
  title: string;
  description: string;
  path: string;
  organization: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Report",
    name: title,
    description,
    url: absoluteUrl(path),
    author: { "@id": `${SITE_URL}/#person` },
    sourceOrganization: {
      "@type": "CollegeOrUniversity",
      name: organization,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Surat",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
    },
    inLanguage: "en",
  };
}

