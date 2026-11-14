import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "USMHACS — Full Simulator & Hardware State Machine",
  description:
    "Full-viewport interactive hardware simulator for USMHACS: microcontroller-free digital access control with deterministic fault latching and dual-key protected reset.",
  path: "/usmhacs/full",
  keywords: [
    "USMHACS Simulator",
    "Hardware State Machine",
    "Discrete Logic",
    "Fault Latching",
    "Vishva Patel",
  ],
});

export default function UsmhacsFullLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

