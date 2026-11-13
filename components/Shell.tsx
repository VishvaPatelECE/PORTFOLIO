"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, useState, useRef, useEffect } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { BrandOrbs } from "@designcodeio/threeui";
import { links } from "@/lib/content/site";
import { trackPortfolioEvent } from "@/lib/analytics/ga4";
import CosmicBG from "@/components/ui/CosmicBG";
import {
  ContactHeroTagline,
  ContactSupportingHeadline,
} from "@/components/footer/ContactTagline";

import CinematicNavbar from "@/components/navigation/CinematicNavbar";

const emptySubscribe = () => () => { };

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function Header() {
  return <CinematicNavbar />;
}
export function Footer() {
  const pathname = usePathname();
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const reduced = useReducedMotion();
  const effectiveReduced = isHydrated ? Boolean(reduced) : false;
  const footerRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || effectiveReduced) {
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px 0px 100px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [effectiveReduced]);

  // Contact section belongs exclusively on the main homepage
  if (pathname !== "/") {
    return null;
  }

  return (
    <div className="site-footer-band" style={{ position: "relative" }}>
      <div className="contact-bg-layer" aria-hidden="true">
        <CosmicBG
          coreColor="#00e5ff"
          midColor="#004c7a"
          accentColor="#d9a33d"
          outerColor="#ffffff"
          brightness={32}
          speed={15}
          detail={18}
          rotation={12}
        />
        <div className="contact-bg-overlay" />
      </div>
      <footer
        id="contact"
        ref={footerRef}
        className="site-footer wrap"
        style={{ position: "relative", zIndex: 1, background: "transparent" }}
      >
        {/* LEFT SIDE: HERO TAGLINE */}
        <div className="contact-hero-pane">
          <ContactHeroTagline isVisible={isVisible} />
        </div>

        {/* RIGHT SIDE: SUPPORTING HEADLINE + INTERNSHIP + ICONS */}
        <div className="contact-right-pane">
          <div className="contact-supporting-wrapper">
            <ContactSupportingHeadline isVisible={isVisible} />
          </div>
          <div className="contact-bottom-wrapper">
            <div className="contact-links">
              {(
                [
                  {
                    name: "GMAIL",
                    variant: "gmail" as const,
                    ariaLabel: "Send email to Vishva Patel via Gmail",
                    href: links.email,
                    onTrack: () =>
                      trackPortfolioEvent("contact_click", {
                        channel: "email",
                        source_surface: "footer_links",
                      }),
                  },
                  {
                    name: "GITHUB",
                    variant: "github",
                    ariaLabel: "Open Vishva Patel on GitHub",
                    href: links.github,
                    onTrack: () =>
                      trackPortfolioEvent("contact_click", {
                        channel: "github",
                        source_surface: "footer_links",
                      }),
                  },
                  {
                    name: "LINKEDIN",
                    variant: "linkedin",
                    ariaLabel: "Open Vishva Patel on LinkedIn",
                    href: links.linkedin,
                    onTrack: () =>
                      trackPortfolioEvent("contact_click", {
                        channel: "linkedin",
                        source_surface: "footer_links",
                      }),
                  },
                  {
                    name: "INSTAGRAM",
                    variant: "instagram",
                    ariaLabel: "Open Vishva Patel on Instagram",
                    href: links.instagram,
                    onTrack: () =>
                      trackPortfolioEvent("contact_click", {
                        channel: "instagram",
                        source_surface: "footer_links",
                      }),
                  },
                ] as const
              ).map(({ name, variant, ariaLabel, href, onTrack }) => (
                <a
                  key={name}
                  href={href}
                  className="brand-orb-link"
                  data-brand={variant}
                  aria-label={ariaLabel}
                  title={name}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noreferrer"}
                  onClick={onTrack}
                >
                  <BrandOrbs
                    variant={variant}
                    size="medium"
                    mode="dark"
                    speed={1}
                    paused={effectiveReduced}
                    aria-label={ariaLabel}
                    style={{ pointerEvents: "none", width: "100%", height: "100%", display: "block" }}
                  />
                  <span className="sr-only">{name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export function PageHeading({
  title,
  subtitle,
  children,
}: {
  code: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <Link href="/" className="back-link">
        ← RETURN TO INDEX
      </Link>
      <h1>{title}</h1>
      <div className="page-heading-bottom">
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
