# Design implementation record

Latest focused entry: status/bar/stage clutter removed; enlarged face with bounded pointer/drag/keyboard interaction; condensed uppercase heading, requested subtitle and corner overview link. The actual GLB point positions morph into gold/cyan ribbons while a luminance aperture reveals the prepared hero, replacing the earlier dissolve-and-text-rise handoff. Global color/type primitives remain intact. Current implementation and verification are in docs/ENTRY-MOTION.md; prior extraction below is historical where it describes the earlier entry.

Current owner refinement: the hero is personal identity only, USMHACS uses the copied/recolored V1 component, and full home refresh waits for a visitor-triggered Scan. The GLB is brighter in standby and sweeping; compact/preference/failure paths expose alternate entry. Hero foil and background do not render during entry. Global palette/type primitives are preserved, while DESIGN.md and its sidecar narrative record the changed usage. `docs/V1-DETAILS.md` and its provenance record contain current source checks. Earlier extraction and screenshot claims below are historical; fresh browser/GPU acceptance is unavailable and no earlier verdict certifies this changed entry or simulator.

Recorded 8 October 2026 from the current V3 source. This pass replaces the rejected optical-workbench record with the implemented reference-field and holographic-card system. DESIGN.md contains normative YAML primitives; .impeccable/design.json contains extension metadata and self-contained DOM previews. PRODUCT.md, application code and assets were outside this pass's write boundary.

Source evidence: app/globals.css → app/laboratory.css → app/signal.css (import order), app/layout.tsx, app/page.tsx, app/credits/page.tsx, components/home/{HomeMotion,LaboratoryHero,ReferenceField,HoloCard,IgnitionLink,ProjectAssembly,ArchitectureOverview}.tsx, entry components, three/holo/createHoloCard.ts, three/ignition/shaders.ts, three/assembly/createAssembly.ts, three/face/createFace.ts and lib/models/intro.ts. The surface contract is .impeccable/surface-briefs/home.md; the complete reference map is docs/THREEUI-INTEGRATION.md.

The build is code-led. The owner's pinned references supersede the earlier seed (563e92c5/index 7) and rejection supersedes the earlier workbench verdict. There is no approved image comp, catalog quality-bar authority or award-rank claim. The fresh finish reviewer requested three bounded material fixes. The application correction batch is complete; recapture and a verdict scoring those three fixes follow separately. That verdict will not certify the whole surface.

## Reference implementation and provenance

| Element | Source relationship | Implementation |
| --- | --- | --- |
| Flow Field | Actual ThreeUI Community renderer | DARVS home atmosphere; official PortalFieldCollection flow variant |
| Matrix Field | Actual ThreeUI Community renderer | USMHACS home and feature atmosphere; official LaserCollection matrix variant |
| Constellation Field | Actual ThreeUI Community renderer | RANGraph home and research atmosphere |
| Gateway Flow | Actual ThreeUI Community renderer | DARVS feature atmosphere; official constellation gateway variant |
| Ignition action | Exact original vertex/fragment shader pair | Native link, HTML labels, controls and lifecycle adapted locally |
| Holographic card | Custom GLSL/PBR study informed by Ashen One | Original foil, material, geometry, content and inspection controls |
| Face intro | Custom Cortexa interpretation | Supplied illustrative head with custom scan/contour/dissolution; temporary entry only |

ThreeUI Community package: @designcodeio/threeui 1.2.0, copyright Meng To, MIT. The four official components are baked by .design-tools/build-threeui-fields.mjs into public/threeui/{kind}.html. Their actual effect scripts remain intact; only unused remote Tailwind, Iconify, Google-font and analytics services are removed. GSAP 3.12.2 and ScrollTrigger are served locally; their original notice is public/licenses/GSAP-NOTICE.txt.

public/threeui/provenance.json records original-frame and shipping-frame SHA-256 hashes and changes for all four frames. .design-tools/extract-ignition.mjs extracts the exact VS/FS from ignition-terminal.html.js into three/ignition/shaders.ts. The ThreeUI MIT notice is public/licenses/THREEUI-MIT.txt. The app's colophon credits this direct use.

No protected Pro source, Dark Souls asset or fixed external brand mark is copied. Sylva, MATTER, Elemental Flame/Water, Emberline Signal, Complete Shelf and the broader UI catalog remain studied references as mapped in docs/THREEUI-INTEGRATION.md; they are not installed templates.

## Material evidence

The home card uses these observed parameters:

| Material | Color | Parameters |
| --- | --- | --- |
| Reflective card body | 0x111719 | metalness 0.95, roughness 0.19, clearcoat 1, iridescence 1, iridescence IOR 1.35, thickness range 200–500 |
| Gold physical edge | 0xc6a565 | metalness 1, roughness 0.23 |
| Reverse print material | 0x8ea3a6 | metalness 0.4, roughness 0.38, clearcoat 1 |
| Front foil | Custom ShaderMaterial | gold/cyan diffraction bands, fine foil lines, sparkle and viewpoint-sensitive light sweep |

The card body uses RoundedBoxGeometry (3.5 × 4.5 × 0.12 scene units). Front and reverse printing are generated CanvasTextures, not shipping raster assets. RoomEnvironment reflections, an ambient light (0xc8dadd, intensity 1.2), warm key (0xffd6a0, 4), cyan rim (0x68e5f2, 4), ACES filmic mapping and exposure 1.25 form the lighting. RANGraph card labels and relationships use runPipeline().sequence.graphs[0]; coordinates are schematic.

The legacy project assembly source retains its authored PBR system, but the owner removed its home panels. It is no longer imported by the home page:

| Material | Color | Parameters |
| --- | --- | --- |
| Machined alloy | 0x8e9b9c | metalness 1, roughness 0.24, clearcoat 1, clearcoat roughness 0.15 |
| Gold contacts | 0xb99d73 | metalness 0.92, roughness 0.26 |
| Dark coating | 0x091018 | metalness 0.45, roughness 0.32, clearcoat 1 |
| Optical glass | 0x7be7e6 | roughness 0.05, transmission 0.75, thickness 0.65, opacity 0.8, IOR 1.45, iridescence 1 |
| Routed signal | 0x36d8e1 | emissive 0x0aafb9, intensity 2.1, metalness 0.35, roughness 0.24 |

The card and legacy assembly pixel ratios cap at 1.25 below 768px and 1.6 otherwise. Ignition caps at 1.5. The lower home no longer mounts assembly objects or the RANGraph preview panel. Its official fields remain behind project titles, descriptions and working links; the hero card and project instruments retain their roles.

## Behavior and availability

Decorative frames are sandboxed with allow-scripts, inert, aria-hidden and removed from the tab order. HomeMotionProvider wraps the home main and supplies shared paused state. Every ReferenceField consumes it, including project/research fields mounted later, so Pause/Resume controls the home-wide atmospheric renderers. ReferenceField mounts frames only when enabled, intersecting, tab-visible, motion-permitted and locally/shared unpaused. Pause, static mode, hidden tabs, offscreen hosts and reduced motion unmount the affected frame. Some upstream variants use a truthy speed fallback: zero speed is not documented as a universal pause.

The card and Ignition renderers use local visibility and preference handling. Card keyboard yaw is clamped to -0.5…0.5 and pitch to -0.28…0.28; Home/reset recenters, Reverse exposes its system sequence, and touch keeps native scroll. Automatic foil movement and pointer response stop under reduced motion while keyboard inspection can update a single frame. The card canvas's tabindex and ARIA availability follow successful initialization; failure or static mode uses a meaningful system-specific overview. Reverse/reset remain card-dependent; Pause/Resume sits outside the ready condition, stays available in static/failure mode and is disabled only by reduced motion. The card and native Ignition action receive shared paused state. The focus ring is cyan.

The mobile fallback now grows with its content: the host has height auto, min-height 250px and padding 15px 5px 60px. The overview is relative with inset auto; its figure is width 100% with no minimum content height. Ordered rows have zero gap, 4px vertical padding and line-height 1.45; the title and caption use 8px separation. Graph height caps at 150px and graph text is 18px. This replaces the former constrained content region.

Reverse texture labels use Recursive 500 at 88px. Five source-backed rows begin at y=405, spaced 157px, with labels at x=185. Sequence numbers are Recursive 400 at 32px in gold at x=95; separator lines run from x=205 to x=910 at y+34. The printing uses the same model.stages values, and HoloCard's reverse ARIA label announces the project plus those actual stages. Material colors, original shaders and shipping rasters did not change.

The native project action, selectable identity and system dock persist independently of renderer success. Stage inspection remains in /darvs, /usmhacs and /rangraph. GraphMARL is a placeholder; no invented measurements or relationships are introduced.

The face portal temporarily makes covered body children inert, restores prior state and unmounts before the home card. The hero field may warm up behind the intro. The illustrative face is custom demonstration material, never a persistent home ornament, a visitor scan or model inference.

## Artifact and verification boundaries

The sole shipping raster is public/face/head-poster.png, supplied in portfolio-v2-face-code.zip as an illustrative Lee Perry-Smith poster. public/face/HEAD-LICENSE.txt records CC BY 3.0 attribution and sources. The parent task embedded the sourced ORIGIN without changing pixels. The final read-only check reported SCAN: 1 raster, 0 missing. JPEG browser captures in .impeccable/review are QA evidence, not shipping product rasters. Native viewport captures are authoritative for the iframe effects: the full-page browser API changes viewport/compositing and can omit their image. The normal holographic phone hero fits the 390 × 844 viewport. Fresh native static captures of all three systems verify content containment above the controls and the full system dock.

This pass checks token/source fidelity, canonical section order, frontmatter references, sidecar structure, narrative parity, renderer provenance hashes and the three-file write boundary. Sidecar tonal ramps are synthesized OKLCH previews, not new approved application colors. DOM previews expand CSS and inline icons; the Ignition preview shows the accessible metal shell and static well, not a replay of its GLSL.

The parent task reports post-batch production build including TypeScript, lint and all 11 model tests passed, with HTTP 200 on the running preview. Native browser checks verified the three static diagrams, enlarged desktop/mobile reverse, zero reference frames at paused systems/research anchors, and resumed Gateway/Matrix/Constellation mounting. Its 35-file original-source baseline has zero changes. Current browser acceptance is in docs/ACCEPTANCE.md. The final reviewer disposition is ship: all three requested fixes resolved, at that bounded scope. This documentation pass does not certify independent GPU coverage, physical-device preference emulation, whole-surface approval, exact paid-reference parity or award ranking.

Pre-existing unused optical-workbench home selectors, fallback-lens/ic-visual styles, --chrome and --signal-soft remain implementation drift. They are excluded from the normative system. This authorized documentation replacement does not repair application drift. The original C:/Users/HP/darvs-portfolio remains read-only; the parent task reports its 35-file baseline unchanged.
