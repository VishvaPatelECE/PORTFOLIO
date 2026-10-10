export const featuredProjects = [
  { name: "RANGraph", field: "Wireless & representation", line: "Making data mean something.", href: "/rangraph", kind: "wireless", action: "Open project" },
  { name: "GraphMARL", field: "Research in progress", line: "Project details coming soon.", href: "/graphmarl", kind: "research", action: "View research status" },
  { name: "DARVS", field: "Vision & identity", line: "Presence before permission.", href: "/darvs", kind: "vision", action: "Open project" },
  { name: "USMHACS", field: "Hardware & control", line: "Trust the logic. Test the failure.", href: "/usmhacs", kind: "hardware", action: "Open project" },
] as const;

export const workbenchProjects = [
  { name: "Autonomous Robo Car", field: "ESP32 · embedded control", href: "/about#robo-car", kind: "car" },
  { name: "Hardware Stopwatch", field: "Discrete timing & counting", href: "/about#hardware-stopwatch", kind: "timer" },
] as const;
