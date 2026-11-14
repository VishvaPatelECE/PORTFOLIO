"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { links } from "@/lib/content/site";
import { isDocumentVisited, markDocumentVisited, subscribeDarvsState } from "@/lib/darvs-lifecycle";
import { projectSlugFromHref, trackPortfolioEvent } from "@/lib/analytics/ga4";

// Hydration guard
const emptySubscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "home", href: "/" },
  { id: "skills", label: "skills", href: "/#skills" },
  { id: "experience", label: "experience", href: "/#experience" },
  { id: "projects", label: "projects", href: "/#projects" },
  { id: "about", label: "about", href: "/#about" },
  { id: "contact", label: "contact", href: "/#contact" },
];

// Helper to calculate true document offset regardless of dynamic scroll position or sticky parents
function getTargetDocumentTop(targetId: string): number {
  if (targetId === "home") return 0;
  if (targetId === "contact") {
    const el = document.getElementById("contact");
    if (el) {
      return Math.round(el.getBoundingClientRect().top + window.scrollY);
    }
    return document.documentElement.scrollHeight;
  }
  const el = document.getElementById(targetId) || (targetId === "about" ? document.getElementById("about-preview") : null);
  if (!el) return 0;
  return Math.round(el.getBoundingClientRect().top + window.scrollY);
}

export default function CinematicNavbar() {
  const pathname = usePathname();
  const isHydrated = useIsHydrated();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isScanActive, setIsScanActive] = useState(false);
  const effectiveScanActive = isHydrated && pathname === "/" && isScanActive;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const currentSection = pathname === "/" ? activeSection
    : pathname.startsWith("/about") ? "about"
    : pathname.startsWith("/experience") ? "experience"
    : ["/rangraph", "/graphmarl", "/darvs", "/usmhacs"].some(route =>
      pathname === route || pathname.startsWith(`${route}/`)) ? "projects" : "";

  // Close drawer helper
  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  // Track active section on the page (Scroll Spy for home sections + route tracking)
  useEffect(() => {
    if (pathname !== "/") return;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;

      // When near the top, home is active
      if (scrollY < 220) {
        setActiveSection("home");
        return;
      }

      // If scrolled to bottom of document, contact is active
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (windowHeight + scrollY >= docHeight - 80) {
        setActiveSection("contact");
        return;
      }

      // Check sections from bottom of page upwards
      const sectionIds = ["contact", "about-preview", "projects", "experience", "skills"];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active if section header/body crosses upper-middle viewport
          if (rect.top <= windowHeight * 0.45 && rect.bottom >= 120) {
            setActiveSection(id === "about-preview" ? "about" : id);
            return;
          }
        }
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  // Track DARVS scan entry lifecycle to hide navbar during scan
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    let cancelled = false;
    if (!isDocumentVisited()) {
      queueMicrotask(() => {
        if (!cancelled) setIsScanActive(true);
      });
    }

    const unsubscribe = subscribeDarvsState((state) => {
      if (state.active) {
        setIsOpen(false);
        setIsScanActive(true);
      } else if (state.active === false || state.ready || state.failed) {
        setIsScanActive(false);
      }
    });

    const handleDarvsEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        if (detail.active) {
          setIsOpen(false);
          setIsScanActive(true);
        } else if (detail.active === false) {
          setIsScanActive(false);
        }
      }
    };
    window.addEventListener("darvs:state-change", handleDarvsEvent);

    return () => {
      cancelled = true;
      unsubscribe();
      window.removeEventListener("darvs:state-change", handleDarvsEvent);
    };
  }, [pathname]);

  // Track page scroll to give fixed header frosted obsidian glass backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle direct visits with section hash (e.g. /#projects, /#contact)
  useEffect(() => {
    if (typeof window === "undefined" || pathname !== "/") return;
    const hash = window.location.hash;
    if (!hash) return;
    const target = hash.replace("#", "");
    const timer = setTimeout(() => {
      const top = getTargetDocumentTop(target);
      window.scrollTo({
        top,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Scroll lock with scrollbar jump compensation
  useEffect(() => {
    if (!isOpen) return;
    const main = document.querySelector<HTMLElement>("main");
    const wasInert = main?.inert;
    if (main) main.inert = true;
    const overflow = document.body.style.overflow;
    const paddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
    return () => {
      if (main) main.inert = wasInert ?? false;
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [isOpen]);

  // Keyboard accessibility (<Escape> to close, focus trap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
      }

      // Focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = [...(triggerRef.current ? [triggerRef.current] : []),
          ...drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const isOutside = !focusable.includes(document.activeElement as HTMLElement);

        if (e.shiftKey && (document.activeElement === first || isOutside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || isOutside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDrawer]);

  // Auto-focus first link when drawer opens
  useEffect(() => {
    if (!isOpen) return;
    let frame = 0;
    const focusFirstLink = () => {
      const link = firstLinkRef.current;
      if (link && getComputedStyle(link).visibility === "visible") {
        link.focus({ preventScroll: true });
      } else {
        frame = requestAnimationFrame(focusFirstLink);
      }
    };
    frame = requestAnimationFrame(focusFirstLink);
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // Section navigation / smooth scroll handling
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isExternal?: boolean) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const slug = projectSlugFromHref(href);
    if (slug) {
      trackPortfolioEvent("project_open", {
        project_slug: slug,
        source_surface: "navbar",
      });
    } else if (href === "/darvs/demo") {
      trackPortfolioEvent("darvs_demo_open", { source_surface: "navbar" });
    } else if (href === links.cv) {
      trackPortfolioEvent("cv_download", { source_surface: "navbar" });
    }
    closeDrawer();
    if (isExternal) return;

    if (pathname !== "/" && href.startsWith("/#")) {
      markDocumentVisited();
    }

    if (pathname === "/" && (href === "/" || href.startsWith("/#"))) {
      e.preventDefault();
      const targetId = href === "/" ? "home" : href.split("#")[1];
      setActiveSection(targetId === "about-preview" ? "about" : targetId);
      window.history.pushState(window.history.state, "", href);
      requestAnimationFrame(() => {
        window.scrollTo({
          top: getTargetDocumentTop(targetId),
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
      });
    }
  };

  return (
    <>
      {/* --------------------------------------------------------------------
          1. SITE HEADER (Fixed, persistent, unencumbered top bar)
          -------------------------------------------------------------------- */}
      <header
        className="cinematic-header"
        role="banner"
        data-scrolled={isScrolled}
        data-drawer-open={isOpen}
        data-scan-active={effectiveScanActive}
        aria-hidden={effectiveScanActive ? "true" : undefined}
      >
        {/* Top-Right: Header Actions Cluster */}
        <div className="cinematic-header-actions">
          {pathname === "/" && (
            <a
              href={links.cv}
              target="_blank"
              rel="noreferrer"
              className="cinematic-header-cv-editorial"
              aria-label="Download Curriculum Vitae (PDF)"
              onClick={() =>
                trackPortfolioEvent("cv_download", {
                  source_surface: "header_editorial",
                })
              }
            >
              <span>CV (PDF)</span>
              <ArrowUpRight size={14} className="editorial-cv-arrow" aria-hidden="true" />
            </a>
          )}

          {/* Floating Circular Hamburger Trigger (3 Horizontal Bars) */}
          <button
            ref={triggerRef}
            className="cinematic-trigger-circle"
            onClick={() => {
              if (!isOpen) setHasOpened(true);
              setIsOpen(!isOpen);
            }}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="cinematic-drawer"
            data-open={isOpen}
          >
            <span className="bar bar-top" aria-hidden="true" />
            <span className="bar bar-mid" aria-hidden="true" />
            <span className="bar bar-bot" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          2. BACKDROP OVERLAY
          -------------------------------------------------------------------- */}
      <div
        className="cinematic-backdrop"
        data-open={isOpen}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* --------------------------------------------------------------------
          3. PURE EDITORIAL SLIDE-OUT DRAWER (Ultra-clean, God-level motion)
          -------------------------------------------------------------------- */}
      <aside
        id="cinematic-drawer"
        ref={drawerRef}
        className="cinematic-drawer-pure"
        data-open={isOpen}
        data-has-opened={hasOpened}
        role="dialog"
        aria-modal={isOpen ? true : undefined}
        aria-hidden={!isOpen}
        inert={!isOpen}
        aria-label="Site Navigation Menu"
      >
        {/* Massive Editorial Typography List */}
        <nav className="drawer-pure-nav-wrapper" aria-label="Main navigation links">
          <ul className="drawer-pure-nav">
            {NAV_ITEMS.map((item, index) => {
              const isActive = currentSection === item.id;
              return (
                <li key={item.id} className="drawer-pure-item">
                  <div className="drawer-pure-mask">
                    <Link
                      href={item.href}
                      ref={index === 0 ? firstLinkRef : undefined}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noreferrer" : undefined}
                      className="drawer-pure-link"
                      data-active={isActive}
                      aria-current={isActive ? "page" : undefined}
                      onClick={(e) => handleNavClick(e, item.href, item.isExternal)}
                    >
                      <span className="drawer-link-roll" aria-label={item.label}>
                        <span className="roll-line roll-primary">
                          <span className="roll-text">{item.label}</span>
                          <span className="nav-dot" aria-hidden="true">.</span>
                        </span>
                        <span className="roll-line roll-secondary" aria-hidden="true">
                          <span className="roll-text">{item.label}</span>
                          <span className="nav-dot" aria-hidden="true">.</span>
                        </span>
                      </span>
                      {item.isExternal && (
                        <ArrowUpRight size={20} className="ext-arrow" aria-hidden="true" />
                      )}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Direct Email in Navbar Drawer */}
          <div className="drawer-email-footer">
            <a
              href={links.email}
              className="drawer-email-direct"
              aria-label="Send email to Vishva Patel"
              onClick={() => {
                trackPortfolioEvent("contact_click", {
                  channel: "email",
                  source_surface: "drawer_direct",
                });
                closeDrawer();
              }}
            >
              vishvapatel.ece@gmail.com
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}
