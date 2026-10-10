# Home project deck

9 October 2026. Shipped owner-led extension of the incumbent Holographic Signal Field identity. Main home now follows Scan/hero → What I explore → Selected work → Inside the work → existing footer. Scan, hero, avatar, instruments/models and original cursor runtime remain.

## Covers and routes

The native image-only deck uses the exact latest owner attachments, with image and project name on each link:

| Order | Project | Native destination |
|---|---|---|
| 1 | RANGraph | `/rangraph` |
| 2 | GraphMARL | `/graphmarl` |
| 3 | DARVS | `/darvs` |
| 4 | USMHACS | `/usmhacs` |

`lib/content/project-covers.ts` maps the four files in `public/projects/final/`. Decoded pixels match all four supplied attachments; origins are embedded and recorded in `provenance.jsonl`. The provenance scan found four rasters and zero missing origins. The same image appears on each project route through `ProjectCover`, visibly labelled Concept artwork. It is editorial illustration, not simulator output or hardware/measurement evidence. GraphMARL remains coming soon with the owner-provided SUMO mobility-generation fact and no fabricated results. Supporting projects remain name-only About links.

## Native interaction

Horizontal overflow and CSS scroll snap provide the deck, with a partial next-cover preview. Native previous/next and position buttons have 44px targets. Arrow/Home/End keys move focus; Enter follows the focused project link. Keyboard selection is immediate; eligible pointer buttons use native smooth scrolling. Pause/Resume, View all and an announced active position remain. Session storage restores the selected slide after project navigation/Back; storage failure leaves native access available.

There is no pin, fragment animation, GSAP gallery, captured wheel or autoplay. Vertical page navigation remains native. Visibility/hidden/reduced-motion/pause states suppress smoothing and image inspection; native horizontal access remains. View all exposes a two-column grid, one column on mobile. Fine-pointer inspection is a bounded image scale of 1.025.

Work/research/note anchors use the shared root `scroll-padding-top`: 100px desktop, 25px mobile. Local section/anchor/note margins are zero, avoiding doubled clearance. Direct measurements around 100px desktop and 25px mobile agree with that mechanism.

## Preserved prototype and evidence

`/demo/projects` remains the original interactive RANGraph SVG cover. Its source snapshot is `docs/prototypes/rangraph-cover-v1-2026-10-09.zip`, SHA256 `e1c4ebd684e163b81007dc48539e0e43bb697e6da8aaad2e840ed45ec8e77528`. Original TubesCursor SHA256 remains `676abd6ccd18742a36dcb4ffce66a2052a4f203f240cd8cf97c6ea33a181f81b`; runtime/defaults/bootstrap/bridge are unchanged.

Current sources are `ProjectCards.tsx`/`ProjectCards.module.css`, `PortfolioBridges`, `ProjectCover`, the cover map and four project pages. Palette/type tokens, DESIGN frontmatter and sidecar remain incumbent; unrelated historical drift is preserved.

`project-deck-verification.json` records 26 passing tests, passing typecheck/build, zero lint errors/two inherited V1 warnings and one empty detector result. Parent-operated browser checks covered Scan/morph/hero, controls, keyboard focus/Enter, View all, Pause/Back and direct Work/research/RANGraph-note anchors. Desktop 1280×800, narrow 762×668, mobile 390×844 and all-cover 1440×1200 captures are saved under `.impeccable/review/project-deck-*`.

Reviewer 9 returned ship with the single P2 duplicate-clearance finding resolved after the build/recaptures. Its approval is scoped to that correction; it is not a new general polish or independent rerun of parent browser/build checks. Physical touch, OS reduced motion, FPS/Core Web Vitals and complete screen-reader/contrast compliance remain uncertified.
