export const links = {
  email: "mailto:vishva.viking@gmail.com",
  github: "https://github.com/vishva-git",
  darvs: "https://github.com/vishva-git/DARVS",
  rangraph: "https://github.com/VishvaPatelECE/RANGraph",
  linkedin: "https://www.linkedin.com/in/vishva-patel-ece",
  cv: "/Vishva_Patel_CV.pdf",
};
export const systems = [
  {
    id: "darvs",
    name: "DARVS",
    field: "VISION / IDENTITY",
    description: "A face is an input. Trust is a process.",
    stages: ["CAMERA", "DETECTION", "LIVENESS", "EMBEDDING", "DECISION"],
    href: "/darvs",
  },
  {
    id: "usmhacs",
    name: "USMHACS",
    field: "HARDWARE / CONTROL",
    description: "An access decision, built from logic.",
    stages: ["SENSORS", "KEY + CODE", "DELAY", "INTERLOCK", "DOOR"],
    href: "/usmhacs",
  },
  {
    id: "rangraph",
    name: "RANGraph",
    field: "WIRELESS / REPRESENTATION",
    description: "From radio observations to explicit relationships.",
    stages: ["SOURCE", "CONTRACT", "FEATURES", "RELATIONS", "GRAPH"],
    href: "/rangraph",
  },
] as const;
