import type { Metadata } from "next";
import { PageHeading } from "@/components/Shell";
import DarvsShowcase from "@/components/home/DarvsShowcase";
import { HomeMotionProvider } from "@/components/home/HomeMotion";

export const metadata: Metadata = { title: "DARVS architecture demo" };

export default function DarvsDemo() {
  return (
    <HomeMotionProvider>
      <main id="main" className="wrap project-demo-page">
        <PageHeading code="DARVS ARCHITECTURE" title="Presence before permission." subtitle="Follow the pipeline and change the example conditions. This diagram does not access a camera or execute model inference." />
        <DarvsShowcase headingLevel="h2" />
      </main>
    </HomeMotionProvider>
  );
}
