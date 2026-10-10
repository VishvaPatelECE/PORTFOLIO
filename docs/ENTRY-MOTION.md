# Focused face entry — 8 October 2026

The owner supplied current entry screenshots and requested less information, a larger movable face, DARVS System Overview in a corner, new Scan to enter typography, Authenticate your identity beneath it, and a continuous entry-to-hero morph.

The visible status sentence, progress bar, four stage labels, chamber captions and demo footer are removed. Assistive technology retains concise process status and an explanation that this is a visual demonstration. Real failure/reduced-motion messages remain available only when relevant. The heading is condensed uppercase Anybody Variable, weight 540, width axis 82 and a 38–66px responsive size; the subtitle uses warm text. DARVS System Overview appears in the corner.

The supplied ZIP's FaceScene pointer/keyboard treatment informed the new input. The same GLB remains unchanged. Its geometry is centered on the chin/forehead region instead of the full bust; the canvas fills the viewport, with an orthographic half-height floor of 2.3 and a measured face-width fit for portrait screens. A lower center keeps the face away from the heading. Pixel ratio caps at 1.5 desktop / 1.25 mobile.

Pointer follow and drag rotate the actual subject group. Shift-drag and Shift-arrow keys pan it; arrows inspect yaw/pitch directly; Home or double-click resets. Yaw, pitch and translation have explicit bounds. Hover movement settles and stops rendering in standby; keyboard changes are immediate. Native vertical touch scrolling is preserved. Pointer, capture, keyboard, observer and visibility listeners are removed on disposal.

After the actual up/down scan, the face's existing point positions morph into seven gold/cyan flow ribbons on the GPU. Quintic easing preserves positional continuity. The transparent surface stops writing depth as the morph starts, so an invisible face cannot occlude the ribbons. A luminance SVG aperture opens the veil while those points fade into the matching hero atmosphere. The hero prepares during this bounded final overlap; its former extra text-rise animation is removed. At 6.9 seconds the face disposes and entry releases focus/inert/overflow state. No face remains on the hero.

Morph starts at 4.9 seconds; aperture begins at 5.35 seconds, after the hero has preparation time. Morph and aperture finish before the controller disposes. Failed loading, lost rendering or a live reduced-motion preference reset the veil and restore immediate Enter/Skip controls. Compact-screen Skip still exits directly.

Motion weighting: Jakub for controlled response and interruption, Jhey for the authored optical handoff. No dependencies or shipping rasters were added. The animation is a portfolio focal moment, not a repeated navigation treatment.

Verification: 19 meaningful tests pass, including repeated input bounds, independent pan/rotation, reset, scan standby and monotonic morph/aperture sequencing. Typecheck/build pass. Lint has no errors and retains two unrelated V1 audio-hook warnings. The V1 source/port hashes and all 35 original files still match. The browser tool continues to fail before initialization; live SVG compositing, shader playback, pointer/touch behavior, timing quality, screenshots and physical-device performance remain unverified. The owner's supplied screenshots establish the incumbent state; earlier finish verdicts do not certify this revision.

## Owner refinement — 9 October 2026

Removed the separate straight Three.js line that extended beyond the face. The existing mesh/point shader scan band remains and follows the subject's silhouette. The DARVS System Overview corner label is now uppercase, noninteractive text; its link, arrow and hover styling are removed. No avatar or hero changes are included in this refinement; an owner likeness requires a supplied photo.

Verification for this refinement: all 19 existing tests, typecheck and production build pass. Lint has zero errors and the same two inherited V1 audio-hook warnings. The production preview was restarted on port 3003. Browser initialization still fails before opening a page, so fresh GPU playback and responsive screenshot checks remain unverified.

## Curved scan and first-avatar trial — 9 October 2026

The owner clarified that the face glow must arc like the first screenshot, even at a neutral viewing angle. The mesh and point shaders now share a subject-space curved scan coordinate: the sides rise relative to the center by up to nine percent of the chin-to-forehead range. The processed surface uses the same coordinate, so the sweep and its trail agree. The band is still emitted only on the face geometry; the removed external straight line stays absent. Existing face inspection, deliberate entry, bidirectional timing and morph/disposal behavior remain.

The hero now reveals the first generated avatar selected by the owner, rather than a card. This is the original `exec-6d4b4a21-3c92-486a-9f34-67cd587bfd78.png`, copied unchanged to `public/avatar/vishva-avatar-first.png`. The second, more cartoon-like candidate is not used. The static portrait is prepared in the underlying hero during entry, keeping the existing aperture and flow handoff. Unrelated card controls are removed; home-wide Pause/Resume and Replay Entry remain.

Verification for the curved-scan/avatar trial: all 19 existing tests, typecheck and production build pass. Lint has zero errors and the two inherited V1 audio-hook warnings. The production preview is restarted on port 3003. Browser initialization still fails before opening a page; fresh shader compilation/playback, responsive geometry and final visual quality remain unverified by browser acceptance.
