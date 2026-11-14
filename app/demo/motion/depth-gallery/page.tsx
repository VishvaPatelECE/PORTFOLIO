import type { Metadata } from "next";
import DemoNav from "@/components/demo/DemoNav";
import DepthGalleryDemo from "@/components/demo/DepthGalleryDemo";

export const metadata: Metadata = {
  title: "Demo 1: 3D Depth Gallery — Motion Lab",
  robots: { index: false, follow: false },
};

export default function DepthGalleryPage() {
  return (
    <main id="main">
      <DemoNav />
      <DepthGalleryDemo />
    </main>
  );
}
