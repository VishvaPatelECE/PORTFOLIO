import type { Metadata } from "next";
import DemoNav from "@/components/demo/DemoNav";
import AccordionParallaxDemo from "@/components/demo/AccordionParallaxDemo";

export const metadata: Metadata = {
  title: "Demo 3: Accordion Parallax — Motion Lab",
  robots: { index: false, follow: false },
};

export default function AccordionParallaxPage() {
  return (
    <main id="main">
      <DemoNav />
      <AccordionParallaxDemo />
    </main>
  );
}
