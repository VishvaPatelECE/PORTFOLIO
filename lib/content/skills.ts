export interface SkillCapability {
  readonly title: string;
}

export interface DisciplineCard {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly items: readonly SkillCapability[];
}

export const skillsHeader = {
  eyebrow: "Behind the systems, Beyond the code",
  title: "Skills",
  lead: "I work across Wireless Systems, Systems Architecture, Graph Intelligence, Computer Vision, and Embedded Hardware.",
} as const;

export interface TextSegment {
  readonly text: string;
  readonly style?: "normal" | "italic";
  readonly color?: "default" | "cyan" | "gold";
}

export interface BarSegment {
  readonly bar: true;
  readonly color: "cyan" | "gold";
}

export type KineticSegment = TextSegment | BarSegment;

export interface KineticLine {
  readonly id: string;
  readonly segments: readonly KineticSegment[];
  readonly shiftDirection: number;
}

export const kineticLines: readonly KineticLine[] = [
  {
    id: "kinetic-line-1",
    segments: [
      { text: "Systems Architecture", style: "normal" }
    ],
    shiftDirection: 1,
  },
  {
    id: "kinetic-line-2",
    segments: [
      { text: "Artificial Intelligence", style: "normal" },
      { bar: true, color: "cyan" },
      { text: "Wireless Communications", style: "normal" }
    ],
    shiftDirection: -1,
  },
  {
    id: "kinetic-line-3",
    segments: [
      { text: "Algorithms", style: "normal" },
      { bar: true, color: "gold" },
      { text: "Computer Vision", style: "italic" },
      { bar: true, color: "cyan" },
      { text: "Embedded Systems", style: "normal" }
    ],
    shiftDirection: 1.5,
  },
  {
    id: "kinetic-line-4",
    segments: [
      { text: "Hardware", style: "normal" },
      { bar: true, color: "gold" },
      { text: "Software", style: "normal" },
      { bar: true, color: "cyan" },
      { text: "Security", style: "italic" }
    ],
    shiftDirection: -1.2,
  },
] as const;

export const disciplineCards: readonly DisciplineCard[] = [
  {
    index: "01",
    title: "Wireless Communication Systems",
    description:
      "I work on how connected devices communicate, share resources, and perform under changing network conditions.",
    items: [
      { title: "Wireless Network Modelling" },
      { title: "Radio Resource Management" },
      { title: "Channel & Interference Analysis" },
    ],
  },
  {
    index: "02",
    title: "Systems & Software Architecture",
    description:
      "I design software systems and data pipelines around strictly defined data schemas, focusing on structure, performance, and reliability.",
    items: [
      { title: "Schema & Data Modelling" },
      { title: "Graph Data Pipelines" },
      { title: "Algorithms & Optimization" },
    ],
  },
  {
    index: "03",
    title: "AI & Graph Intelligence",
    description:
      "I explore intelligent systems that learn relationships, make decisions, and coordinate across complex environments.",
    items: [
      { title: "Graph-Based Learning" },
      { title: "Reinforcement Learning" },
      { title: "Multi-Agent Systems" },
    ],
  },
  {
    index: "04",
    title: "Computer Vision & Biometrics",
    description:
      "I build vision-based systems that recognize faces, verify identities, and reject spoofing attempts like printed photos, phone screens, and replayed video.",
    items: [
      { title: "Face Recognition" },
      { title: "Identity Verification" },
      { title: "Spoof & Replay Detection" },
    ],
  },
  {
    index: "05",
    title: "Digital Logic & Embedded Systems",
    description:
      "I design digital logic and microcontroller-based systems, from state machines to embedded control.",
    items: [
      { title: "Digital Logic Design" },
      { title: "Microcontroller Architecture" },
      { title: "Peripherals & Protocols (SPI, UART)" },
    ],
  },
] as const;
