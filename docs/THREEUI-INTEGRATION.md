# Reference implementation — 8 October 2026

The owner rejected the optical-workbench revision because it did not visibly use the supplied references. That feedback supersedes its finish verdict. This correction uses ThreeUI Community 1.2.0 directly and records precisely which elements are originals and which are adaptations.

| Supplied reference | Portfolio implementation | Relationship |
| --- | --- | --- |
| [Portal Field / Flow Field](https://threeui.com/backgrounds/portal-field/flow-field) | Personal hero particle trails | Actual PortalFieldCollection, flow-field variant |
| [Matrix Field](https://threeui.com/backgrounds/matrix-field/matrix-field) | USMHACS feature atmosphere | Actual LaserCollection, matrix-field variant |
| [Constellation Field](https://threeui.com/backgrounds/constellation-field/constellation-field) | RANGraph section atmosphere | Actual ConstellationField renderer |
| [Gateway Flow](https://threeui.com/backgrounds/constellation-field/gateway-flow) | DARVS feature environment | Actual ConstellationField, gateway-flow variant |
| [Star Portal / Ignition Button](https://threeui.com/buttons/star-portal/ignition-button) | Explore the work action | Exact official VS/FS; native link, labels, controls and lifecycle adapted |
| [Ashen One](https://threeui.com/hero/dark-souls-holo-card/ashen-one) | Personal holographic identity card with physical edge, diffraction foil, viewpoint and reverse | Original Three.js/GLSL study informed by the visible reference; not the Ashen One component |
| [Cortexa / Silhouette](https://threeui.com/backgrounds/cortexa/silhouette) | Temporary luminous face/scan intro | Earlier custom GLB interpretation; not a Pro component |
| [Sylva / Living Green](https://threeui.com/hero/sylva/living-green) | Layered material and contrasting physical light | Studied; moss world/template not installed |
| [MATTER](https://threeui.com/landing-pages/matter-landing-page) | Artifact-scale scene with readable HTML identity | Studied public preview; template not installed |
| [Elemental Flame](https://threeui.com/backgrounds/elements/elemental-flame) / [Water](https://threeui.com/backgrounds/elements/elemental-water) | Elemental contour lighting | Studied; fixed external brand marks are not placed in the portfolio |
| [Emberline Signal](https://threeui.com/motion-design/emberline-signal) | Temporal pacing and ambient field | Studied public preview; Pro motion template not installed |
| [Complete Shelf](https://threeui.com/hero/complete-shelf-landing-page) | Project selection and curated sequence | Studied; shelf template not installed |
| [Get Started](https://threeui.com/buttons/get-started-button) / [ThreeUI Intro](https://threeui.com/text-animation/article-headings/threeui-intro) / [UI catalog](https://threeui.com/ui-elements?sort=recent) | Native action, type and control quality | Studied; no fixed ThreeUI-brand wordmark or placeholder action is shipped |

Package: https://github.com/MengTo/threeui, MIT, copyright Meng To. The exact Ignition shaders were extracted from the npm package's `ignition-terminal.html.js`; `.design-tools/extract-ignition.mjs` reproduces the extraction. The four background frames are rendered from the official Community components by `.design-tools/build-threeui-fields.mjs` and shipped in `public/threeui`. Their actual effect scripts remain intact. Only unused page services (remote Tailwind, Iconify, Google fonts and analytics) are removed; the original GSAP runtime is served locally with its own license notice. `public/threeui/provenance.json` records original and shipping frame hashes. Original ThreeUI notice: `public/licenses/THREEUI-MIT.txt`. The app credits this explicitly.

Reference backgrounds are decorative, isolated official renderer frames. They mount only while their host intersects the viewport, the tab is visible, and the user allows motion. Reduced motion leaves the HTML and static project card intact. Pause, hiding and unmounting remove the renderer frame: some upstream variants use a truthy speed fallback, so a speed of zero does not reliably stop them. The hero field can warm up behind the skippable intro. The Ignition and card renderers implement local cleanup and bounded keyboard input. No camera, project inference or invented telemetry is added.

This is a code-led correction. There is no approved image comp, exact protected source, or award-rank claim. Browser checks and evidence are recorded in `docs/ACCEPTANCE.md`; the fresh independent review is in `.impeccable/review/finish-review-current.md`.
