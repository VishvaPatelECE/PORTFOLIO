import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/Shell";
export const metadata: Metadata = { title: "Research" };
export default function Research() {
  return (
    <main id="main" className="wrap">
      <PageHeading
        code="RESEARCH / OPEN QUESTIONS"
        title="Build. Test. Question."
        subtitle="Research starts with making assumptions visible. These projects investigate how intelligent and wireless systems are represented, compared and understood."
      />
      <section className="research-list">
        <article>
          <span className="mono signal">IMPLEMENTED RESEARCH FRAMEWORK</span>
          <h2>RANGraph</h2>
          <p>
            Explicit semantics and canonical representations for heterogeneous
            RAN telemetry. Follow a source record through declared conversions,
            typed nodes, relationships and validation.
          </p>
          <Link className="button" href="/rangraph">
            OPEN THE DATA LAB <ArrowUpRight size={18} />
          </Link>
          <div className="research-note">
            Interactive browser fixture · Python architecture documented · No
            benchmark claim
          </div>
        </article>
        <article>
          <span className="mono muted">RESEARCH PROJECT</span>
          <h2>GraphMARL</h2>
          <p>Project details coming soon.</p>
          <div className="research-note">
            Source material and results will be added when available.
          </div>
        </article>
      </section>
      <div className="research-principle">
        <p>
          A useful result includes
          <br />
          the conditions under which it holds.
        </p>
      </div>
    </main>
  );
}
