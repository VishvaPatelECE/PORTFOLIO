# VishvaProjects V3 — source audit

7 October 2026 · Phase 1 · Application implementation has not started.

The current portfolio has substantive engineering interactions worth preserving. Its presentation obstructs access, overstates simulated DARVS telemetry, and makes the hardware simulator difficult to operate on mobile and with a keyboard. V3 should keep the engineering models, rebuild the presentation, and give the face a strictly temporary role in the opening sequence.

## Scope and preservation

Inspected the original Next.js source, configuration, route files, components, state logic, asset inventory and CV at `C:\Users\HP\darvs-portfolio`, commit `1011122d185156c7542894747e9ce32a60156e4c`. Its Git working tree was clean at the beginning of the audit. A SHA-256 manifest of tracked files was captured before work and compared again at completion; see [verification](docs/PRESERVATION.md).

The source was read only. No install, dev server, build, migration, Git mutation or application code edit was performed there. This report and all new planning files live in `C:\RESEARCH\portfolio v3`.

This audit extends the earlier live-site inspection and read-only reviews of DARVS, RANGraph and the supplied face ZIP. Earlier browser checks covered desktop 1440×900 and mobile 390×844, homepage scan, DARVS stage selection, USMHACS Perfect Entry, direct About access, and face rendering modes. This turn adds original-source verification, CV extraction, and isolated in-memory diagnostics of the actual USMHACS reducer and scenario runner. Those diagnostics do not mount React or run real hardware.

No fresh application build, full regression suite, screen-reader assessment, Lighthouse run or frame-rate measurement was performed. Local camera/model servers, cloud integrations and research workloads were not executed. Source findings and performance risks below are distinguished from measured behavior.

The two handwritten images are absent from the available attachments. The new pasted request provides their reference list and palette transcription. That is enough for this audit and a provisional direction; it is not equivalent to inspecting the images. The new request supersedes the earlier persistent-face direction board.

## Architecture and routes

| Area | Source finding | V3 implication |
|---|---|---|
| Framework | Next.js 16.2.3, React/React DOM 19.2.4, App Router | Retain this architecture as the migration baseline; validate dependency compatibility in the new workspace before installing. |
| Styling | Tailwind 4 and custom global CSS; many repeated inline color values | Establish a small semantic token system in V3. |
| Motion | Framer Motion `^12.38.0`, CSS loops, timers and requestAnimationFrame | Keep one owner for each animated property; isolate animation from model decisions. |
| Other runtime dependencies | Lucide React `^1.8.0`, Vercel Analytics `^2.0.1` | Reuse selectively. Analytics is not project evidence. |
| Tooling | TypeScript 5, ESLint 9, Next ESLint config | Scripts cover dev/build/start/lint; no project test script or test suite was found. |
| 3D | No Three.js, R3F or GSAP dependency in the original portfolio | The face ZIP is a separate implementation, not an existing portfolio component. |
| Root layout | AuthProvider, ScrollDepthLayer and Analytics wrap every route | Remove verification from global navigation eligibility. Keep rendering effects local. |
| Typography | Inter, Space Grotesk and JetBrains Mono loaded via next/font | Current README's Geist mention is boilerplate, not the actual type system. Rebuild typography under the new brief. |

Versions above are declarations from [package.json](C:/Users/HP/darvs-portfolio/package.json:1), not a claim that these are the latest available releases. The Next configuration is minimal; the repository README remains largely scaffold text.

| Current URL | Implementation | Preserve or change |
|---|---|---|
| `/` | Hero, verification lock, Projects, contact overlay | Replace the access gate with a short, escapable intro. |
| `/about` | AboutDossier | Keep biography/CV access; remove verification requirement. |
| `/research` | Re-exports `/about` | Preserve the URL, replace the alias with an actual research index. |
| `/darvs` | Client-side architecture explanation and generated telemetry | Preserve stage inspection; correct architecture and demo labeling. |
| `/usmhacs` | Simulator on desktop, preview on mobile | Build a usable mobile instrument driven by the same model. |
| `/usmhacs/full` | Full wide diagram | Preserve the address and full simulator intent; make its controls responsive. |
| `/rangraph` | Absent | Add a source-backed transformation explorer in V3. |

There are no portfolio API route handlers implementing inference or contact submission in the inspected source.

## Components and assets

| Source | Useful foundation | Replacement boundary |
|---|---|---|
| `Hero.tsx` | Identity, engineering proposition, stage narration | Replace layout, verification gate, random metrics and decorative motion. |
| `USMHACSPanel.tsx` | State reducer, latch/door rules, delay, reset, event log, scenarios | Extract model and clock; correct scenario cancellation; rebuild diagram and controls. |
| `app/darvs/page.tsx` | Selectable explanatory stages and engineering tradeoffs | Replace generated telemetry and unsupported validation claims; remove unused anti-spoof stage from active pipeline. |
| `Projects.tsx` | Project inventory, hierarchy and links | Replace repeated nested panels with project-specific instruments. |
| `AboutDossier.tsx` | Education, interests, skills and CV destination | Keep factual content with provenance; remove gate and boot typing delay. |
| `SecureCommunication.tsx` | Contact intents, editable text, Gmail/mailto/clipboard actions | Simplify and label literally; fix dialog semantics/focus. |
| `ScanGate.tsx` | Separate unused scan implementation | Do not port duplicate verification logic. |
| `ScrollDepthLayer.tsx` | Some listener cleanup | Reconsider its page-wide pointer glow and scroll darkening. |

The original public directory contains the 156,063-byte CV, a 2,556-byte USMHACS preview SVG, and scaffold SVG assets. It does not contain a head model, hardware photos or research datasets. The face ZIP supplies `head.glb` and a poster separately.

The face GLB is 404,976 bytes with 9,279 position entries, 53,052 triangle indices and 17,684 triangles. It has no rig, animation clips, textures or morph targets. The poster is 119,366 bytes. Standalone vendored JavaScript totals 2,156,846 bytes uncompressed; that is not a measured production transfer size. The mesh is a Lee Perry-Smith scan under CC BY 3.0, not a portrait of Vishva. Preserve the attribution and describe modifications. [Face audit](<C:/Users/HP/OneDrive/Documents/New project/audit/FACE-SCENE-AUDIT.md>).

## Findings, prioritized

### P1 — Entry blocks access and direct About loads

[Home](C:/Users/HP/darvs-portfolio/app/page.tsx:38) locks document/body scrolling and suppresses wheel, touch and navigation keys until verification. Projects are blurred and pointer-disabled. [AuthContext](C:/Users/HP/darvs-portfolio/context/AuthContext.tsx:13) starts unverified in memory. [AboutDossier](C:/Users/HP/darvs-portfolio/components/AboutDossier.tsx:117) returns an access-restricted screen on direct load; `/research` inherits it.

**V3 action:** make all routes independently readable. Intro state belongs only to the home entry presentation. Show an immediate Enter/Skip control and never infer authentication from animation completion.

### P1 — Simulated telemetry is presented as live system evidence

[DARVS](C:/Users/HP/darvs-portfolio/app/darvs/page.tsx:32) generates randomized outcomes and logs; later effects generate confidence around 90–95% and processing times around 240–250 ms. Its initial event counts are hardcoded. The heading “Live System Panel” gives these numbers a stronger meaning than the implementation supports. The homepage generates similar measurements.

**V3 action:** use a deterministic architectural demonstration with an explicit demo label. Stages can animate without invented numbers. Describe real cosine similarity as similarity, not accuracy or calibrated confidence. Remove asserted spoof-prevention/validation outcomes unless linked to a documented test artifact.

### P1 — Old scenario timers can corrupt a new USMHACS scenario

[runScenario](C:/Users/HP/darvs-portfolio/components/USMHACSPanel.tsx:426) tracks its initial 200 ms timer, but not the nested one-second timers at lines 438, 444 and 449. Starting another scenario after the initial timer fires cannot cancel the nested action. The unmount cleanup also lacks these timer IDs. The breach callback additionally captures an older sensor snapshot.

**Reproduced using the actual extracted source:** start Brute Force at t=0; switch to Perfect Entry at t=500 ms. The old wrong-code event fires at t=1200 ms and latches the system. The new correct-code event fires at t=1700 ms, but the latch remains set. This is a software scheduling defect in the browser simulator.

**V3 action:** use a cancellable scenario schedule or generation token, cancel every scheduled action on replacement/unmount, and make breach sensor data explicit. Preserve valid latch behavior while fixing this race in the V3 copy.

### P1 — Core simulator interactions are mouse-only

[StatusDiamond](C:/Users/HP/darvs-portfolio/components/USMHACSPanel.tsx:211) attaches `onClick` to a div with no button semantics, focusability or keyboard activation. Sensors, key, code and tamper interactions therefore lack equivalent keyboard access.

**V3 action:** use native controls with visible focus and explicit state. Drive both the diagram and a readable control list from the same reducer. Signal color must be accompanied by labels/icons.

### P1 — Mobile behavior hides or constrains the actual experience

[Home](C:/Users/HP/darvs-portfolio/app/page.tsx:124) tells mobile users to use desktop mode. USMHACS uses a 1,100 px minimum-width circuit and a mobile preview. The DARVS explanation area uses fixed `h-32 overflow-hidden` around a grid that becomes vertically stacked below `md`, creating a source-level clipping risk. [DARVS layout](C:/Users/HP/darvs-portfolio/app/darvs/page.tsx:200).

**V3 action:** vertical signal flow, tap-driven stage inspection, responsive annotations and content-driven explanation heights. Test narrow phones, landscape and 200% zoom; horizontal panning may be an optional circuit view, not the only way to operate it.

### P2 — Contact implies encryption and lacks modal behavior

[SecureCommunication](C:/Users/HP/darvs-portfolio/components/SecureCommunication.tsx:63) displays an encryption stage, but its actual operations are opening Gmail/mailto and copying text. It handles Escape and restores body overflow, which are useful foundations, but lacks a labeled dialog, focus containment/restoration and an accessible textarea label.

**V3 action:** use plain “Open email” / “Copy message” language. Prefer a simple contact section; if a dialog remains, implement complete dialog behavior. Do not announce sent, encrypted or delivered when that has not occurred.

### P2 — Motion is frequent, uncoupled from state and lacks reduced-motion handling

No `prefers-reduced-motion`, `useReducedMotion` or reduced-motion MotionConfig was found in the original app. CSS repeatedly sweeps buttons and animates the scan line's `top` property. [Global motion](C:/Users/HP/darvs-portfolio/app/globals.css:80). DARVS uses frame-loop React state updates for display metrics and page-level pointer state. [DARVS frame loop](C:/Users/HP/darvs-portfolio/app/darvs/page.tsx:392). The global pointer effect rewrites a radial gradient on every move. [ScrollDepthLayer](C:/Users/HP/darvs-portfolio/components/ScrollDepthLayer.tsx:25).

**V3 action:** animate only a meaningful transition or active process; keep per-frame values in renderer state/refs, pause hidden scenes, and offer reduced-motion equivalents. These are rendering risks identified in source; no FPS regression number is claimed.

### P2 — Face rendering needs lifecycle corrections before reuse

The supplied scene still renders while paused, uses the indexed triangle geometry for Points (repeating shared positions), treats context loss as terminal, and disposes on pagehide without a matching back/forward-cache resume path. [Detailed face findings](<C:/Users/HP/OneDrive/Documents/New project/audit/FACE-SCENE-AUDIT.md>).

**V3 action:** dedicated point geometry, bounded intro lifetime, cancellation/disposal on every exit, visibility suspension, and an immediate poster/Enter fallback. No face renderer remains mounted behind the main world.

### P2 — Engineering evidence needs a consistent boundary

Portfolio code depicts a separate Anti-Spoof stage, whereas the active Python runtime uses camera → MTCNN → randomized movement/optional blink challenges → FaceNet → decision. An experimental anti-spoof file is not evidence of an active stage. RANGraph contains competing historical benchmark narratives, so metrics require an authoritative evidence snapshot before publication. Supporting hardware descriptions are not equivalent to inspected schematics or bench results.

**V3 action:** distinguish source-backed implementation, browser simulation, illustrative visualization and owner-reported achievement. Provide source/documentation adjacent to the relevant project.

### P3 — Presentation and maintenance obscure hierarchy

The site repeats panel borders, inset shadows, colored text, animated button layers and nested cards. Project links wrap buttons inside links. A mono font is loaded without an explicit Tailwind `font-mono` mapping in the inspected global CSS. Several large client components combine model, rendering, content and timers. There is no regression suite guarding the simulator.

**V3 action:** use semantic links/buttons, consolidate tokens, split model from view, and vary project composition according to the engineering task. Keep tests focused on actual state transitions and cancellation, not class-name snapshots.

## Engineering truth and reuse contracts

### DARVS

The local Python repository at `C:\Users\HP\OneDrive\Documents\face_project` was inspected read-only at commit `b5d6380`. It uses Flask, OpenCV, MTCNN, movement/eye-state liveness and FaceNet. Liveness chooses three actions from left/right/up/down/blink, so blink is optional per attempt. Recognition samples every seventh camera frame. Similarity is cosine ×100, with a configured threshold of 78; this is an implementation setting, not a benchmark.

Preserve architecture exploration and tradeoff explanations. Do not bring the local server, biometric records, models or cloud credentials into public portfolio assets. The earlier source review found unguarded admin actions, debug startup and training/inference eye-label disagreement; the local backend is not ready to become a public demo. These issues are documented rather than changed. [DARVS source notes](<C:/Users/HP/OneDrive/Documents/New project/audit-temp/darvs-local-evidence.md>).

The new intro and later DARVS instrument are different views. The intro contains the face; the project instrument contains the pipeline, challenge examples, matching explanation, failure paths and source evidence, without bringing the face back.

### USMHACS

The current browser model has four Boolean sensors, key state, code state `idle/correct/wrong`, delay state, tamper state, a persistent latch, door state and the last eight log entries. The code control cycles three states; it is not a bit-by-bit 4-bit decoder. “Brute Force” currently demonstrates a wrong-code lockout, not an implemented attempt counter or timed rate limiter.

Unsafe sensors, wrong code or tamper set the latch. The door requires a key, completed delay, no tamper and no latch. Correct code initiates a five-second delay in a React effect. Protected reset rejects unsafe sensors, a currently wrong code or active tamper. Safe reset clears the latch while preserving other current inputs. The actual circuit has parallel inputs to the AND/interlock logic; the left-to-right stage sequence is an explanatory reading order, not a literal serial electrical path. [State model](C:/Users/HP/darvs-portfolio/components/USMHACSPanel.tsx:88).

Eight isolated reducer checks passed: initially closed; key alone closed; correct code waiting; completed delay plus key opens; tamper closes/latches; removing tamper retains latch; safe latch clearing restores an otherwise eligible open state; key removal closes. Two further checks reproduced and confirmed the scenario race. Clock completion was injected as a reducer action; these checks do not verify the React five-second effect, audio, component mounting or physical hardware. [Diagnostic record](docs/usmhacs-diagnostic.json).

### RANGraph

The source at `C:\RESEARCH\RANGraph`, HEAD `c5125d0`, already had extensive working-tree changes. They were preserved. The useful foundation is its typed ingestion, five compiler passes, immutable IR, separate nonrepairing validation and gated exports. Composite node identity is `(node_type, entity_id)`. Associations follow source `serving_gnb_id`; do not infer a serving tower from proximity or invent interference edges without source coupling observations.

Reuse the existing computed TypeScript fixture explorer: two timesteps, three UEs, two gNBs and one handover. It supports millisecond-to-second conversion, linear SINR-to-dB conversion and an actual dangling-reference diagnostic. This is a browser fixture model, not execution of the Python compiler. The existing `/try` bridge can execute Python but requires server infrastructure; it is a separate future decision. The `website v2` 3D world is illustrative. [RANGraph evidence and paths](<C:/Users/HP/OneDrive/Documents/New project/audit-temp/rangraph-local-evidence.md>).

### Biography and other projects

The [CV](C:/Users/HP/darvs-portfolio/public/Vishva_Patel_CV.pdf) supports B.Tech ECE at Dharmsinh Desai University, expected 2027, CGPA 9.13 through Semester 5, DARVS, Proteus-based USMHACS simulation and the ESP32 multi-mode robotic project. These are owner-provided statements, not independent certification. Preserve the semester qualification on CGPA. The site's GATE EC 2026 AIR 6931 and May 2027 graduation detail are not corroborated by this CV. Do not silently present its older project or academic snapshot as freshly verified.

The stopwatch is described in the portfolio, but its circuit/source was not supplied. Keep it a concise supporting project. The CV's Aspire Leaders Program statement does not imply a Harvard degree or employment affiliation. GraphMARL remains exactly “Project details coming soon.” No verified CMEL source was found in the supplied material; omit it.

## Source-review quality assessment

These are provisional design-review scores, not automated measurements or a compliance certification. Scale: 0 absent, 1 substantial gaps, 2 partial, 3 strong, 4 comprehensively verified.

| Dimension | Score | Basis |
|---|---:|---|
| Accessibility | 1/4 | Entry obstruction, nonsemantic controls, incomplete contact dialog, no reduced-motion handling. |
| Responsive behavior | 1/4 | Desktop-mode instruction, wide simulator and fixed-height mobile explanation risk. |
| Performance engineering | 2/4 | Some cleanup exists; frame-driven state, global glow and face lifecycle need correction; runtime measurements pending. |
| Evidence clarity | 1/4 | Useful technical content mixed with generated telemetry and overly broad security claims. |
| Maintainability | 2/4 | Recognizable route/components and reducer; monolithic views, duplicated scan logic and no regression suite. |

## Migration boundary and next work

Preserve the source repository untouched. In V3, keep server-rendered identity, project explanations and evidence links; introduce small client islands for the intro and each instrument. Separate content/provenance, deterministic state, clocks, renderers and accessible controls. Use one compatible Three.js runtime and route-level lazy loading; do not copy the standalone 2 MB vendor bundle into the initial page.

Implementation follows delivery of this audit and completion of the visual reference review: finalize design tokens/type/layout from the actual handwritten images; build the short intro and home world; port DARVS and the corrected USMHACS model; adapt the RANGraph fixture explorer; add supporting content and the GraphMARL placeholder; then test and critique.

Acceptance checks must cover direct URLs/reloads/history; intro skip before/during asset load; reduced motion; missing/WebGL context-loss fallback; face disposal after entry; narrow mobile and zoom; complete keyboard operation; simulator delay, latch, reset and scenario interruption; DARVS wording against Python source; RANGraph conversions, reference failure, temporal events and export labeling. Measure performance on the built V3 copy rather than claiming it from design intentions.

See [V3 direction](V3-DIRECTION.md) for the new face-only entry, proposed typography/palette, route hierarchy and renderer boundaries. Final visual selection requires the two handwritten images; no application implementation was performed for this audit.
