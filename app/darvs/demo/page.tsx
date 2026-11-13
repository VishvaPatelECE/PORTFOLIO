import type { Metadata } from "next";
import { PageHeading } from "@/components/Shell";
import DarvsShowcase from "@/components/home/DarvsShowcase";
import { HomeMotionProvider } from "@/components/home/HomeMotion";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "DARVS Architecture Demo",
  description:
    "Interactive state-machine walkthrough of the DARVS face detection, challenge-response liveness, and identity matching pipeline.",
  path: "/darvs/demo",
  keywords: ["DARVS Demo", "Biometric State Machine", "Challenge-Response"],
});

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
