import test from "node:test";
import assert from "node:assert/strict";
import {
  skillsHeader,
  kineticLines,
  disciplineCards,
} from "../lib/content/skills";

test("skills header mirrors Samarth structure with Vishva systems identity", () => {
  assert.equal(skillsHeader.title, "Skills");
  assert.equal(skillsHeader.eyebrow, "Behind the systems, Beyond the code");
  assert.match(skillsHeader.lead, /Wireless Systems, Systems Architecture/);
});

test("kinetic lines form 4 balanced scroll-sliding streams with alternating cyan and gold", () => {
  assert.equal(kineticLines.length, 4);

  // Line 1: Systems Architecture
  assert.ok(kineticLines[0].segments.some(s => "text" in s && s.text === "Systems Architecture"));

  // Line 2: Artificial Intelligence — [cyan bar] — Wireless Communications
  assert.ok(kineticLines[1].segments.some(s => "text" in s && s.text === "Artificial Intelligence"));
  assert.ok(kineticLines[1].segments.some(s => "bar" in s && s.bar && s.color === "cyan"));
  assert.ok(kineticLines[1].segments.some(s => "text" in s && s.text === "Wireless Communications"));

  // Line 3: Algorithms — [gold bar] — Computer Vision — [cyan bar] — Embedded Systems
  assert.ok(kineticLines[2].segments.some(s => "text" in s && s.text === "Algorithms"));
  assert.ok(kineticLines[2].segments.some(s => "bar" in s && s.bar && s.color === "gold"));
  assert.ok(kineticLines[2].segments.some(s => "text" in s && s.text === "Computer Vision"));
  assert.ok(kineticLines[2].segments.some(s => "bar" in s && s.bar && s.color === "cyan"));
  assert.ok(kineticLines[2].segments.some(s => "text" in s && s.text === "Embedded Systems"));

  // Line 4: Hardware — [gold bar] — Software — [cyan bar] — Security
  assert.ok(kineticLines[3].segments.some(s => "text" in s && s.text === "Hardware"));
  assert.ok(kineticLines[3].segments.some(s => "bar" in s && s.bar && s.color === "gold"));
  assert.ok(kineticLines[3].segments.some(s => "text" in s && s.text === "Software"));
  assert.ok(kineticLines[3].segments.some(s => "bar" in s && s.bar && s.color === "cyan"));
  assert.ok(kineticLines[3].segments.some(s => "text" in s && s.text === "Security"));
});

test("discipline cards contain 5 natural domains with 3 capability items each and no AI jargon", () => {
  assert.equal(disciplineCards.length, 5);

  const [c1, c2, c3, c4, c5] = disciplineCards;

  // Card 01 — Wireless Communication Systems
  assert.equal(c1.index, "01");
  assert.equal(c1.title, "Wireless Communication Systems");
  assert.match(c1.description, /connected devices communicate/);
  assert.equal(c1.items.length, 3);
  assert.equal(c1.items[0].title, "Wireless Network Modelling");
  assert.equal(c1.items[1].title, "Radio Resource Management");
  assert.equal(c1.items[2].title, "Channel & Interference Analysis");

  // Card 02 — Systems & Software Architecture
  assert.equal(c2.index, "02");
  assert.equal(c2.title, "Systems & Software Architecture");
  assert.match(c2.description, /software systems and data pipelines around strictly defined data schemas/);
  assert.equal(c2.items.length, 3);
  assert.equal(c2.items[0].title, "Schema & Data Modelling");
  assert.equal(c2.items[1].title, "Graph Data Pipelines");
  assert.equal(c2.items[2].title, "Algorithms & Optimization");

  // Card 03 — AI & Graph Intelligence
  assert.equal(c3.index, "03");
  assert.equal(c3.title, "AI & Graph Intelligence");
  assert.match(c3.description, /intelligent systems that learn relationships/);
  assert.equal(c3.items.length, 3);
  assert.equal(c3.items[0].title, "Graph-Based Learning");
  assert.equal(c3.items[1].title, "Reinforcement Learning");
  assert.equal(c3.items[2].title, "Multi-Agent Systems");

  // Card 04 — Computer Vision & Biometrics
  assert.equal(c4.index, "04");
  assert.equal(c4.title, "Computer Vision & Biometrics");
  assert.match(c4.description, /vision-based systems that recognize faces, verify identities, and reject spoofing attempts/);
  assert.equal(c4.items.length, 3);
  assert.equal(c4.items[0].title, "Face Recognition");
  assert.equal(c4.items[1].title, "Identity Verification");
  assert.equal(c4.items[2].title, "Spoof & Replay Detection");

  // Card 05 — Digital Logic & Embedded Systems
  assert.equal(c5.index, "05");
  assert.equal(c5.title, "Digital Logic & Embedded Systems");
  assert.match(c5.description, /digital logic and microcontroller-based systems/);
  assert.equal(c5.items.length, 3);
  assert.equal(c5.items[0].title, "Digital Logic Design");
  assert.equal(c5.items[1].title, "Microcontroller Architecture");
  assert.equal(c5.items[2].title, "Peripherals & Protocols (SPI, UART)");
});
