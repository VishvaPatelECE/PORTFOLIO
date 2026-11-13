import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "USMHACS — Microcontroller-Free Hardware Access Control System",
  description:
    "Ultra-Secure Multi-Layer Hardware Access Control System. Microcontroller-free physical security with deterministic fault latching and protected reset.",
  path: "/usmhacs",
  keywords: [
    "USMHACS",
    "Hardware Access Control",
    "Discrete Logic",
    "Fault Latching",
    "Digital Security",
  ],
});

export default function UsmhacsLayout({ children }: { children: ReactNode }) {
  return children;
}

