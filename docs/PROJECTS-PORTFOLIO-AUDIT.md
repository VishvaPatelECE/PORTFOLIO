# Project presentation: portfolio audit

9 October 2026. Research and recommendations only. No application code or accepted design-system tokens changed in this audit.

## Conclusion

The projects need authored covers and a coherent viewing experience. The two recent attempts changed motion while retaining the same tall foil rectangle, circular emblem, generic icon and short tagline. That leaves the engineering itself invisible until a visitor follows a link. More elaborate transitions cannot provide the missing project identity.

Keep clickable project covers, the owner's dark/ivory/gold/cyan world, RANGraph → GraphMARL → DARVS → USMHACS order, and separate explanation/instrument routes. Replace the generic front faces with distinctive material from each project. Design and review one completed RANGraph cover before extending its composition or motion to the other projects.

## Evidence and limits

Compared the current `/demo/projects` against Dennis Snellenberg, Aristide Benoist, Niccolò Miranda, Rauno Freiberg, Dylan Brouwer and Bruno Simon. Their live pages were opened; representative browser screenshots, accessible content and primary public pages were inspected. Dennis's work route and Miranda's WOW Concept case study were entered. Opening some pages initially timed out but their rendered tabs subsequently became readable. Not every control or complete journey was operated. Some media previews reported playback unavailable; no portfolio's FPS or universal ranking was measured.

V3 was inspected in the browser and in `ProjectCards.tsx`, `createProjectCardMotion.ts`, `project-cards.css` and `lib/content/projects.ts`. At the owner's current embedded preview, a live read returned width 762, height 668 and no `data-project-motion` enhancement. The desktop controller requires width ≥900 and height ≥620, so this view uses the static card flow. Wider captures showed the alternating composition and the bright original cursor material. These observations do not establish which component causes the reported lag.

The demo's “Inside the work” introduction is demo-only. Its duplicate heading must not be attributed to the actual homepage. Earlier source-scope ship verdicts did not establish visual acceptance; the owner's rejection governs the next direction.

## Reference lessons

| Reference | Observed approach | Useful for V3 | Boundary |
| --- | --- | --- | --- |
| [Dennis Snellenberg](https://dennissnellenberg.com/work) | Clear project index, large names, selectable list/grid and project-specific images. | Make navigation immediate; titles and actual work should carry the hierarchy. | Borrow clarity, not his portrait, font, copy or exact page. |
| [Aristide Benoist](https://aristidebenoist.com/) | A restrained dark stage with a strip of distinct project imagery and little surrounding chrome. | Treat the gallery as one composition rather than a series of unrelated flying objects. | The rendered overview was inspected; complete gallery mechanics were not certified. |
| [Dylan Brouwer](https://www.dylanbrouwer.design/work) | A large lead project image followed by smaller paired covers; strong display typography. | Vary scale and density and give the cover meaningful content. | Some media remained loading. Do not claim every animation was observed. |
| [Rauno Freiberg's Craft](https://rauno.me/craft) | Specific interface experiments, with separate production, prototype and essay destinations. | Let an authentic project artifact explain why the item matters; make its evidence status clear. | Several video players were unavailable in this browser. |
| [Miranda](https://www.niccolomiranda.com/) | Paper material, distinctive typography and image-led projects continue into case studies. | Use one authored material language throughout, including the project-to-detail handoff. | Retain V3's identity. The attempted carousel drag entered WOW Concept; it does not certify drag behavior. |
| [Bruno Simon](https://bruno-simon.com/) | A rendered drivable world with documented controls, quality options and a behind-the-scenes explanation. | A signature interaction should express the creator's work and be memorable as a mechanism. | Entry and primary content were inspected; driving and performance were not tested. A game world would add substantial scope. |

These are selected craft benchmarks, not a verified ranking of the world's best portfolios. The recommendations below are design judgments drawn from the comparisons.

## Problems in the current gallery

1. Project fronts repeat the same visual recipe. Swapping the icon does not distinguish wireless representations, vision verification and hardware control.
2. Portrait proportions reserve much of each screen for an emblem. The actual evidence occupies none of that area.
3. Alternating narrow cards create large diagonal regions of empty space. A glimpse of the next card is not enough to turn that space into a deliberate sequence.
4. Cursor glow can compete with the small cover content. This is a visual observation; its contribution to lag needs a controlled profile.
5. The narrow-screen path loses the signature scroll motion altogether. A good composition should retain its identity at this width, with simpler movement where appropriate.

## Recommended direction: large engineering covers

Use large landscape project covers, with a project name and one factual sentence. The homepage remains a discovery surface; architecture, explanation, controls and simulator behavior remain on their existing routes.

| Project | Cover material to prepare | Truth requirement |
| --- | --- | --- |
| RANGraph | An authored view of the existing graph explorer or a cover derived from its golden fixture. | Real node/edge types and timestep data; no decorative relationships or invented results. |
| GraphMARL | A quieter research-status cover at its existing second position. | State that details are in progress; no fabricated system image or results. |
| DARVS | An authentic pipeline/challenge interface excerpt or deliberate cover from the existing demonstration. | Keep the intro head exclusive to entry. No camera or model-inference claim. |
| USMHACS | A composed excerpt from the copied V1 circuit/simulator. | Preserve its actual controls and logic; do not reintroduce the rejected decorative assembly object. |

The covers can share foil edge treatment, typography and lighting while differing in content and framing. Avoid dressing every artifact inside a generic monitor or repeating the same screenshot frame.

Motion should explain the transition: reveal the next cover as one intact surface, keep the title and action stable while it is read, and retain immediate project access. Test a brief edge reveal or shared cover expansion into the detail header. Those are proposed alternatives, not implemented or visually approved effects. Do not stack flipping, breakup, blur, overshoot and pointer rotation on the same object. Any pinned version needs a deliberately short, navigable sequence and a robust native-flow alternative.

At the 762px preview, use a full-width readable cover and small bounded movement rather than silently dropping the whole interaction. Mobile, keyboard, reduced motion and Pause must retain all content and actions. Robo Car and Hardware Stopwatch remain names only.

## Other viable structures

- **Project index with a persistent preview:** large project names on one side and an image preview on the other; selection updates the preview. This suits rapid browsing and limited assets, but risks hiding evidence behind hover unless keyboard and touch selection are first-class.
- **Compact stage with overlapping covers:** the next intact cover moves over the previous one; names or direct links remain available. This is closest to a theatrical gallery, but carries pinning/occlusion and responsive risk. It needs a one-project transfer prototype before adoption.
- **Large engineering covers in native flow — recommended:** strongest starting point for the current work, with enough space for evidence and less dependence on hidden interaction. Its quality will come primarily from the authored covers and rhythm.

## Next work

Prepare and review one complete RANGraph cover in desktop and the actual 762px preview. Compare it with the existing card while holding the background constant. Only after its composition is convincing, add one transition and test slow/fast/reverse scroll, keyboard, touch, Pause and reduced motion. Profile with and without the existing original cursor in a controlled test before attributing lag or changing it. Its package and prior colour-only constraint remain untouched during this audit; changing the integration is a separate proposed decision. Do not claim tint changes reduce rendering cost.

Keep the accepted Scan and avatar hero. The most valuable next investment is a convincing first project cover, followed by a measured transition and faithful project-to-detail continuity.
