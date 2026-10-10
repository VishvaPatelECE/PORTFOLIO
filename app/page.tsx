import LaboratoryHero from "@/components/home/LaboratoryHero";
import ProjectCards from "@/components/home/ProjectCards";
import { HomeMotionProvider } from "@/components/home/HomeMotion";
import { PortfolioInterests, EngineeringNotes } from "@/components/home/PortfolioBridges";
import CloudTransition from "@/components/home/CloudTransition";
export default function Home() {
  return (
    <HomeMotionProvider>
      <main id="main" className="reference-home">
        <LaboratoryHero />
        <CloudTransition />
        <PortfolioInterests />
        <ProjectCards />
        <EngineeringNotes />
      </main>
    </HomeMotionProvider>
  );
}
