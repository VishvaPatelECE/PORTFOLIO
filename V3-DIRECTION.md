# VishvaProjects V3 — revised direction

7 October 2026 · Provisional design specification following the source audit.

The face is an opening event. The portfolio that follows is built around typography and working engineering instruments. This document replaces the previous direction board's persistent-face hero and generic sans recommendation. It is a proposal, not a built interface or a completed Phase 2 design system.

## Reference priority and unresolved input

The controlling order is: the two handwritten images; current engineering identity; project source for technical truth; external interaction references; selected ideas from the older Silicon Laboratory concept. The images themselves are missing from the available attachments. The palette and reference names below come from the user's explicit transcription. Their spatial relationships, annotations and typography cannot honestly be claimed as visually inspected.

Before finalizing visual design, review both original images and revise this document where necessary. The absence of the images does not affect the source findings in [AUDIT.md](AUDIT.md).

## Experience and composition

Voice: **precise, spatial, investigative**. The physical analogy is a dark optical bench: a lit subject during initialization, then sparse diagrams and readable annotations under deliberate inspection. The near-black environment follows the brief's scene and palette. The site should make inputs, decisions and failure states easy to see.

The main home composition places VISHVA and PATEL as two deliberately offset typographic structures aligned to a shared engineering baseline. Keep the full name, role and proposition readable within a small laptop viewport. An open region of the composition contains a single signal/topology view related to the selected system. Project entry points are text and diagram affordances with clear destinations. No face remains here.

Preserve the positioning “Embedded & Intelligent Systems Engineer” and the proposition “Engineering secure systems at the intersection of hardware and intelligence.” Use explanatory copy about what each system actually does, followed by an immediately operable control and an evidence path.

| Section | Main object or interaction | What the visitor learns |
|---|---|---|
| Entry | Face scan followed by dissolution | DARVS coordinates a staged verification process; this sequence is a demo. |
| Home | Spatial name, a single signal topology, direct system links | Who Vishva is and where to explore. |
| DARVS | An explorable processing path with challenge and decision states | Detection, liveness, embedding, similarity and failure handling. |
| USMHACS | A circuit and controls driven by a deterministic state model | Which conditions permit opening and which latch a fault. |
| RANGraph | Source record, transformation, graph and diagnostic inspector | How wireless data becomes a typed representation. |
| GraphMARL | A modest research entry | “Project details coming soon.” |
| Supporting work | Compact evidence-led project rows | Breadth without competing with signature systems. |
| About/contact | Clear biography, CV, source and contact links | The person, qualifications and ways to connect. |

## Entry sequence

Target duration: approximately six seconds after the asset is ready. This is a design duration, not an inference benchmark. The brief contains both sweep orderings; use the final explicit requirement of a visible upward pass followed by a downward pass. Both cover the whole face.

| Time after readiness | Visual | Stage text |
|---|---|---|
| 0–0.35 s | Near-black field; controls already available | SYSTEM INITIALIZING |
| 0.35–1.0 s | Face resolves from a dim surface into contours | MTCNN · DETECTION STAGE |
| 1.0–2.5 s | Horizontal scan band moves from chin to forehead | FACE DETECTED · DEMO; illustrative contour/point annotations |
| 2.5–4.0 s | Band reverses, forehead to chin | LIVENESS · CHECK; FACENET · EMBEDDING STAGE |
| 4.0–4.7 s | Stable resolved mesh and restrained stage completion | MATCH · READY → VERIFICATION COMPLETE · DEMO |
| 4.7–5.5 s | Surface resolves into a bounded point dissolution | Transition only; no invented biometric values |
| 5.5–6.0 s | Face and points disappear; name and world reveal | Normal portfolio navigation |

Keep “DARVS architecture demo · no camera or model inference” visible and available to assistive technology. Never announce a skipped sequence as a successful verification. Do not show random confidence, FPS, latency, identity matches or a fictitious embedding vector.

The animation can stage an illustrative detection/liveness result, but it must not imply that the mesh is being processed by the Python models. Mesh vertices are not detected facial landmarks. Any landmark-style annotations on this subject are explicitly illustrative.

### Scan alignment

Normalize the face mesh once, compute its bounding box, and use a single scan-height value for the material band and line/annotations. Move that value between the mesh's local minimum and maximum Y. The material brightens a narrow band based on distance to that same local Y plane. Project the plane/face intersection into the overlay coordinate system for the horizontal line and callouts.

Keep the face upright and camera framing fixed during the sweep so the line remains horizontal and visibly crosses the subject. Recompute overlay projection on resize. Do not run an independent viewport-height CSS animation that can drift away from the face. Preserve adequate line thickness and contrast at phone sizes; bloom is optional and never a prerequisite for legibility.

### Exit and fallback behavior

Enter/Skip is a native control available before asset loading and during every stage. A route change, anchor navigation or deliberate scroll can also end the intro. Do not prevent wheel/touch/navigation keys. The essential page is server-rendered and readable when JavaScript or WebGL fails; animation is an enhancement.

Proposed session behavior: play once on a normal first home visit; subsequent visits show the world with an optional replay action. Storage failure must not obstruct entry. Direct `/about`, `/research`, `/darvs`, `/usmhacs`, `/usmhacs/full` and `/rangraph` bypass the intro. Reduced-motion visitors enter the world immediately and may choose a static explanation/replay option. Mobile visitors receive a simpler, well-framed scan or poster, never a desktop-mode instruction.

Slow or failed loading shows the poster and an immediate Enter action, with a short timeout that reveals the main page automatically. Context loss ends the cinematic gracefully. If a hidden tab resumes, use elapsed time to finish or resume coherently; never replay a backlog of animation events.

On completion or skip: cancel the timeline and frame loop, abort or invalidate pending asset callbacks, disconnect observers/listeners, dispose scene-owned geometry/materials/textures and renderer, remove the canvas, and unmount the face. Dispose only resources owned by that scene. The main world's renderer may mount afterward; no invisible face scene continues running. A user-activated skip can move focus to the home heading; automatic completion must not steal focus.

## Typography study

Proposed pair: **Anybody Variable** for identity and major project titles; **Recursive** for readable prose and technical instrumentation. Anybody offers a real width axis for condensed and extended proportions. Recursive offers proportional and monospaced styles within one family. These are concrete candidates to test against the handwritten images, not final selections. [Anybody source](https://github.com/Etcetera-Type-Co/Anybody), [published width/weight ranges](https://github.com/google/fonts/blob/main/ofl/anybody/METADATA.pb), [Recursive source](https://github.com/arrowtype/recursive).

| Role | Proposed treatment |
|---|---|
| Name | Anybody, weight around 650–750, width chosen per composition; two offset lines; solid neutral ink. |
| Project names | Condensed Anybody, strong size contrast, open space around the instrument. |
| Prose and controls | Recursive proportional, linear style, 16–18 px body, comfortable line height, roughly 60–70 characters per line. |
| States, records and units | Recursive Mono, tabular numerals, usually 13–15 px; align related measurements. |
| Spatial annotations | Short upright labels attached to relevant geometry; occasional vertical rail only where reading order stays clear. |

Use true font axes rather than `scaleX` distortion. Reserve variable-width motion for a brief identity transition or deliberate interaction; no constant breathing letters. Essential text remains HTML. Do not split words into inaccessible announcements or place the only name inside a canvas. Local font files, fallbacks and font-display behavior must be tested in the implementation.

## Palette study from the handwritten transcription

Proposed roles below come directly from the supplied anchors. The [complete 20-color study](docs/palette-study.json) retains every anchor, approximate OKLCH conversions and calculated contrast against the two proposed backgrounds.

| Role | Anchor | Contrast on `#08070B` | Contrast on `#131E4A` |
|---|---|---:|---:|
| Environment | `#08070B` | — | — |
| Technical depth/surface | `#131E4A` | 1.26:1 | — |
| Primary text | `#E8E0D2` | 15.33:1 | 12.21:1 |
| Secondary text | `#AFAEA2` | 8.99:1 | 7.16:1 |
| Primary signal/focus | `#00AEBD` | 7.45:1 | 5.94:1 |
| Hardware/material accent | `#B99D73` | 7.78:1 | 6.20:1 |
| Fault text/indicator | `#FF5A5F` | 6.58:1 | 5.24:1 |

Most visible area stays in environment and neutral ink. Cyan identifies selected or propagating signals; gold identifies hardware/material emphasis; red appears when an actual fault is present. Status always has a textual equivalent. Keep the other blues, violet and alternative reds in the study rather than assigning each project another color.

Contrast is calculated with WCAG relative luminance on opaque sRGB colors. Values are rounded for display, and are not rendered-page compliance results. Ordinary text needs at least 4.5:1; large text needs 3:1 under the standard's size/weight definition. Compositing and glow require fresh testing. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

The study reveals useful restrictions: pale text on cyan is only 2.06:1, so filled cyan buttons need dark text. `#255DCE` is 3.38:1 against the environment and cannot be ordinary small text there. Navy and near-black have only 1.26:1 contrast, so their boundary alone cannot identify a required control. Darkening an accent reduces its contrast against this dark environment; reserve dark variants for surfaces and test their foreground separately.

Explore the handwritten tint/tone/shade method explicitly. A reproducible sRGB study of cyan gives 20% white tint `#33BECA`, 40% gray tone `#339CA5`, and 65% black shade `#003D42`. These are study swatches, not extra semantic roles. In the eventual CSS token system, preserve the anchor colors with their measured OKLCH equivalents and document the mixing color space.

Use the approximately 137.5° hue rotation as a comparison study, not a rule that guarantees harmony or contrast. For example, cyan's OKLCH hue near 205.68° gives comparison directions near 343.18° and 68.18°. The latter is near the warm material family. Choose from the supplied anchors after comparing the actual image; do not add an automatic rainbow or claim a mathematical aesthetic optimum. Lower chroma for neutral instrumentation; retain luminance hierarchy.

## Layout, motion and interaction rules

Spacing candidates: 4, 8, 12, 16, 24, 32, 48, 72 and 104 px, applied by purpose rather than uniformly. Use larger gaps between instruments than between a control and its explanation. Compact corners suit controls; open diagrams and typography should carry composition instead of nested panels.

Fast control feedback is roughly 120–180 ms; inspector transitions 200–300 ms; major scene transitions 450–700 ms. The full intro is the exception with a defined narrative duration. These are tuning targets. Signal propagation occurs when an input/event changes, graph expansion explains a relationship, and a fault pulse ends once acknowledged. No indefinite camera orbit, scroll hijacking or random background activity.

Every interactive object has rest, hover, focus, active, disabled and error states where applicable. Touch uses tap/selection rather than hover-only discovery. Use a clear high-contrast focus ring and generous hit areas. Provide readable summaries and controls outside canvas. Reduced-motion states preserve the information without sweeps, dissolves or spatial travel.

Desktop may combine a large diagram with its inspector. Tablet moves inspection below or beside the selected region. Mobile presents a focused vertical flow with explicit inputs, outputs and failure state; diagram inspection is optional. Long records/code get contained scrolling without making the whole page overflow.

## Navigation and implementation boundaries

Primary navigation: Home, Systems, Research, About, Contact. Systems and Research can lead to home sections with direct project links; avoid a large menu. `/research` becomes a proper index, `/rangraph` gets its own instrument, and existing project URLs remain reachable. GraphMARL needs only its honest placeholder until source material arrives.

Proposed module boundaries: content and evidence records; entry controller; face renderer; portfolio layout; DARVS demonstration model; USMHACS model plus scheduler; RANGraph fixture transformations; accessible controls and inspectors. Presentation consumes model state; a shader or tween never decides whether a door opens or a graph is valid.

Keep Next/React/Tailwind as the existing foundation and Framer Motion for ordinary UI. Adapt the raw Three.js face into a lazy scene with a single runtime. R3F is an option for a later spatial project view if its declarative scene lifecycle helps; it is not required to rewrite the intro. GSAP is optional for choreography after a real need is demonstrated. The [reference review](docs/REFERENCE-REVIEW.md) records adoption decisions; no new UI library has been installed.

Before calling Phase 2 complete, review the handwritten images and produce desktop, small-laptop and mobile compositions showing the post-intro home and at least the DARVS/USMHACS instruments. A screenshot of the face alone cannot validate the main portfolio direction.
