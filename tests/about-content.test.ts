import test from "node:test";
import assert from "node:assert/strict";
import { aboutPageContent, aboutPreviewContent } from "@/lib/content/about";

test("about content preserves verified credentials, workbench IDs, and excludes CMEL", () => {
  const serialized = JSON.stringify({ aboutPreviewContent, aboutPageContent });
  assert.equal(/cmel/i.test(serialized), false, "CMEL must not appear in about content");

  // Verified DDU CGPA windows & GATE 2026 EC metrics
  assert.ok(serialized.includes("8.99 / 10.0"));
  assert.ok(serialized.includes("8.88 / 10.0"));
  assert.ok(serialized.includes("6,931"));
  assert.ok(serialized.includes("451"));
  assert.ok(serialized.includes("34.67 / 100.0"));

  // SVNIT internship dates cleanly separated from August continuation
  assert.ok(serialized.includes("MAY 18 – JULY 17, 2026"));
  assert.ok(serialized.includes("AUGUST 2026"));

  // Preserved anchor IDs linked from workbenchProjects & PortfolioBridges
  const workbenchIds = aboutPageContent.workbench.map((w) => w.id);
  assert.deepEqual(workbenchIds, ["robo-car", "hardware-stopwatch"]);

  // Homepage personal About content: narrative paragraphs without CV stats, cards, or CTA
  assert.equal(aboutPreviewContent.heading, "About");
  assert.equal(aboutPreviewContent.paragraphs.length, 3);
  const previewSerialized = JSON.stringify(aboutPreviewContent);
  assert.equal(
    /CGPA|GATE|SVNIT|Research|Building|Explore More About Me|Beyond the things/i.test(
      previewSerialized,
    ),
    false,
  );
});

