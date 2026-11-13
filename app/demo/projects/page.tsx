import type { Metadata } from "next";
import RangraphCoverDemo from "@/components/home/RangraphCoverDemo";
import { HomeMotionProvider } from "@/components/home/HomeMotion";
import { runPipeline } from "@/lib/rangraph";

export const metadata: Metadata = {
  title: { absolute: "Vishva Patel | Systems & ECE" },
  robots: { index: false, follow: false },
};

export default function ProjectDemo() {
  const { sequence } = runPipeline();
  return (
    <HomeMotionProvider>
      <RangraphCoverDemo sequence={sequence} />
    </HomeMotionProvider>
  );
}
