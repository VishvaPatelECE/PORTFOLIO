import type { Metadata } from "next";
import LaboratoryHero from "@/components/home/LaboratoryHero";
import SkillsSection from "@/components/home/SkillsSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import ProjectCards from "@/components/home/ProjectCards";
import AboutPreview from "@/components/home/AboutPreview";
import SignalTubes from "@/components/home/SignalTubes";
import { HomeMotionProvider } from "@/components/home/HomeMotion";
import DarvsLoader from "@/components/entry/DarvsLoader";
import { Footer } from "@/components/Shell";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  buildPageMetadata,
} from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  keywords: [
    "Vishva Patel",
    "VishvaProjects",
    "ECE Portfolio",
    "RANGraph",
    "GraphMARL",
    "DARVS",
    "USMHACS",
  ],
});

export default function Home() {
  return (
    <HomeMotionProvider>
      <DarvsLoader />
      <main id="main" className="reference-home">
        <LaboratoryHero />
        {/* Core Disciplines Kinetic Stream & Pinned Carousel with Live Text FX Sandbox */}
        <SkillsSection />
        {/* Continuous 3D Signal Tubes Background spanning across Experience, Projects, and About */}
        <div className="discovery-tubes-wrapper">
          <div className="discovery-tubes-track" aria-hidden="true">
            <SignalTubes />
          </div>
          <ExperienceSection />
          <ProjectCards showTubes={false} />
          <AboutPreview />
        </div>
        <Footer />
      </main>
    </HomeMotionProvider>
  );
}
