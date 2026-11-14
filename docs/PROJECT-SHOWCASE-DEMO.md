# Project gallery and retained DARVS demo

9 October 2026, isolated RANGraph cover prototype. `/demo/projects` now presents a wide/compact source-derived SVG cover with native `/rangraph` access and sibling 1s/2s fixture controls. `runPipeline()` supplies the actual graph sequence: two association edges per snapshot, `ue-2` handover and unassociated `ue-3`. Artwork has bounded direct-scroll movement and mouse path morphing; no pin or card tilt. GraphMARL/DARVS/USMHACS and supporting names remain native links. The homepage now uses the owner-artwork native sliding deck; this original interactive RANGraph demo, Scan and avatar are preserved. Reviewer disposition is ship the isolated demo for owner review; acceptance is pending. See `RANGRAPH-COVER-DEMO.md` for source, browser evidence and limits.

The previous DARVS first chapter is retained at `/darvs/demo`, linked from `/darvs`. Its pipeline, stage rail, disclosures and illustrative Run example belong there. Gateway Flow remains removed. The following sections record that retained instrument; they do not describe the new isolated RANGraph cover.

## Visual and interaction

A large dark presentation plane contains the actual architecture sequence, Camera → MTCNN → liveness → FaceNet → decision. CSS perspective and small pointer rotations give the cover depth; native scroll brings it from a slight angle to a settled view. Titles, project access, stage selectors, example controls and disclosures remain outside the rotating plane. No intro face mesh, decorative assembly object, stock photography or fabricated performance metric is introduced.

The component uses the same source-reviewed descriptions as the full DARVS instrument, extracted into `lib/content/darvs.ts`. The existing instrument's content and behavior are retained. Selecting stages changes the highlighted process and explanation; Problem / Approach / Evidence disclosures reveal details. Open project retains the full `/darvs` destination.

The example model has a face-region input, three illustrative challenge responses and an identity-match input. Matching is gated until the challenge completes; losing a region clears subsequent conditions. Run example is a bounded 2.8-second presentation, not model inference timing. Selection, reset, unmount, pause, hiding and going offscreen cancel pending steps. Keyboard, reduced-motion and paused runs resolve immediately. Touch uses a vertical diagram in normal flow, with no decorative tilt. There is no camera access or ML execution.

Motion values and damped springs carry continuous pointer/scroll values without per-frame React state. Jakub's restrained production polish guides the tilt and settling; Jhey's expressive perspective informs the presentation plane. Native controls use immediate feedback. Shared Pause controls the decorative cover; preference/visibility gates stop decorative work. The Gateway Flow referenced by the first demo record was subsequently removed at the owner's request.

## Verification

Retained DARVS record: five model/scheduler checks cover matching gates, disappearing inputs, bounded responses, contradictory states and cancelled callbacks. Existing face, intro, V1 simulator and graph model checks remain applicable. Earlier browser-availability limits belong to those historical records.

Current isolated-demo checks: 26 model tests, typecheck/final build pass; lint has zero errors/two inherited V1 warnings. One detector pass reports 19 advisories/zero non-advisory findings. Production desktop (1280×720), 762px (762×668) and mobile (390×844) captures fit cover/action/controls with no horizontal overflow. Browser operation verified timestep target/status, keyboard Space, Pause/resume and native `/rangraph` navigation/Back. Home/demo/RANGraph return 200. TubesCursor hash/defaults remain unchanged. Review found no blocking visual/data/access/lifecycle issue and approved shipping this isolated demo for owner review.

Owner acceptance is pending. OS reduced motion was not toggled; complete slow/fast/reverse scroll, contrast, screen-reader behavior, FPS and Core Web Vitals remain uncertified. Inherited dev warnings showed no material failure. The current demo has fresh browser evidence; earlier CUA failures do not describe this verification pass.
