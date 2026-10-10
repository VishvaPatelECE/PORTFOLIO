import { PageHeading } from "@/components/Shell";
import RangraphInstrument from "@/components/rangraph/RangraphInstrument";
import { links } from "@/lib/content/site";
import ProjectCover from "@/components/ProjectCover";
export const metadata = { title: "RANGraph — data representation lab" };
export default function Rangraph() {
  return (
    <main id="main" className="wrap">
      <PageHeading
        code="RESEARCH SYSTEM / WIRELESS DATA"
        title="RANGraph"
        subtitle="Raw observations. Explicit meaning. Inspect the transformation from a wireless source record to a typed graph, including the relationships that cannot be assumed."
      >
        <a
          className="text-link"
          href={links.rangraph}
          target="_blank"
          rel="noreferrer"
        >
          RESEARCH SOURCE ↗
        </a>
      </PageHeading>
      <ProjectCover kind="wireless" />
      <RangraphInstrument />
      <section className="technical-notes" id="engineering-notes">
        <div>
          <h2>
            Every edge needs
            <br />a reason to exist.
          </h2>
        </div>
        <div className="prose">
          <p>
            This explorer uses the repository’s golden Mock E2 fixture: two
            timesteps, three UEs, two gNBs and one handover. Its TypeScript
            ingestion, compiler and validator compute the visible representation
            from those records.
          </p>
          <p>
            Associations follow source-reported serving-cell references. Missing
            values remain explicit; no interference edges are guessed from
            spatial proximity. The layout is schematic and does not represent
            device locations.
          </p>
          <details>
            <summary>Browser model and Python implementation</summary>
            <p>
              The explorer reuses RANGraph’s existing browser pipeline. It does
              not execute the Python compiler. The Python project has an
              immutable canonical IR, independent validation, and
              NetworkX/PyG/DGL export adapters. The button here exports the
              browser fixture IR as JSON, not a tensor export. Historical
              research benchmarks are intentionally not presented as current
              results.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
