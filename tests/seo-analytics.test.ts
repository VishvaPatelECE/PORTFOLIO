import test from "node:test";
import assert from "node:assert/strict";
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  experiencePageJsonLd,
  personJsonLd,
  projectJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "@/lib/seo/site";
import {
  GA_CONSENT_STORAGE_KEY,
  getGaMeasurementId,
  isPrivacySignalActive,
  projectSlugFromHref,
  readStoredConsent,
  sanitizeEventParams,
  trackPortfolioEvent,
} from "@/lib/analytics/ga4";
import { metadata as usmhacsLayoutMetadata } from "@/app/usmhacs/layout";
import { metadata as usmhacsFullLayoutMetadata } from "@/app/usmhacs/full/layout";
import { metadata as motionCompareLayoutMetadata } from "@/app/demo/motion-compare/layout";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

test("SEO helpers produce canonical URLs and escaped JSON-LD", () => {
  assert.equal(absoluteUrl("/"), SITE_URL);
  assert.equal(absoluteUrl("/rangraph"), `${SITE_URL}/rangraph`);

  const meta = buildPageMetadata({
    title: "Test Page",
    description: "Test description",
    path: "/about",
  });
  assert.equal(meta.alternates?.canonical, "/about");
  assert.ok(Array.isArray(meta.openGraph?.images));

  const escaped = serializeJsonLd({ note: "<script>alert(1)</script>" });
  assert.equal(escaped.includes("<"), false);
  assert.ok(escaped.includes("\\u003cscript>"));

  const person = personJsonLd();
  assert.equal(person["@type"], "Person");
  assert.equal(person.email, "mailto:vishvapatel.ece@gmail.com");
  assert.ok(person.sameAs.includes("https://www.instagram.com/vishva_1503/"));
  assert.equal(websiteJsonLd()["@type"], "WebSite");
  assert.equal(
    projectJsonLd({
      name: "DARVS",
      description: "Desc",
      path: "/darvs",
      keywords: ["MTCNN"],
    })["@type"],
    "SoftwareSourceCode"
  );
  assert.equal(
    projectJsonLd({
      name: "USMHACS",
      description: "Desc",
      path: "/usmhacs",
      type: "CreativeWork",
      keywords: ["Hardware"],
    })["@type"],
    "CreativeWork"
  );

  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/#projects" },
    { name: "RANGraph", path: "/rangraph" },
  ]);
  assert.equal(crumbs["@type"], "BreadcrumbList");
  assert.equal(crumbs.itemListElement.length, 3);
  assert.equal(crumbs.itemListElement[2].name, "RANGraph");
  assert.equal(crumbs.itemListElement[2].item, `${SITE_URL}/rangraph`);

  const expReport = experiencePageJsonLd({
    title: "AI Research Intern",
    description: "SVNIT",
    path: "/experience/svnit",
    organization: "SVNIT Surat",
  });
  assert.equal(expReport["@type"], "Report");
  assert.equal(expReport.url, `${SITE_URL}/experience/svnit`);
});

test("sitemap excludes internal demos and includes core public routes", () => {
  const urls = sitemap().map((entry) => entry.url);
  assert.ok(urls.includes(SITE_URL));
  assert.ok(urls.includes(`${SITE_URL}/about`));
  assert.ok(urls.includes(`${SITE_URL}/rangraph`));
  assert.ok(urls.includes(`${SITE_URL}/graphmarl`));
  assert.ok(urls.includes(`${SITE_URL}/darvs`));
  assert.ok(urls.includes(`${SITE_URL}/darvs/demo`));
  assert.ok(urls.includes(`${SITE_URL}/usmhacs`));
  assert.ok(urls.includes(`${SITE_URL}/experience/svnit`));
  assert.equal(urls.some((u) => u.includes("/demo/")), false);

  const robotsConfig = robots();
  assert.ok(String(robotsConfig.sitemap).endsWith("/sitemap.xml"));
});

test("GA4 helpers enforce env validation and strip PII/disallowed params", () => {
  assert.equal(getGaMeasurementId(undefined), null);
  assert.equal(getGaMeasurementId(""), null);
  assert.equal(getGaMeasurementId("invalid-id"), null);
  assert.equal(getGaMeasurementId("G-TEST123456"), "G-TEST123456");

  assert.equal(projectSlugFromHref("/rangraph"), "rangraph");
  assert.equal(projectSlugFromHref("/about#robo-car"), "autonomous-robo-car");
  assert.equal(projectSlugFromHref("/about"), null);

  const sanitized = sanitizeEventParams("contact_click", {
    channel: "email",
    source_surface: "footer",
    // @ts-expect-error testing defense-in-depth stripping of unexpected PII fields
    email: "vishva.viking@gmail.com",
  });
  assert.deepEqual(sanitized, { channel: "email", source_surface: "footer" });

  const emailInField = sanitizeEventParams("cta_click", {
    cta_id: "vishva@example.com",
    target: "/about",
    source_surface: "hero",
  });
  assert.equal("cta_id" in emailInField, false);

  assert.equal(
    trackPortfolioEvent("cv_download", { source_surface: "footer" }),
    false
  );
});

test("route layouts supply USMHACS canonicals and motion-compare noindex", () => {
  assert.equal(usmhacsLayoutMetadata.alternates?.canonical, "/usmhacs");
  assert.equal(usmhacsLayoutMetadata.openGraph?.url, `${SITE_URL}/usmhacs`);
  assert.equal(usmhacsFullLayoutMetadata.alternates?.canonical, "/usmhacs/full");
  assert.equal(usmhacsFullLayoutMetadata.openGraph?.url, `${SITE_URL}/usmhacs/full`);
  assert.deepEqual(motionCompareLayoutMetadata.robots, {
    index: false,
    follow: false,
  });
});

test("GA4 consent defaults to denied and respects explicit opt-in, opt-out, and DNT/GPC", () => {
  const originalWindow = (globalThis as Record<string, unknown>).window;
  const originalNavigator = (globalThis as Record<string, unknown>).navigator;

  try {
    assert.equal(readStoredConsent(), "denied");

    const storage = new Map<string, string>();
    const mockWindow = {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, val: string) => {
          storage.set(key, val);
        },
      },
    };

    Object.defineProperty(globalThis, "window", {
      value: mockWindow,
      configurable: true,
    });
    Object.defineProperty(globalThis, "navigator", {
      value: { doNotTrack: null, globalPrivacyControl: false },
      configurable: true,
    });

    assert.equal(isPrivacySignalActive(), false);
    assert.equal(readStoredConsent(), "denied");

    storage.set(GA_CONSENT_STORAGE_KEY, "granted");
    assert.equal(readStoredConsent(), "granted");

    Object.defineProperty(globalThis, "navigator", {
      value: { doNotTrack: "1", globalPrivacyControl: false },
      configurable: true,
    });
    assert.equal(isPrivacySignalActive(), true);
    assert.equal(readStoredConsent(), "denied");

    Object.defineProperty(globalThis, "navigator", {
      value: { doNotTrack: null, globalPrivacyControl: true },
      configurable: true,
    });
    assert.equal(isPrivacySignalActive(), true);
    assert.equal(readStoredConsent(), "denied");

    Object.defineProperty(globalThis, "navigator", {
      value: { doNotTrack: null, globalPrivacyControl: false },
      configurable: true,
    });
    storage.set(GA_CONSENT_STORAGE_KEY, "denied");
    assert.equal(readStoredConsent(), "denied");
  } finally {
    if (originalWindow === undefined) {
      delete (globalThis as Record<string, unknown>).window;
    } else {
      Object.defineProperty(globalThis, "window", {
        value: originalWindow,
        configurable: true,
      });
    }
    if (originalNavigator === undefined) {
      delete (globalThis as Record<string, unknown>).navigator;
    } else {
      Object.defineProperty(globalThis, "navigator", {
        value: originalNavigator,
        configurable: true,
      });
    }
  }
});

