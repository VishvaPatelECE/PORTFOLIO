import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Vishva Patel | Systems & ECE" },
  robots: { index: false, follow: false },
};

export default function MotionCompareLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

