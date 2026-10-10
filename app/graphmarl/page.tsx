import type { Metadata } from "next";
import { PageHeading } from "@/components/Shell";
import ProjectCover from "@/components/ProjectCover";

export const metadata: Metadata = { title: "GraphMARL — research in progress" };

export default function GraphMARL() {
  return (
    <main id="main" className="wrap">
      <PageHeading code="RESEARCH IN PROGRESS" title="GraphMARL" subtitle="Project details coming soon." />
      <ProjectCover kind="research" />
      <div className="prose technical-notes"><p>SUMO is used for mobility generation. Source material and results will be added when available.</p></div>
    </main>
  );
}
