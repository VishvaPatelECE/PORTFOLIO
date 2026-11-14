# Portfolio flow and project artwork

9 October 2026. Shipped narrow extension of the current portfolio. The accepted Scan/hero is followed by What I explore, the native image-only project deck, Inside the work and the existing footer. Brand identity, instruments/models and cursor defaults remain.

## Implemented extension

The owner-selected latest attachments now form the RANGraph → GraphMARL → DARVS → USMHACS covers. Each native homepage link contains the image and project name; details remain on its project route. The same image appears there labelled Concept artwork. `lib/content/project-covers.ts` and `public/projects/final/provenance.jsonl` map the originals; decoded pixels match all four attachments, embedded origins are retained and the provenance scan reports four/zero missing. Artwork is not simulation output or engineering evidence.

What I explore names source-backed Embedded systems, Computer vision and Wireless research. Inside the work links to existing RANGraph, DARVS and USMHACS technical notes, rather than invented articles. GraphMARL remains coming soon with the owner-provided SUMO mobility-generation fact. Supporting projects remain name-only links.

The deck uses native horizontal scrolling/snap with a partial next-cover preview, buttons, Arrow/Home/End focus, Enter navigation, Pause/Resume, View all and Back position restoration. It has no pin, fragments, GSAP gallery, wheel capture or autoplay. Root scroll padding supplies shared anchor clearance (100px desktop/25px mobile); local Work/research/engineering-note margins are zero.

The implementation record reports 26 tests, typecheck/build pass, zero lint errors/two inherited V1 warnings and one empty detector result. Real browser checks and desktop/narrow/mobile/all-cover captures are recorded in `.impeccable/review/project-deck-verification.json`. Reviewer 9 returned ship for the corrected single P2 duplicate-clearance finding; its scope excludes a new general polish or independent parent-check rerun. Touch hardware, OS reduced motion, FPS/Core Web Vitals and complete screen-reader/contrast compliance remain uncertified. See `PROJECT-CARDS.md` for the concise deck record; tokens/frontmatter/sidecar and unrelated historical drift are preserved.

Preserved source snapshot: [RANGraph cover v1](prototypes/rangraph-cover-v1-2026-10-09.zip), SHA256 `e1c4ebd684e163b81007dc48539e0e43bb697e6da8aaad2e840ed45ec8e77528`. `/demo/projects` retains that original interactive RANGraph cover. The ZIP requires V3's shared application; it includes the route, cover/CSS, graph model/golden trace, package versions, record and three production captures. Its manifest's 14 hashes were verified against archived entries. See [archive record](prototypes/README.md).

## Historical reference observations

The observations and proposal below preceded the shipped extension. They remain design research, not a current implementation queue; current owner artwork, source truth and the record above govern.

- [Samarth Patel](https://samarth-patel.dev/): live entry, main page, section content and project/certification stages were inspected. The observed sequence is identity, a typographic field of technical interests, Skills, About, Projects, Profiles, Certifications and Contact. The project stage has large authored imagery, a title, image previews and a position counter. Store It was viewed on the stage; scroll traversed the deck to its last item. Complete per-slide motion, every project navigation, mobile equivalence and performance were not certified. His interests, copy, credentials, images and code must not be copied or attributed to Vishva.
- [Astral Frontier](https://www.theastralfrontier.com/): Begin Journey, hero, Purpose, planet stage and selecting planet 2 were operated. Explore/Close planet changed the scene's interactive state. The same framed astronomical language, typography, fine linework and persistent navigation continue between the entry, purpose chapter and selector. The Purpose chapter supplies motivation before planet selection. This consistency and pacing are useful for V3; the space-fiction setting is specific to that site. Its quiz and complete detail journey were not operated; no FPS ranking was measured.

These are design observations, not a verified ranking of the world's best websites. Recommendations below are judgments based on those observations and the owner's latest request.

## Historical proposed sequence

**Scan → existing hero → What I explore → Selected work deck → Notes and experiments → Contact.**

- Keep the accepted Scan and hero. A direct Work destination still lets returning visitors reach projects immediately.
- Add one short visual interests chapter before the deck. Proposed, project-backed topics: Embedded systems, Computer vision, Wireless research. Use a strong typographic composition and a restrained continuation of the signal motif. Do not add an early technical glossary, proficiency percentages or unsupported personal hobbies.
- Make the deck one composed scene: wide artwork, project name, one dominant active cover and a visible glimpse of the next. Move intact images sideways with a small depth offset. Provide direct native project links, touch swipe, previous/next controls and keyboard access. Ordinary vertical page navigation must remain available; do not turn the four items into a long wheel trap or require animation to finish before opening one.
- Maintain RANGraph → GraphMARL → DARVS → USMHACS. GraphMARL's destination retains its explicit research-in-progress status. Supporting projects remain name-only links.
- Put the knowledge base after the deck, where interested viewers can read actual authored notes or experiments. No invented articles, empty content categories, tool-logo wall or copied friend biography. A minimal version can link to existing project explanations until original notes exist.
- Carry each selected cover into the corresponding project header. Preserve the title and image across navigation, then reveal problem, approach, architecture, demo and source. Back should restore the deck position. This is a proposed handoff, not an implemented transition.

The visual connection is a recurring signal contour: Scan trace, hero flow, a quiet trace through the interests typography, and edges within the project artwork. Keep typography, near-black surfaces, warm ivory, gold and cyan consistent. Each section should vary its composition within that identity. The original TubesCursor colour-only constraint remains binding; no renderer replacement or tuning is authorized here. Use still artwork and bounded CSS transforms for the proposed deck; the accepted entry remains the principal 3D moment.

## Image subjects

Generated covers are conceptual editorial illustrations, not evidence of built hardware, a scientific visualization or measured results. Their provenance belongs in source records and the project page, while the front retains only its HTML project name.

| Project | Subject for the shared prompt | Boundary |
| --- | --- | --- |
| RANGraph | Retain the owner's supplied mountain radio-network landscape, saved unchanged as `public/projects/rangraph-radio-landscape-v1.png`. | Artist's links and terrain are not computed topology or measured coverage. The preserved real graph is separate. |
| GraphMARL | Owner-selected Connected Highway at Twilight composition, colour-matched to the finalized project palette as `public/projects/graphmarl-sumo-mobility-v4.png`. The owner clarified that SUMO is used for mobility generation. | Conceptual mobility/communication illustration, not an actual SUMO capture, trained-policy output or verified result. See [v4 edit provenance](GRAPHMARL-MOBILITY-COVER-V4.md). Original and prior alternatives remain preserved; the project page retains its honest research status. |
| DARVS | Generated v2: camera observing an anonymous cropped facial reflection, with restrained contour marks and pose echo to suggest verification and liveness. | Conceptual reflection, not an actual input or model result. No entry GLB, freestanding head/bust or Vishva-avatar reuse. No inference or accuracy claim. |
| USMHACS | Owner refinement: an assembled wired hardware access-control module with a physical key, four binary-code switches, reset, buzzer and engaged solenoid-style door lock. Discrete logic appears as supporting detail. | Conceptual editorial render, not a built-prototype photograph or exact circuit. No MCU, software display, biometric reader, floating security icon or exploded processor. See [generated v2 and exact prompt](USMHACS-COVER-V2.md). |

## Reusable image-generation prompt

Use this same base once for each project, replacing SUBJECT with its table entry. For DARVS, use its [project-specific v2 prompt](PROJECT-COVER-ASSET-REVIEW.md). GraphMARL uses the owner's selected twilight highway composition with the [v4 palette edit](GRAPHMARL-MOBILITY-COVER-V4.md). For USMHACS, use its [v2 prompt](USMHACS-COVER-V2.md), which supersedes the earlier schematic-only direction. The target is one separate image per project, never a collage or a website screenshot.

```text
Create one standalone landscape project-cover artwork for Vishva Patel's engineering portfolio, VishvaProjects V3.

PROJECT: [project name, for context only]
SUBJECT: [insert the relevant subject and boundary from the table]

Produce a 16:9 image at 1920×1080 or higher. Art direction: cinematic engineering editorial, tactile dark materials, confident composition, crisp focal detail and controlled depth. Use near-black #08070B and dark blue-black #0C141B, warm ivory #E8E0D2, restrained champagne-gold #B99D73, and a small amount of cyan #00AEBD. Keep the same material treatment, light quality and colour grading across the four covers, while giving this subject its own silhouette and framing.

One clear focal composition, legible at thumbnail size, with clean peripheral space and a calm lower-left region for a project title to be added later in HTML. Keep the important subject within the central 65% so the image can crop on mobile. Let lighting reveal form; keep highlights controlled and blacks rich, without losing the subject.

This is conceptual artwork. Do not depict a dashboard, architecture diagram, infographic, performance result, verified product or fabricated build photograph. No text, letters, numbers, logos, captions, UI labels, buttons, title embedded in the artwork, generic laptop frame, floating exploded processor, human head, face, excessive neon glow, purple gradients, busy particles or ornamental grids. Follow the project-specific boundary. If a real schematic reference is supplied, preserve its actual topology and components rather than inventing replacements.

Return only one finished cover image, with no browser chrome, mockup frame or collage.
```

Before implementation, select the actual four covers together at large and thumbnail size. Then test one deck transfer at laptop, 762px preview and mobile, with keyboard, touch, Pause and reduced motion. Profile actual playback before claiming a lag improvement. This planning pass generates no images and changes no animation.
