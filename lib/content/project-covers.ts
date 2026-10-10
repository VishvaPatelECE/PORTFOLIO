import rangraph from "@/public/projects/final/rangraph.png";
import graphmarl from "@/public/projects/final/graphmarl.png";
import darvs from "@/public/projects/final/darvs.png";
import usmhacs from "@/public/projects/final/usmhacs.png";

/** Owner-selected editorial artwork; never simulation output or build evidence. */
export const projectCovers = {
  wireless: { image: rangraph, alt: "Concept artwork of connected radio towers across a mountain landscape." },
  research: { image: graphmarl, alt: "Concept artwork of connected vehicles travelling along a highway." },
  vision: { image: darvs, alt: "Concept artwork of a camera observing facial contours and a reflected pose." },
  hardware: { image: usmhacs, alt: "Concept artwork of a wired hardware control module and an engaged door lock." },
} as const;
export type ProjectCoverKind = keyof typeof projectCovers;
