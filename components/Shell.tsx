"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { MotionConfig } from "framer-motion";
import { links } from "@/lib/content/site";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link
        href="/"
        className="brand"
        aria-label="VishvaProjects home"
        onClick={() => setOpen(false)}
      >
        <svg width="29" height="29" viewBox="0 0 30 30" aria-hidden="true">
          <path
            d="M3 5h7l5 15L20 5h7L15 28Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M2 17h26M15 2v26" stroke="currentColor" opacity=".4" />
        </svg>
        <span>
          VISHVA<span className="brand-light">PROJECTS</span>
          <sup>V.03</sup>
        </span>
      </Link>
      <button
        className="menu-toggle icon-button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-nav"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav
        id="main-nav"
        aria-label="Main navigation"
        className={open ? "nav-open" : ""}
      >
        {[
          ["HOME", "/"],
          ["SYSTEMS", "/#systems"],
          ["RESEARCH", "/research"],
          ["ABOUT", "/about"],
          ["CONTACT", "/#contact"],
        ].map(([label, href]) => (
          <Link
            key={label}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            onClick={(event) => {
              setOpen(false);
              if (pathname === "/" && href.includes("#")) {
                event.preventDefault();
                const target = href.split("#")[1];
                window.location.hash = target;
                document
                  .getElementById(target)
                  ?.scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "auto"
                      : "smooth",
                  });
              }
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
      <a className="header-cv" href={links.cv} target="_blank" rel="noreferrer">
        CV <ArrowUpRight size={14} />
      </a>
    </header>
  );
}
export function Footer() {
  return (
    <footer id="contact" className="site-footer wrap">
      <div className="contact-lead">
        <h2>
          Let’s build
          <br />
          <span>something real.</span>
        </h2>
        <a className="contact-email" href={links.email}>
          vishva.viking@gmail.com <ArrowUpRight />
        </a>
      </div>
      <div className="contact-links">
        {[
          ["EMAIL", links.email],
          ["GITHUB", links.github],
          ["LINKEDIN", links.linkedin],
          ["READ CV", links.cv],
        ].map(([name, href]) => (
          <a
            key={name}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noreferrer"
          >
            {name}
            <ArrowUpRight size={17} />
          </a>
        ))}
      </div>
      <div className="footer-bottom">
        <span>VISHVA PATEL · ENGINEERING IN PROGRESS</span>
        <Link href="/credits">COLOPHON & SOURCES</Link>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
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
