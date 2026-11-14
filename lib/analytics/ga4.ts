import { sendGAEvent } from "@next/third-parties/google";

export type ProjectSlug =
  | "rangraph"
  | "graphmarl"
  | "darvs"
  | "usmhacs"
  | "autonomous-robo-car"
  | "hardware-stopwatch";

export type ContactChannel = "email" | "email_copy" | "github" | "linkedin" | "instagram";

export type PortfolioEventMap = {
  project_open: { project_slug: ProjectSlug; source_surface: string };
  cv_download: { source_surface: string };
  contact_click: { channel: ContactChannel; source_surface: string };
  darvs_demo_open: { source_surface: string };
  cta_click: { cta_id: string; target: string; source_surface: string };
};

export type PortfolioEventName = keyof PortfolioEventMap;

export const GA_CONSENT_STORAGE_KEY = "vp_analytics_consent";
export type AnalyticsConsentState = "granted" | "denied";

const GA_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/i;
const ALLOWED_PARAM_KEYS: Record<PortfolioEventName, readonly string[]> = {
  project_open: ["project_slug", "source_surface"],
  cv_download: ["source_surface"],
  contact_click: ["channel", "source_surface"],
  darvs_demo_open: ["source_surface"],
  cta_click: ["cta_id", "target", "source_surface"],
};

export function getGaMeasurementId(raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return GA_ID_PATTERN.test(trimmed) ? trimmed : null;
}

export function sanitizeEventParams<K extends PortfolioEventName>(
  eventName: K,
  params: PortfolioEventMap[K]
): Record<string, string> {
  const allowed = new Set(ALLOWED_PARAM_KEYS[eventName]);
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (!allowed.has(key) || typeof value !== "string") continue;
    const trimmed = value.trim().slice(0, 80);
    // Guard against accidental email or query-string leakage inside values
    if (trimmed.includes("@") || trimmed.startsWith("mailto:")) continue;
    clean[key] = trimmed;
  }
  return clean;
}

export function isPrivacySignalActive(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.doNotTrack === "1" || nav.globalPrivacyControl === true;
}

export function readStoredConsent(): AnalyticsConsentState {
  if (typeof window === "undefined") return "denied";
  if (isPrivacySignalActive()) return "denied";
  try {
    const saved = window.localStorage.getItem(GA_CONSENT_STORAGE_KEY);
    if (saved === "granted") return "granted";
  } catch {}
  return "denied";
}

export function projectSlugFromHref(href: string): ProjectSlug | null {
  if (href === "/rangraph" || href.startsWith("/rangraph#")) return "rangraph";
  if (href === "/graphmarl" || href.startsWith("/graphmarl#")) return "graphmarl";
  if (href === "/darvs" || href.startsWith("/darvs#")) return "darvs";
  if (href === "/usmhacs" || href.startsWith("/usmhacs#")) return "usmhacs";
  if (href === "/about#robo-car") return "autonomous-robo-car";
  if (href === "/about#hardware-stopwatch") return "hardware-stopwatch";
  return null;
}

export function trackPortfolioEvent<K extends PortfolioEventName>(
  eventName: K,
  params: PortfolioEventMap[K]
): boolean {
  const gaId = getGaMeasurementId();
  if (!gaId || typeof window === "undefined") return false;
  if (readStoredConsent() === "denied") return false;
  const win = window as unknown as Record<string, unknown>;
  if (win[`ga-disable-${gaId}`] === true) return false;

  const safeParams = sanitizeEventParams(eventName, params);
  try {
    sendGAEvent("event", eventName, safeParams);
    return true;
  } catch {
    return false;
  }
}

