import type { Metadata } from "next";
import DemoNav from "@/components/demo/DemoNav";
import BlindsRevealDemo from "@/components/demo/BlindsRevealDemo";

export const metadata: Metadata = {
  title: "Demo 2: Blinds Reveal — Motion Lab",
  robots: { index: false, follow: false },
};

export default function BlindsRevealPage() {
  return (
    <main id="main">
      <DemoNav />
      <BlindsRevealDemo />
    </main>
  );
}
