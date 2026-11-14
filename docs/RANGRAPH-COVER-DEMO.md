# RANGraph cover demo

9 October 2026. `/demo/projects` is an isolated cover prototype for owner review. The homepage retains its current four-card gallery; Scan, avatar, simulators and project routes are unchanged. Reviewer disposition: ship the isolated demo for review, with no blocking visual/data/access/lifecycle finding. Owner acceptance is pending.

## Source-backed cover

`app/demo/projects/page.tsx` runs `runPipeline()` on the server and passes its actual `GraphSequence` to `components/home/RangraphCoverDemo.tsx`. The golden fixture contains three UE, two gNB and snapshots at 1s/2s. Each displayed snapshot renders only its two computed association edges; `ue-3` remains unassociated. `ue-2` changes serving cell from `gnb-1` to `gnb-2`.

Wide and compact SVG layouts use schematic presentation coordinates. Station rings are glyphs, not coverage or distance measurements. The visible caption reads Golden fixture · Schematic layout; the live status identifies the current serving cell/timestep. GraphMARL, DARVS and USMHACS remain subsequent native links in the established order; GraphMARL retains its honest status. Supporting projects remain name-only links.

## Interaction and motion

The cover is a native `/rangraph` anchor. Separate sibling 1s/2s buttons have 44px targets and pressed states. Keyboard activation changes the graph immediately; eligible mouse activation morphs the association path over 0.42 seconds.

Direct scroll Motion values affect only artwork: up to 32px vertical travel and a 7% lower clip settle to rest. There is no pin or whole-card tilt. Visibility, hidden-tab, cover focus, Pause and reduced-motion gates remove decorative movement; the response remains enabled at 762px and mobile when eligible. Source and scoped CSS remain in `RangraphCoverDemo.tsx` and `RangraphCoverDemo.module.css`.

Original Kevin Levron TubesCursor 0.0.19, bootstrap/iframe/bridge and preexisting palette adaptation remain. Its 774,791-byte runtime SHA256 is `676abd6ccd18742a36dcb4ffce66a2052a4f203f240cd8cf97c6ea33a181f81b`. Original DPR, bloom, intensity 200, physics, idle motion and random-colours-on-click are retained, with CC BY-NC-SA 4.0/Three MIT attribution. No renderer performance tuning was introduced.

## Verified and pending

Production captures reviewed: `rangraph-cover-desktop.jpg` (1280×720), `rangraph-cover-762.jpg` (762×668) and `rangraph-cover-mobile.jpg` (390×844), under `.impeccable/review/`. All fit cover/action/controls without horizontal overflow. Browser checks verified mouse 1s→2s target/status, keyboard Space→1s, Pause disabling motion/removing the cursor iframe, resume, native `/rangraph` navigation and Back.

All 26 model tests, typecheck and final production build pass. Lint has zero errors/two inherited V1 warnings; one detector pass has 19 advisories and zero non-advisory findings. Home/demo/RANGraph HTTP probes return 200. Inherited dev Framer Motion root/static and Next smooth-scroll warnings showed no material failure; no global fix was made.

OS reduced motion was not toggled. Complete slow/fast/reverse-scroll playback, contrast, screen-reader behavior, FPS and Core Web Vitals are not certified. Reviewed screenshots and exercised controls support this isolated demo, while owner acceptance remains pending. Brand tokens, frontmatter and sidecars are preserved.
