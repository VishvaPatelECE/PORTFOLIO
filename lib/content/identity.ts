export const identityCard = {
  name: "VISHVA PATEL",
  field: "EMBEDDED / INTELLIGENT SYSTEMS",
  description: "Hardware. Intelligence. Intent.",
  stages: ["DESIGN", "BUILD", "TEST", "REFINE", "SHIP"],
} as const;

export const identityStageCopy: Record<(typeof identityCard.stages)[number], string> = {
  DESIGN: "Map inputs and constraints.",
  BUILD: "Connect the pieces.",
  TEST: "Probe boundaries\nand failure.",
  REFINE: "Improve what the\ntests expose.",
  SHIP: "Make the work\nclear and usable.",
};
