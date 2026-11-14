# Reference review and selection

Implementation update, 8 October 2026: the owner clarified **Animmaster Lib**, https://animmasterlib.dev/. It informed interaction timing and feedback; no additional animation dependency was needed. The historical proposals below were resolved using the execution brief, raw Three.js, Framer Motion and CSS.

7 October 2026. Design research only; no reference component has been copied or installed. Decisions are specific to the V3 brief. Public descriptions and documentation do not establish runtime quality on this portfolio.

## ThreeUI

All sixteen supplied reference descriptions were reviewed during the first audit. Cortexa's public preview was partially visible behind a Pro overlay; protected source was not accessed. The other effects were assessed from their public descriptions, not exhaustively operated or benchmarked. The following are proposed principles to explore, not claims about inspected private code.

| Reference | Relevant principle | V3 decision |
|---|---|---|
| [Cortexa silhouette](https://threeui.com/backgrounds/cortexa/silhouette) | A subject revealed through contours and samples | Primary visual study for the temporary face scan. |
| [MATTER](https://threeui.com/landing-pages/matter-landing-page) | Typography, object scale and negative space | Study for the post-intro home composition; keep identity in HTML. |
| [Emberline Signal](https://threeui.com/motion-design/emberline-signal) | Deliberate signal and isolated emphasis | One transition motif tied to a real state change. |
| [Constellation Field](https://threeui.com/backgrounds/constellation-field/constellation-field), [Gateway Flow](https://threeui.com/backgrounds/constellation-field/gateway-flow) | Relationships and staged connection | Stable, inspectable RANGraph nodes with source-backed edges. |
| [Matrix Field](https://threeui.com/backgrounds/matrix-field/matrix-field) | Signal organization | Study circuit/path emphasis; pointer movement must not change apparent logic. |
| [Portal Flow Field](https://threeui.com/backgrounds/portal-field/flow-field) | Continuous directional motion | Consider only for the brief face-to-world transition. |
| [Ashen One](https://threeui.com/hero/dark-souls-holo-card/ashen-one), [Sylva](https://threeui.com/hero/sylva/living-green) | Material consistency and depth | Study cohesion; omit unrelated fantasy and botanical imagery. |
| [Elemental Flame](https://threeui.com/backgrounds/elements/elemental-flame), [Elemental Water](https://threeui.com/backgrounds/elements/elemental-water) | Physical-looking motion | Reference study; no engineering use has yet justified an effect in V3. |
| [Complete Shelf](https://threeui.com/hero/complete-shelf-landing-page) | A spatial collection | Consider later when real hardware objects/photos exist. |
| [Ignition button](https://threeui.com/buttons/star-portal/ignition-button), [Get Started button](https://threeui.com/buttons/get-started-button) | Strong action feedback | One tactile Enter/Run control; ordinary links remain immediate and readable. |
| [Article intro text](https://threeui.com/text-animation/article-headings/threeui-intro) | Controlled type reveal | Brief identity reveal; never repeatedly hide reading content. |
| [UI elements](https://threeui.com/ui-elements?sort=recent) | Small interaction vocabulary | Select by function after the instrument design is fixed. |

## Libraries and design practices

| Reference | Verified scope | Proposed use |
|---|---|---|
| [TasteSkill](https://www.tasteskill.dev/) | A design workflow/skill collection, not a shipped UI runtime | Apply audit-first design, varied composition and deliberate typography; user references remain authoritative. |
| [GSAP](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) | Timeline/motion tooling; matchMedia contexts support responsive setup and cleanup | Optional for intro orchestration. Do not add a second owner to properties already controlled by Framer Motion or the renderer. |
| [21st.dev registry](https://github.com/21st-dev/registry) | Component distribution/registry tooling | Reference for a specific control only; inspect source, dependencies and license before adoption. Not a reason to install a whole visual system. |
| [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) | React renderer for Three.js; React and Fiber major versions must be compatible | Optional for later spatial instruments; choose a compatible stable release if adopted. Keep one Three runtime. |
| [R3F performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) | Demand-based rendering and explicit invalidation | Apply the underlying principle: idle diagrams should not require a permanent render loop. |
| [liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | WebGL refraction/glass demonstration using background capture | Defer. A magnification or optical-inspection use could justify it later; navigation and project panels do not need it. Several projects share similar names, so this is a candidate interpretation of the handwritten name. |
| [ShaderGradient](https://github.com/ruucm/shadergradient/blob/main/README.md) | Configurable animated 3D gradient renderer with React/Three peer dependencies | Defer. A gradient scene does not currently explain an engineering operation. |
| [Liquido](https://github.com/renancaraujo/liquido) | The identifiable project is an experimental Flutter/Impeller glass demonstrator | Visual study only; not a React dependency. Confirm the handwritten reference points to this project before treating it as the intended library. |
| Animaster | A unique intended frontend library could not be identified from the supplied name | Keep unresolved; do not silently substitute Anime.js, Animata or an unrelated animation product. The original image or exact URL can resolve it. |
| [SkiperUI](https://skiper-ui.com/docs/quick-start) | Copyable React components; free and Pro sources; dependencies vary | Study control feedback and transitions. Use original V3 composition, and preserve required attribution if free source is later adopted. |
| [VengeanceUI](https://www.vengenceui.com/components) | Animated React component catalog, including model/particle/text examples | Study bounded dissolution and inspection affordances. Do not import an entire carousel/text-effects vocabulary. |

The decisions above deliberately select ideas rather than aggregate packages. An attractive effect earns inclusion by making a process, state or relationship clearer and surviving mobile, keyboard, reduced-motion and performance checks.

## Related skill references

[Anthropic's skills repository](https://github.com/anthropics/skills), [Vercel's agent-skills collection](https://github.com/vercel-labs/agent-skills), and [Superpowers](https://github.com/obra/superpowers) provide development instructions/workflows rather than visitor-facing UI dependencies. Treat the broad “web-quality skills” note as a request for quality practices unless the original image identifies a specific package. No additional skill collection was installed for this audit.

The installed Taste and motion-design skills informed the earlier audit. Impeccable informed this source review. At the user's explicit request, the Impeccable updater upgraded the user-level installations from v3.8.0 to v4.5.0; its updater states that the new guidance takes effect next session. It also reported user-level engine and hook updates. No portfolio dependency changed.

Emil Kowalski's public UI page could not be retrieved in the current web attempt. The installed motion-design references already supplied guidance on interruption, timing and meaningful state feedback. Do not claim a fresh visual review of that unavailable page.

## Open reference questions

The actual two handwritten images remain necessary for visual priority, typography cues and precise ambiguous library names. The palette transcription is preserved in the color study. Protected ThreeUI or paid component source has not been acquired; V3 can create original effects based on the studied interaction principles.
