import type { Metadata } from "next";
import "@fontsource-variable/anybody/standard.css";
import "@fontsource-variable/recursive/full.css";
import "@fontsource-variable/texturina/index.css";
import "@fontsource-variable/fraunces/index.css";
import "@fontsource/instrument-serif/index.css";
import "@fontsource-variable/syne/index.css";
import "@fontsource/aclonica/index.css";
import "./custom-fonts.css";
import "./globals.css";
import "./laboratory.css";
import "./signal.css";
import "./v1-simulator.css";
import "./scan-entry.css";
import "./project-showcase.css";
import "./project-cards.css";
import "./editorial.css";
import "./cinematic-navbar.css";
import { Header, MotionProvider } from "@/components/Shell";
import PortfolioAnalytics from "@/components/analytics/PortfolioAnalytics";
import {
  AUTHOR_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  personJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "@/lib/seo/site";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #darvs-loader {
                position: fixed;
                inset: 0;
                width: 100vw;
                height: 100svh;
                background-color: #08070b;
                z-index: 99999;
              }
              .signal-hero.intro-running .signal-identity,
              .signal-hero.intro-running .signal-avatar,
              .signal-hero.intro-running .avatar-method-toggle {
                opacity: 0;
              }
              body:has(.scan-entry) .cinematic-header,
              body.darvs-scan-active .cinematic-header,
              html:has(.scan-entry) .cinematic-header,
              body:has(.scan-entry) .vp-analytics-pill,
              body.darvs-scan-active .vp-analytics-pill,
              html:has(.scan-entry) .vp-analytics-pill {
                opacity: 0 !important;
                pointer-events: none !important;
                visibility: hidden !important;
              }
            `,
          }}
        />
      </head>
      <body id="top" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd([personJsonLd(), websiteJsonLd()]),
          }}
        />
        <MotionProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          {children}
        </MotionProvider>
        <PortfolioAnalytics />
      </body>
    </html>
  );
}

