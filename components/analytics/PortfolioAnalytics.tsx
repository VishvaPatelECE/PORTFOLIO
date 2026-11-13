"use client";

import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  GA_CONSENT_STORAGE_KEY,
  getGaMeasurementId,
  isPrivacySignalActive,
  readStoredConsent,
  type AnalyticsConsentState,
} from "@/lib/analytics/ga4";

const emptySubscribe = () => () => {};

const DENIED_CONSENT_PARAMS = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

const GRANTED_ANALYTICS_PARAMS = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "granted",
} as const;

function pushDataLayer(...args: unknown[]) {
  void args;
  if (typeof window === "undefined") return;
  const win = window as unknown as { dataLayer?: unknown[] };
  win.dataLayer = win.dataLayer || [];
  // gtag.js processes Arguments objects cleanly across versions
  // eslint-disable-next-line prefer-rest-params
  win.dataLayer.push(arguments);
}

export default function PortfolioAnalytics() {
  const gaId = getGaMeasurementId();
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [consentOverride, setConsentOverride] = useState<AnalyticsConsentState | null>(null);
  const [gaActivatedInSession, setGaActivatedInSession] = useState(false);
  const privacySignal = isHydrated ? isPrivacySignalActive() : false;
  const consent: AnalyticsConsentState =
    isHydrated && !privacySignal ? consentOverride ?? readStoredConsent() : "denied";
  const shouldMountGa =
    Boolean(gaId) &&
    isHydrated &&
    !privacySignal &&
    (consent === "granted" || gaActivatedInSession);

  useEffect(() => {
    if (!gaId || !isHydrated) return;
    const win = window as unknown as Record<string, unknown>;
    win[`ga-disable-${gaId}`] = privacySignal || consent === "denied";
  }, [gaId, isHydrated, privacySignal, consent]);

  if (!gaId || !isHydrated || privacySignal) {
    return null;
  }

  const toggleConsent = () => {
    const next: AnalyticsConsentState = consent === "granted" ? "denied" : "granted";
    const win = window as unknown as Record<string, unknown>;
    win[`ga-disable-${gaId}`] = next === "denied";
    try {
      window.localStorage.setItem(GA_CONSENT_STORAGE_KEY, next);
    } catch {}

    if (next === "granted" && !win.__vpGaConsentInitialized) {
      win.__vpGaConsentInitialized = true;
      pushDataLayer("consent", "default", DENIED_CONSENT_PARAMS);
    }
    pushDataLayer(
      "consent",
      "update",
      next === "granted" ? GRANTED_ANALYTICS_PARAMS : DENIED_CONSENT_PARAMS
    );

    if (next === "granted") {
      setGaActivatedInSession(true);
    }
    setConsentOverride(next);
  };

  const initialConsentStorage = consent === "granted" ? "granted" : "denied";

  return (
    <>
      {shouldMountGa ? (
        <>
          <Script
            id="vp-ga-consent-default"
            dangerouslySetInnerHTML={{
              __html: `
                if (!window.__vpGaConsentInitialized) {
                  window.__vpGaConsentInitialized = true;
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    analytics_storage: '${initialConsentStorage}'
                  });
                }
              `,
            }}
          />
          <GoogleAnalytics gaId={gaId} />
        </>
      ) : null}
      <div
        className="vp-analytics-pill"
        role="region"
        aria-label="Analytics preference"
        style={{
          position: "fixed",
          bottom: 12,
          right: 12,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 10px",
          borderRadius: 999,
          background: "rgba(10, 10, 15, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          color: "rgba(244, 242, 238, 0.86)",
          fontSize: 11,
          letterSpacing: "0.06em",
          backdropFilter: "blur(8px)",
        }}
      >
        <span>{consent === "granted" ? "Analytics: On" : "Analytics: Off"}</span>
        <button
          type="button"
          onClick={toggleConsent}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            color: "#3fd0de",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          {consent === "granted" ? "Opt out" : "Enable analytics"}
        </button>
      </div>
    </>
  );
}
