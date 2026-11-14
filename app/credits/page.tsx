import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/Shell";
import { links } from "@/lib/content/site";
import { breadcrumbJsonLd, buildPageMetadata, serializeJsonLd } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Colophon & Sources",
  description:
    "Technical provenance, open-source licenses, font attributions, and source-code boundaries for VishvaProjects V3.",
  path: "/credits",
});
export default function Credits() {
  return (
    <main id="main" className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Colophon & Sources", path: "/credits" },
            ])
          ),
        }}
      />
      <PageHeading
        code="COLOPHON / PROVENANCE"
        title="Built on evidence."
        subtitle="The sources, boundaries and acknowledgements behind this portfolio."
      />
      <div className="credits prose">
        <h2>Engineering source</h2>
        <p>
          <a href={links.darvs} target="_blank" rel="noreferrer">
            DARVS repository ↗
          </a>{" "}
          defines the active Python architecture. The browser walkthrough is a
          deterministic explanation and does not access a camera or run
          inference. Repository visibility is controlled by its owner.
        </p>
        <p>
          USMHACS uses the original portfolio’s browser logic simulator with
          colors adapted to V3. It is not connected to physical access hardware.
        </p>
        <p>
          <Link href="/rangraph" className="text-link">
            The RANGraph project →
          </Link>{" "}
          provides the schema, golden fixture and TypeScript pipeline used in
          the explorer. The browser model does not execute Python. Layout
          positions are schematic; relationships come from the computed fixture.
          Its repository and manuscript draft remain private in this phase.
        </p>
        <h2>Face asset</h2>
        <p>
          “Infinite, 3D Head Scan” by Lee Perry-Smith, based on work from{" "}
          <a href="https://www.triplegangers.com/">Triplegangers</a>, licensed
          under{" "}
          <a href="https://creativecommons.org/licenses/by/3.0/">
            Creative Commons Attribution 3.0
          </a>
          . The supplied mesh has been centered, scaled and rendered with custom
          contour, scan and dissolution materials. It is not a scan of Vishva or
          of the visitor.{" "}
          <a href="/face/HEAD-LICENSE.txt">Original attribution notice ↗</a>
        </p>
        <h2>Type & interaction</h2>
        <p>
          The hero portrait is a generated illustration based on Vishva’s
          supplied photograph. It is separate from the introductory face asset.
        </p>
        <p>
          Flow Field, Matrix Field, Constellation Field and Gateway Flow use
          actual renderers from{" "}
          <a href="https://github.com/MengTo/threeui">ThreeUI Community</a>{" "}
          1.2.0, copyright Meng To, under the{" "}
          <a href="/licenses/THREEUI-MIT.txt">MIT license</a>. The main action
          adapts the original Ignition vertex and fragment shaders into a native
          portfolio link. The face intro is a custom interpretation of Cortexa.
          No protected Pro source or Dark Souls assets are used.
        </p>
        <p>
          The isolated Community frames use a locally served GSAP 3.12.2 runtime.
          Its <a href="/licenses/GSAP-NOTICE.txt">original license notice</a> is retained.
          Unused remote page scripts and fonts are removed from these decorative frames.
        </p>
        <p>
          Anybody by Tyler Finck / Etcetera Type Co and Recursive by Stephen
          Nixon / ArrowType, distributed under the SIL Open Font License. Fonts
          are served locally. Motion references include{" "}
          <a href="https://threeui.com/">ThreeUI</a> and{" "}
          <a href="https://animmasterlib.dev/">Animmaster Lib</a>; portfolio
          interactions are implemented for these engineering models.
        </p>
        <p>
          The project background uses Kevin Levron’s <a href="https://codepen.io/soju22/pen/qEbdVjK">Tubes Cursor</a>,
          with the original threejs-components 0.0.19 runtime unchanged and initial colours adapted.
          The reference declares <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>;
          its <a href="/vendor/tubes/0.0.19/NOTICE.txt">attribution and adaptation notice</a> is retained.
          Earlier card transfers studied <a href="https://codepen.io/elegantseagulls/pen/wvMgXxN">Elegant Seagulls’ blinds effect</a>.
          The current gallery keeps cards intact, with pacing informed by <a href="https://samarth-patel.dev/">Samarth Patel’s portfolio</a>.
        </p>
        <p>
          Palette roles follow the owner’s supplied color study. The interface
          supports keyboard navigation, reduced motion, static entry fallback
          and direct project routes.
        </p>
        <Link className="button" href="/">
          RETURN TO THE PORTFOLIO ↗
        </Link>
      </div>
    </main>
  );
}
