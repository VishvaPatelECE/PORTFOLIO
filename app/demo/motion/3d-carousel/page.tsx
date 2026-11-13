import type { Metadata } from "next";
import DemoNav from "@/components/demo/DemoNav";
import Carousel3DDemo from "@/components/demo/Carousel3DDemo";

export const metadata: Metadata = {
  title: "Demo 4: 3D Cover Flow Carousel — Motion Lab",
  robots: { index: false, follow: false },
};

export default function Carousel3DPage() {
  return (
    <main id="main">
      <DemoNav />
      <Carousel3DDemo />
    </main>
  );
}
