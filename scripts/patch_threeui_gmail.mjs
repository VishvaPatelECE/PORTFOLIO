import fs from "fs";

// 1. Patch brand-orbs-v2.html.js
const htmlJsPath = "node_modules/@designcodeio/threeui/lib-dist/shaders/brand-orbs/sources/brand-orbs-v2.html.js";
let htmlJs = fs.readFileSync(htmlJsPath, "utf8");

// The modern 2020 Google Gmail ribbon M logo path
const modernGmailPath = "M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6 M120 108h14c3.32 0 6-2.69 6-6V59l-20 15 M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2 M72 74V48l24 18 24-18v26L96 92 M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2";

// Replace or set MARK_PATHS.gmail
if (htmlJs.includes('gmail: "M24 5.457')) {
  htmlJs = htmlJs.replace(
    /gmail:\s*"M24 5\.457[^"]*",?/,
    `gmail: "${modernGmailPath}",`
  );
} else if (!htmlJs.includes(`gmail: "${modernGmailPath}"`)) {
  htmlJs = htmlJs.replace(
    'MARK_PATHS = {',
    `MARK_PATHS = {\n    gmail: "${modernGmailPath}",`
  );
}

// Update COVER_MARKS for gmail with vb: 144
if (htmlJs.includes('covPath("gmail", MARK_PATHS.gmail')) {
  htmlJs = htmlJs.replace(
    /covPath\("gmail", MARK_PATHS\.gmail,[^)]+\)/,
    'covPath("gmail", MARK_PATHS.gmail, 18, .76, 144, 0, null, 1)'
  );
} else {
  htmlJs = htmlJs.replace(
    'github: () => cov("github"',
    `gmail: () => cov("gmail", () => covPath("gmail", MARK_PATHS.gmail, 18, .76, 144, 0, null, 1)),\n    github: () => cov("github"`
  );
}

// Multi-color Gmail dot coloring logic in drawMark
const gmailColorLogic = `      if (cfg.key === "gmail") {
        const m = clamp01((gx + 0.75) / 1.5);
        if (m < 0.28) {
          d.c = [234, 67, 53];
        } else if (m < 0.48) {
          const tC = (m - 0.28) / 0.20;
          d.c = [lerp(234, 251, tC), lerp(67, 188, tC), lerp(53, 4, tC)];
        } else if (m < 0.72) {
          const tC = (m - 0.48) / 0.24;
          d.c = [lerp(251, 52, tC), lerp(188, 168, tC), lerp(4, 83, tC)];
        } else {
          const tC = (m - 0.72) / 0.28;
          d.c = [lerp(52, 66, tC), lerp(168, 133, tC), lerp(83, 244, tC)];
        }
      }`;

if (!htmlJs.includes('if (cfg.key === "gmail")')) {
  htmlJs = htmlJs.replace(
    'dots.push(d);\n    }',
    `${gmailColorLogic}\n      dots.push(d);\n    }`
  );
}

// Replace PRESETS for email & gmail with vb: 144 and multi-color draw
const gmailPreset = 'email:  { draw: mk({ key: "gmail", n: 30, nMini: 13, motion: "scan", speed: .4, vb: 144, v: .64 }), accent: [234, 67, 53], speed: 1, staticT: 1.1 },\n    gmail:  { draw: mk({ key: "gmail", n: 30, nMini: 13, motion: "scan", speed: .4, vb: 144, v: .64 }), accent: [234, 67, 53], speed: 1, staticT: 1.1 },';

htmlJs = htmlJs.replace(
  /(\n\s*)email:\s*\{[^}]+},(\s*gmail:\s*\{[^}]+},)?/,
  `$1${gmailPreset}`
);

// Remove inverted circle background from github so only the octocat mark is drawn
htmlJs = htmlJs.replace(
  'covPath("github", MARK_PATHS.github, 18, .8, 24, 0, "circle", 1)',
  'covPath("github", MARK_PATHS.github, 18, .8, 24, 0, null, 1)'
);
htmlJs = htmlJs.replace(
  'github: { draw: mk({ key: "github", n: 30, nMini: 13, motion: "diag", invert: "circle"',
  'github: { draw: mk({ key: "github", n: 30, nMini: 13, motion: "diag", invert: null'
);

// Animation on icons: the background/baseline is bright (light tone), and the dark wave moves across the icons
const darkWaveLogic = `let darkWave;
      if (cfg.motion === "scan") darkWave = Math.exp(-Math.pow(gy - wave, 2) / .06);
      else if (cfg.motion === "sweep") {
        const ph = ((Math.atan2(gy, gx) / TAU + .5 - t * .3) % 1 + 1) % 1;
        darkWave = Math.exp(-Math.pow(ph - .5, 2) / .016);
      } else darkWave = Math.exp(-Math.pow((gx - gy) * .5 - wave, 2) / .06);
      const crest = 1.0 - 0.70 * darkWave;`;

if (htmlJs.includes("const crest = 1.0;")) {
  htmlJs = htmlJs.replace("const crest = 1.0;", darkWaveLogic);
} else {
  htmlJs = htmlJs.replace(
    /let crest;\s*if\s*\(cfg\.motion === "scan"\) crest = Math\.exp\(-Math\.pow\(gy - wave, 2\) \/ \.05\);\s*else if\s*\(cfg\.motion === "sweep"\) \{\s*const ph = \(\(Math\.atan2\(gy, gx\) \/ TAU \+ \.5 - t \* \.3\) % 1 \+ 1\) % 1;\s*crest = Math\.exp\(-Math\.pow\(ph - \.5, 2\) \/ \.014\);\s*\} else crest = Math\.exp\(-Math\.pow\(\(gx - gy\) \* \.5 - wave, 2\) \/ \.05\);/,
    darkWaveLogic
  );
}

// Ensure all path dots are always properly centered around (0,0) by checking bounding box
htmlJs = htmlJs.replace(
  'if (rc && pts.length) {',
  'if (pts.length) {'
);

// Report missing mode clearly rather than silently ignoring
if (!htmlJs.includes("BrandOrbs: requested mode")) {
  htmlJs = htmlJs.replace(
    'if (!mode) return;',
    'if (!mode) { console.warn("BrandOrbs: requested mode " + canvas.dataset.mode + " not defined"); return; }'
  );
}

fs.writeFileSync(htmlJsPath, htmlJs);
console.log("Patched brand-orbs-v2.html.js with modern multi-color Gmail logo, permanent light tone, and auto-centering");

// 2. Patch BrandOrbs.js
const brandOrbsJsPath = "node_modules/@designcodeio/threeui/lib-dist/shaders/brand-orbs/BrandOrbs.js";
let brandOrbsJs = fs.readFileSync(brandOrbsJsPath, "utf8");

if (!brandOrbsJs.includes('"gmail"')) {
  brandOrbsJs = brandOrbsJs.replace('"email"', '"email",\n  "gmail"');
  brandOrbsJs = brandOrbsJs.replace('email: "Email"', 'email: "Gmail",\n  gmail: "Gmail"');
}

// Make BrandOrbs iframe and document background completely transparent
brandOrbsJs = brandOrbsJs.replace(
  'const o = t === "light" ? "#dad7cc" : "#050608"',
  'const o = "transparent"'
);
brandOrbsJs = brandOrbsJs.replace(
  /B\s*=\s*m\s*===\s*"light"\s*\?\s*"#dad7cc"\s*:\s*"#050608"/,
  'B = "transparent"'
);
brandOrbsJs = brandOrbsJs.replace(
  'background: ${o};',
  'background: transparent;'
);
brandOrbsJs = brandOrbsJs.replace(
  'background: B,',
  'background: "transparent",\n        backgroundColor: "transparent",',
);
brandOrbsJs = brandOrbsJs.replace(
  'canvas { display: block; width: ${r}px; height: ${r}px; filter: ${i}; }',
  'canvas { display: block; width: min(${r}px, 100%); height: min(${r}px, 100%); filter: ${i}; }'
);

fs.writeFileSync(brandOrbsJsPath, brandOrbsJs);
console.log("Patched BrandOrbs.js with transparent background");

// 3. Patch BrandOrbs.d.ts
const brandOrbsDtsPath = "node_modules/@designcodeio/threeui/lib-dist/shaders/brand-orbs/BrandOrbs.d.ts";
let brandOrbsDts = fs.readFileSync(brandOrbsDtsPath, "utf8");
if (!brandOrbsDts.includes('"gmail"')) {
  brandOrbsDts = brandOrbsDts.replace('"email"', '"email", "gmail"');
  fs.writeFileSync(brandOrbsDtsPath, brandOrbsDts);
  console.log("Patched BrandOrbs.d.ts");
}

// 4. Strict verification assertions: ensure no silent patch failures
const errors = [];
if (!htmlJs.includes(modernGmailPath)) {
  errors.push("Failed to inject modernGmailPath into MARK_PATHS");
}
if (!htmlJs.includes('covPath("gmail", MARK_PATHS.gmail')) {
  errors.push("Failed to inject gmail into COVER_MARKS");
}
if (!htmlJs.includes('if (cfg.key === "gmail")')) {
  errors.push("Failed to inject multi-color Gmail dot coloring logic");
}
if (!htmlJs.includes('gmail:  { draw: mk({ key: "gmail"')) {
  errors.push("Failed to inject gmail preset into MODES");
}
if (!htmlJs.includes('covPath("github", MARK_PATHS.github, 18, .8, 24, 0, null, 1)')) {
  errors.push("Failed to patch GitHub mark circle removal");
}
if (!brandOrbsJs.includes('"gmail"')) {
  errors.push("Failed to patch BrandOrbs.js variant list with 'gmail'");
}
if (!brandOrbsJs.includes('background: "transparent",')) {
  errors.push("Failed to patch BrandOrbs.js background transparency");
}
if (!brandOrbsDts.includes('"gmail"')) {
  errors.push("Failed to patch BrandOrbs.d.ts with 'gmail'");
}

if (errors.length > 0) {
  console.error("FATAL: ThreeUI BrandOrbs patch failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log("All ThreeUI BrandOrbs patches verified successfully!");

