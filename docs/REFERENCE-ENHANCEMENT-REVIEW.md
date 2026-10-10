# V3 reference research and enhancement direction

Reviewed 8 October 2026. This is a proposal, not an implementation change. It covers all 26 supplied links, including the 17 named effects. Directory and collection links were followed to relevant original sites or demos where accessible. External page instructions were treated as source material, not as authorization to install, copy, or publish anything.

## Evidence and limits

The review uses public page content, accessible original demo code, primary repository files, and V3's current source. Browser automation failed before opening a browser because its kernel assets could not be written. No reference animation was operated or visually benchmarked in this review. “Source inspected” below means HTML/CSS/JavaScript was read; it does not mean the effect was played.

The exact Behance project could not be retrieved, including a retry without tracking parameters. Its composition is unresolved. The original Flashlight and Particle Blob CodePens were also unavailable; their catalog entries and original demo URLs were located, but their implementations were not verified. A Gahan case page identifies itself as password protected; no unlocking was attempted and no detailed case-study conclusion relies on it.

## Recommended direction

Make V3 an interactive engineering gallery with a clear sequence: biometric entry, personal identity, three project chapters, the engineer, and contact. Preserve the near-black, warm ivory, cyan, and gold palette; Anybody and Recursive; the supplied face asset; the personal hero; and the V1 USMHACS simulator behavior.

Keep the entry sparse. Give the work below the hero larger, more varied compositions and real engineering evidence. Reveal deeper information when a visitor selects a chapter or opens a disclosure. Motion should connect these decisions and places.

V3 already has substantial graphical material: the face, holographic card, Flow Field, Gateway Flow, Matrix Field, Constellation Field, and Ignition button. Its home source currently presents DARVS, USMHACS, and RANGraph largely as text and action rows. Its public assets contain the head, renderer frames, fonts/licenses, and CV, with no dedicated project photograph or case-study cover collection. Those facts make the work presentation the largest opportunity.

## Site and collection references

| Supplied reference | What was inspected | Relevant observation | Proposed V3 use |
|---|---|---|---|
| [Behance Portfolio 2026](https://www.behance.net/gallery/245516287/Portfolio-2026) | Exact page attempted twice; unavailable | No reliable project-specific observation | Keep unresolved. Do not attribute a composition or type choice to this project. |
| [Ritik Singh directory](https://www.wallofportfolios.in/portfolios/ritik-singh/) → [actual portfolio](https://www.iritiksingh.in/) | Directory, original home content | Project headings communicate the problem; previews lead to deeper work. Personal background and methods support the work. | Give each project a memorable problem-led introduction, then an actual artifact and one action. Build About around real decisions and experiences. Do not borrow his results or credentials. |
| [Gahan N Rao directory](https://www.wallofportfolios.in/portfolios/gahan-n-rao/) → [actual portfolio](https://gahan.earth/) | Directory, home, public home interaction source | A sparse introduction accompanies a focused project carousel. Source distinguishes a center-card click from dragging and provides arrow/Enter navigation. | Study a focused, deliberate collection after the hero. Use large evidence and obvious links. An optional workbench gallery can be draggable; core projects remain directly reachable. |
| [Midu](https://midu.design/) | Original page, headings, public HTML and embedded shader URL | Large introductory type, a selected-project sequence, and a supporting ambient shader form a coherent presentation. | Give V3 clearer changes of scale: quiet entry, strong identity, large project evidence, compact supporting work, spacious contact. Preserve the existing type families. |
| [Astral Frontier](https://www.theastralfrontier.com/) | Original page content and public HTML | The page organizes exploration into worlds with entry, selected details, and ways to close those details. The HTML includes hero and planet canvases. | Treat each real project as a distinct chapter with a consistent way to enter, inspect, and return. Carry a common light/line motif between chapters. Its fictional planet content does not belong in the engineering portfolio. |
| [FlowRadar Three.js collection](https://www.flowradar.com/cloneable-categories/three-js) | Collection and [Motion Image Hover Effects](https://www.flowradar.com/cloneables/motion-image-hover-effects) detail | Relevant candidates include image hover, image transitions, and drag galleries. Much of the collection concerns ambient backgrounds. | Borrow a bounded hover-preview idea for project evidence. Keep the current field vocabulary. A Webflow cloneable is a reference, not a drop-in Next.js component. |
| [Uix Kit examples](https://uiux.cc/uix-kit/examples/index.html) | Index plus original 3D Gallery, 3D Liquid Scrollspy Slider, and SVG Mask Slider example markup | The catalog contains gallery, scrollspy, mask, and disclosure patterns. Selected pages load a broad bundle including older animation libraries. | Study selection and masking behavior. Implement a small compatible leaf component in V3 rather than loading the entire kit and its scripts. |
| [Codrops depth gallery](https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/) | Article, demo page, [original repository](https://github.com/houmahani/codrops-depth-gallery), README, Scroll, Gallery, and Background source | Depth-layered images, palette interpolation, and velocity-responsive movement are implemented as a coordinated scene. The source intercepts wheel/touch input for its standalone gallery. | Use the relationship between scroll, depth, and mood for the work showcase. Adapt it to ordinary document scrolling. Keep titles/actions in HTML and restrict motion to evidence layers. |
| [DevSnap Three.js examples](https://devsnap.me/three-js-examples) | Collection through its final listed entries; original Page Reveal source followed | Includes image transitions, particle morphing, raycasting, model loading, and many older experiments. A catalog's “free” label does not establish each asset's license. | Reference archive for one specific technique at a time. The page reveal is relevant to continuity; older loaders and runtime patterns need adaptation to V3's Three.js version. |

## All 17 named effects

The linked catalog entries establish which effect the owner supplied. The original creator link is included separately so an eventual implementation can inspect its actual source and terms.

| Effect / supplied link | Original source and inspection | Fit for V3 | Decision |
|---|---|---|---|
| [Neon 3D Tubes Cursor Trail](https://freefrontend.com/three-js/#2026-02-05-neon-3d-tubes-cursor-trail-l) | [Kevin Levron](https://codepen.io/soju22/pen/qEbdVjK); source inspected. External cursor component; click randomizes colors; source carries CC BY-NC-SA 4.0. | A short, controlled gold/cyan gesture could feel like a signal. A multicolor trail across the whole site would compete with reading and existing fields. | Optional experiment in one decorative area; original component not approved for reuse. |
| [Image Displacement](https://freefrontend.com/three-js/#2025-11-07-image-displacement-with-three-js-l) | [DenDionigi](https://codepen.io/DenDionigi/pen/YzOZxeR); source inspected. Two textures, a pointer-driven noise mask, and a shader blend. | Hover from a real circuit/evidence cover to a second view. Keep the image intact at rest and supply the same alternate view on tap. | Strong candidate after real cover assets exist. |
| [3D Cube Loop](https://freefrontend.com/three-js/#2025-10-13-3d-cube-loop-with-three-js-l) | [Quentin Hocdé](https://codepen.io/quentinhocde/pen/qEvvba); source inspected. Orthographic scene with shadows and a repeating legacy timeline. | Little connection to the owner's work. Would reintroduce the kind of abstract object decoration already removed. | Exclude from the main portfolio. |
| [Liquid Effect Background](https://freefrontend.com/three-js/#2025-10-08-liquid-effect-background-l) | [Kevin Levron](https://codepen.io/soju22/pen/myVWBGa); source inspected. External liquid component with material/displacement settings; source carries CC BY-NC-SA 4.0. | Study optical behavior for the existing foil or a single transition. A second full-screen ambient scene would duplicate existing visual work. | Material reference only for now. |
| [Live Clouds](https://freefrontend.com/three-js/#2025-09-27-live-clouds-with-three-js-l) | [DenDionigi](https://codepen.io/DenDionigi/pen/GRbGLgy); source inspected. Textured cloud geometry and fog. | The portfolio's signal/engineering language has no established cloud story. | Defer unless a future project makes atmospheric imagery relevant. |
| [Glowing Noise Cursor Effects](https://freefrontend.com/three-js/#2025-08-23-three-js-glowing-noise-cursor-effects-l) | [Filipz](https://codepen.io/filipz/pen/pvjjogQ); source inspected. Shader trails with postprocessing and device-dependent settings. | A restrained response to movement can enrich the identity area. Bloom and grain on every section would add considerable graphical work. | Alternative to tubes, never both. Prefer extending the current renderer. |
| [Metaballs Hero](https://freefrontend.com/three-js/#2025-08-22-metaballs-hero-section-with-threejs-l) | [Filipz](https://codepen.io/filipz/pen/ogjXgBP); source inspected. Pointer-responsive shader with appearance presets. | Useful study of merging and material continuity for Scan → hero. A new metaball hero would compete with the face and card. | Transition/material study; preserve current hero subject. |
| [Smooth Accordion with Parallax Images](https://freefrontend.com/page/3/#2026-01-01-smooth-accordion-with-parallax-images-l) | [Jhey](https://codepen.io/jh3y/pen/JoGpOGV); HTML, CSS, and interaction source inspected. Native details/summary synchronized with images. | Directly addresses excess information. Select “Problem”, “Approach”, or “Evidence” and show the corresponding technical artifact. | Highest-value component reference. Provide a plain disclosure fallback. |
| [3D Depth Parallax Pop-Out Cards](https://freefrontend.com/page/3/#2026-05-28-3d-depth-parallax-pop-out-cards-l) | [Mubanga](https://codepen.io/mubangadv/pen/YzJNbOa); source inspected. Separate depth layers and smoothed pointer tilt; the demo uses a fixed interval. | Improve material separation in the existing identity card, or one real hardware photograph. Avoid a row of identical tilted cards. | Selective refinement; adapt scheduling and coordinate handling. |
| [Bouncy Bear Theme Toggle](https://freefrontend.com/page/3/#2026-05-28-bouncy-bear-theme-toggle-switch-l) | [Jhey](https://codepen.io/jh3y/pen/LYgjpYZ); source inspected. A native pressed-state button changes animated SVG appearance. | The control state is useful; the bear and bouncing theme story do not fit this portfolio. | Keep the control lesson; omit the mascot and new theme scope. |
| [SVG Flashlight Reveal](https://freefrontend.com/page/4/#2026-05-07-svg-flashlight-reveal-effect-l) | [Isladjan](https://codepen.io/isladjan/pen/XWrYbNb); catalog inspected, original source unavailable. | A pointer reveals fine traces on a project cover or card surface. Important text remains readable without discovering the effect. | Good concept candidate, implementation unverified. |
| [Interactive 3D Flip Book Gallery](https://freefrontend.com/page/6/#2026-03-18-interactive-3d-flip-book-gallery-l) | [Daniel Muñoz](https://codepen.io/daniel-mu-oz/pen/RNRaXwZ); CSS and interaction source inspected. Double-sided pages turn around a spine. | Optional notebook for sketches/build photographs when enough authentic material exists. Direct CV access and project navigation stay simple. | Later workbench feature, not the main showcase. |
| [Staggered Particle Blob](https://freefrontend.com/page/7/#2026-03-03-staggered-particle-blob-effect-l) | [Julian Garnier](https://codepen.io/juliangarnier/pen/JojxjwB); catalog inspected, original source unavailable. Catalog identifies Anime.js. | Study staggered response for the entry's existing points. Avoid a separate DOM particle system and animation library for this alone. | Concept reference for morph sequencing; source unverified. |
| [Electric Border CSS Card](https://freefrontend.com/page/8/#2026-02-23-animated-electric-border-css-card-l) | [Balint Ferenczy](https://codepen.io/BalintFerenczy/pen/KwdoyEN); source inspected. SVG noise/displacement with indefinite animation. | Continuous border agitation would distract from simulator status. A brief custom accent may suit one deliberate action. | Exclude persistent electric borders; keep action feedback restrained. |
| [Scroll-Driven Sticky Text Reveal](https://freefrontend.com/page/8/#2026-02-22-scroll-driven-sticky-text-reveal-l) | [Jhey](https://codepen.io/jh3y/pen/EaavNVr); CSS inspected. View timelines progressively change the reading emphasis. | One short passage can connect the projects: observe the input, make the decision, test the failure. | Strong candidate; text stays readable and mobile uses normal flow. |
| [GSAP Staggered Blinds Reveal](https://freefrontend.com/page/8/#2026-02-11-gsap-staggered-blinds-reveal-l) | [Elegant Seagulls](https://codepen.io/elegantseagulls/pen/wvMgXxN); source inspected. Pinned, scrubbed staggered slats. | An appropriate hardware shutter/trace motif for one chapter boundary. Applying it to every section would create repeated waiting. | Optional one-time transition study; the face morph remains the entry signature. |
| [Draggable 3D Parallax Image Ring](https://freefrontend.com/page/9/#2026-01-27-draggable-3d-parallax-image-ring-l) | [Tom Miller](https://codepen.io/creativeocean/pen/PoWGpWj); source inspected. CSS 3D transforms, GSAP Draggable, and moving background positions. | A tactile secondary collection of authentic builds, schematics, and sketches. The prototype uses generic images. | Optional workbench alternative to flip book; select one collection mechanic. |

## Six concrete enhancements, in order

### 1. Finish the continuity of Scan → identity

This is refinement of the current entry, not an additional loader. During scanning, organize the visible points into a deliberate front-to-back or plane-based progression. At completion, carry the same gold/cyan light and direction into the existing flow ribbons and the card's first highlight. Reveal the personal name once. Avoid adding status rows or project names to the entry or hero.

The current code already morphs points into ribbons and opens a mask onto the prepared hero. The next task is to observe that sequence on the owner's laptop and tune its spatial continuity, pacing, and overlap. Source tests alone cannot establish whether it feels convincing. Metaball and particle references are studies for cohesive movement, not components to layer over the face.

### 2. Give the three main projects their own large compositions

Replace repeated text-row rhythm with one dominant technical artifact per chapter. For DARVS, use the real pipeline and its challenge/decision states. For USMHACS, use the copied V1 circuit/simulator view or actual Proteus/build material. For RANGraph, use the real fixture and its typed graph. Include project names here, below the hero.

Borrow Codrops' coordinated depth and mood principle, with restrained cyan/gold changes in the existing fields. Let the artifact approach and settle as the visitor scrolls. Keep a native title, one sentence, and one project link immediately usable. Do not restore the rejected decorative hardware assemblies.

Produce the covers from actual project material or accurately captured existing instruments. No project photographs were found in V3's public assets. The old repo has a USMHACS preview SVG, which is a potential source to assess, not proof of physical hardware. Never substitute attractive stock laboratory imagery for evidence of the owner's build.

### 3. Reveal technical detail on demand

Use the accordion pattern on the project pages: a compact summary, then Problem / Approach / Evidence disclosures coordinated with the artifact. A visitor can grasp the project without reading every implementation detail; an engineer can open the exact section they care about.

Preserve the V1 simulator controls and behavior. Place explanations around it, not inside a moving or distorted circuit. DARVS remains Camera → MTCNN → movement/eye liveness → FaceNet → Decision. RANGraph remains the source-backed fixture, not a decorative network. GraphMARL remains an honest placeholder.

### 4. Add a short typographic bridge

Use one scroll-emphasis passage between identity and work. Suggested original copy: “Observe the input. Make the decision. Test the failure.” It explains the common engineering mindset without adding a long manifesto. Keep all words legible at rest, highlight one phrase as it crosses the focal point, and release the page into the project chapters. No long scroll trap.

### 5. Add one consistent inspection response

Choose a surface-light/flashlight response or a subtle displacement reveal for actual project evidence. Use the same directional gold/cyan vocabulary as the face and card. Keep the pointer native. No randomized colors on click and no simultaneous tubes, noise trail, and blob following it.

Pointer effects belong on fine-pointer devices. Tap/focus opens the same alternate artifact or disclosure. Text, controls, source data, and circuit coordinates remain stable. Reuse an existing renderer where appropriate; adding another full-screen postprocessing canvas needs a clear benefit.

### 6. Make About and the ending more personal

Pair a concise story about one actual engineering decision with a real build photograph, sketch, or source artifact. The current About monogram can remain until genuine personal/build imagery is available. Project pages can end with a clear next-project link and an easy return to the work list, preserving position.

Give contact enough quiet space to feel like the end of the journey. Keep email, GitHub, LinkedIn, and CV immediate. Add a small copy-email interaction with clear completion feedback; avoid invented availability, testimonials, counters, or a contact form with no delivery system.

## Motion and delivery constraints for a future implementation

Use one dominant motion idea per visible area. Scanning and the completion morph may be expressive; navigation and simulator inputs should respond immediately. Decorative scenes stop when offscreen, paused, or hidden. Reduced-motion versions preserve content and controls; compact layouts use normal flow and selectable images instead of a forced spatial journey.

Retain V3's current Next.js/React/Three/Motion stack. The references do not justify importing all of Uix Kit, another Three runtime, or Anime.js solely for a stagger. Code copied from a creator requires verification of its license and included asset terms. The tubes and liquid demos explicitly declare non-commercial/share-alike terms; they are not automatically interchangeable with V3's MIT ThreeUI sources.

Suggested delivery order:

1. Observe and refine the current entry transition; prepare accurate project cover/evidence assets.
2. Build the large project chapter presentation and progressively disclosed case details.
3. Add the short text bridge and one shared hover/inspection response.
4. Refine About/contact, then consider a secondary ring OR flip book only if there is enough real material.

Before calling the result finished: play the full Scan → hero sequence, refresh it, navigate directly to projects, test chapter return position, inspect keyboard/touch behavior, verify reduced motion, and profile a small laptop. The original V1 and research repositories remain read-only. This review changed no application source, dependencies, or running-server settings.
