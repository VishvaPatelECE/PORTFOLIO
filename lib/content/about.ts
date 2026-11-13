export interface CredentialRecord {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly organization: string;
  readonly period: string;
  readonly metrics: ReadonlyArray<{ label: string; value: string }>;
  readonly note: string;
}

export interface CapabilityGroup {
  readonly id: "wireless" | "compilers" | "vision" | "hardware";
  readonly discipline: string;
  readonly code: string;
  readonly focus: string;
  readonly items: readonly string[];
  readonly provenance: string;
}

export interface WorkbenchItem {
  readonly id: "robo-car" | "hardware-stopwatch";
  readonly kicker: string;
  readonly title: string;
  readonly summary: string;
  readonly specs: ReadonlyArray<{ label: string; value: string }>;
}

export const aboutPreviewContent = {
  heading: "About",
  paragraphs: [
    "I've always been curious about what happens beneath the surface: how things are designed, how their parts interact, and what makes a system work.",
    "I'm drawn to the space between hardware and software, where ideas move beyond theory and become systems that have to work in the real world. I enjoy breaking down complex problems, tracing how their pieces connect, and exploring better ways to solve them.",
    "That curiosity shapes how I approach engineering: question assumptions, understand the details, test what matters, and keep refining until the system makes sense.",
  ],
  lead: {
    before: "I've always been curious about ",
    emphasis: "what happens beneath the surface:",
    after: " how things are designed, how their parts interact, and what makes a system work.",
  },
  body: {
    intro: "I'm drawn to ",
    spaceHighlight: "the space between hardware and software",
    middle1: ", where ideas move ",
    theoryHighlight: "beyond theory",
    middle2: " and ",
    systemsHighlight: "become systems",
    conclusion:
      " that have to work in the real world. I enjoy breaking down complex problems, tracing how their pieces connect, and exploring better ways to solve them.",
  },
  conviction: {
    intro: "That curiosity shapes how I approach engineering:",
    statement:
      " question assumptions, understand the details, test what matters, and keep refining until the system makes sense.",
  },
} as const;

export const aboutPageContent = {
  hero: {
    code: "PROFILE · SYSTEMS & ECE ENGINEER",
    title: "Vishva Patel",
    subtitle:
      "Designing verifiable software representations, empirically tested wireless models, and fail-secure digital hardware.",
    highlights: [
      { label: "DEGREE", value: "B.Tech ECE · DDU Nadiad" },
      { label: "ACADEMIC CGPA", value: "8.99 / 10 (Sem I–VI)" },
      { label: "GATE 2026 EC", value: "AIR 6,931 · Score 451" },
      { label: "RESEARCH INTERNSHIP", value: "AI Dept · SVNIT Surat" },
    ],
  },
  credentials: [
    {
      id: "ddu-btech",
      kicker: "UNDERGRADUATE EDUCATION",
      title: "B.Tech in Electronics & Communication Engineering",
      organization: "Dharmsinh Desai University (DDU), Nadiad, Gujarat",
      period: "Expected May 2027",
      metrics: [
        { label: "Cumulative CGPA (Semesters I–VI)", value: "8.99 / 10.0" },
        { label: "Core ECE CGPA (Semesters III–VI)", value: "8.88 / 10.0" },
      ],
      note: "Verified from official DDU grade transcripts across completed coursework in signals, digital systems, microprocessors, and communications.",
    },
    {
      id: "gate-2026",
      kicker: "NATIONAL EXAMINATION",
      title: "GATE 2026 — Electronics & Communication (EC)",
      organization: "Graduate Aptitude Test in Engineering",
      period: "2026",
      metrics: [
        { label: "All India Rank (AIR)", value: "6,931" },
        { label: "GATE Score", value: "451" },
        { label: "Marks Obtained", value: "34.67 / 100.0" },
      ],
      note: "Verified against official GATE 2026 scorecard.",
    },
  ] satisfies readonly CredentialRecord[],
  researchTimeline: {
    internship: {
      kicker: "CERTIFIED INTERNSHIP · MAY 18 – JULY 17, 2026",
      title: "AI Research Intern — Department of Artificial Intelligence, SVNIT Surat",
      bullets: [
        "Constructed microscopic vehicular mobility co-simulations integrating SUMO via TraCI with 3GPP C-V2X Mode 4 channel and mutual-interference dynamics.",
        "Trained and evaluated decentralized multi-agent reinforcement learning agents on graph-structured vehicular observations for sidelink resource selection.",
        "Completed formal institutional certification under faculty supervision at SVNIT Surat on July 17, 2026.",
      ],
      href: "/experience/svnit",
      ctaLabel: "Read SVNIT Record & Certificate",
    },
    continuation: {
      kicker: "INDEPENDENT RESEARCH CONTINUATION · AUGUST 2026",
      title: "GraphMARL Paired-Seed Empirical Audit",
      bullets: [
        "Extended the post-internship GraphMARL codebase with paired-seed evaluation across 30 random seeds and strict statistical testing.",
        "Showed that under high vehicular contention, learned neural coordination yielded no statistically significant gain over randomized resource spreading (p = 0.824).",
        "Separated certified SVNIT internship deliverables from independent August empirical findings to preserve factual provenance.",
      ],
      href: "/graphmarl",
      ctaLabel: "Inspect GraphMARL Case Study",
    },
  },
  systemsMatrix: [
    {
      name: "RANGraph",
      domain: "Wireless Compilers & Canonical IR",
      href: "/rangraph",
      slug: "rangraph" as const,
      role: "Domain-specific semantic compiler converting heterogeneous O-RAN E2 telemetry into invariant-checked graph tensors with selective recompilation.",
    },
    {
      name: "GraphMARL",
      domain: "Vehicular MARL & Empirical Verification",
      href: "/graphmarl",
      slug: "graphmarl" as const,
      role: "Co-simulation of SUMO/TraCI mobility and C-V2X sidelink physics with paired-seed benchmarking of neural vs classical scheduling.",
    },
    {
      name: "DARVS",
      domain: "Vision & Challenge-Response State Machine",
      href: "/darvs",
      slug: "darvs" as const,
      role: "MTCNN detection, 2D movement challenges, FaceNet 512-D embeddings, and explicit disclosure of the unresolved eye-CNN polarity defect.",
    },
    {
      name: "USMHACS",
      domain: "Discrete Digital Hardware Security",
      href: "/usmhacs",
      slug: "usmhacs" as const,
      role: "Microcontroller-free access controller using TTL/CMOS 74-series combinational logic, NE555 timers, and fail-secure fault latching.",
    },
  ],
  capabilities: [
    {
      id: "wireless",
      discipline: "Wireless & Telecommunication Systems",
      code: "SYS-01",
      focus: "Channel physics, sidelink MAC contention, and RAN telemetry semantics",
      items: [
        "C-V2X Mode 4 sidelink resource allocation & interference modeling",
        "3GPP TR 38.901 / TR 37.885 channel propagation and SINR evaluation",
        "SUMO TraCI microscopic mobility coupling & paired-seed hypothesis testing",
        "O-RAN E2 telemetry schema design & topology graph representation",
      ],
      provenance: "Implemented and validated in RANGraph and GraphMARL.",
    },
    {
      id: "compilers",
      discipline: "Domain-Specific Compilers & Graph Systems",
      code: "SYS-02",
      focus: "Canonical intermediate representations and incremental correctness",
      items: [
        "Typed AST & canonical graph intermediate representation design",
        "Structural invariant validation across heterogeneous radio observations",
        "DAG dependency tracking and selective differential recompilation",
        "Deterministic Python and TypeScript verification fixtures",
      ],
      provenance: "Core architecture of the RANGraph semantic compiler.",
    },
    {
      id: "vision",
      discipline: "Computer Vision & Empirical ML",
      code: "SYS-03",
      focus: "Explicit state-machine orchestration and honest model auditing",
      items: [
        "PyTorch, PyTorch Geometric, Keras & OpenCV runtime pipelines",
        "MTCNN face localization and FaceNet 512-D embedding comparison",
        "2D movement challenge-response sequencing and anti-spoof state gating",
        "Failure-mode inspection and training/runtime polarity verification",
      ],
      provenance: "Authored in DARVS and GraphMARL experimental suites.",
    },
    {
      id: "hardware",
      discipline: "Discrete Digital Hardware & Embedded",
      code: "SYS-04",
      focus: "Deterministic timing, interlocks, and embedded sensing",
      items: [
        "TTL/CMOS 74-series combinational logic and asynchronous SR latches",
        "NE555 precision delay timers, fault latching, and reset interlocks",
        "Proteus schematic simulation and physical breadboard validation",
        "ESP32 microcontroller interfacing, sensor fusion, and DC motor PWM control",
      ],
      provenance: "Built across USMHACS and the Hardware Workbench.",
    },
  ] satisfies readonly CapabilityGroup[],
  workbench: [
    {
      id: "robo-car",
      kicker: "WORKBENCH · 01",
      title: "Autonomous Robo Car",
      summary:
        "Embedded rover platform built on an ESP32 controller coordinating ultrasonic range sensing, differential DC motor actuation, and real-time obstacle avoidance logic.",
      specs: [
        { label: "CONTROLLER", value: "ESP32 Dev Module" },
        { label: "SENSING", value: "HC-SR04 Ultrasonic" },
        { label: "DRIVE", value: "H-Bridge PWM Differential Steering" },
      ],
    },
    {
      id: "hardware-stopwatch",
      kicker: "WORKBENCH · 02",
      title: "Hardware Stopwatch",
      summary:
        "Purely discrete digital timing instrument driven by an NE555 astable pulse generator, cascaded decade/hex counters, and 7-segment BCD display decoders without firmware.",
      specs: [
        { label: "TIMEBASE", value: "NE555 Astable Oscillator" },
        { label: "COUNTING", value: "Cascaded Synchronous Counters" },
        { label: "DISPLAY", value: "BCD to 7-Segment Decoder Drivers" },
      ],
    },
  ] satisfies readonly WorkbenchItem[],
  methodology: {
    kicker: "ENGINEERING PRINCIPLE",
    headline: "Probe the failure condition before trusting the output.",
    body: "Whether compiling radio telemetry into graphs, testing vehicular reinforcement learning policies against random baselines, exposing an eye-blink polarity mismatch in computer vision, or latching a hardware fault before permitting entry, every project in this portfolio prioritizes verifiable behavior over demo polish.",
  },
} as const;

