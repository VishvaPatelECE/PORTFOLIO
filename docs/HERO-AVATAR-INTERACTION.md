# Avatar alignment, inward gaze and method reveal

9 October 2026. Owner-requested completion of the standalone avatar hero direction.

- Desktop identity and avatar columns align from the same top edge. The portrait wrapper compensates for the selected PNG's transparent top margin; mobile retains the stacked composition.
- The first selected avatar is mirrored in presentation to face the name. The source PNG is unchanged.
- Fine-pointer input produces at most 6px horizontal / 4px vertical translation, with a damped spring and restrained local light response. There is no continuous avatar animation. The response stops and resets for entry, pause, reduced motion, hidden/offscreen state, and the method reveal.
- Double-clicking the avatar opens the former card's DESIGN → BUILD → TEST → REFINE → SHIP content. A native How I build control supports keyboard/touch and returns to the portrait. The method is a hidden-by-default, labelled HTML disclosure, without a card frame or modal. Keyboard disclosure changes are immediate; the active focus remains on the native control.
- Explore the work is the primary hero navigation action. About remains in the main navigation. Flow Field is reduced to 72% opacity behind the hero content.

Implementation is isolated in `components/home/AvatarScene.tsx`; labels reuse `lib/content/identity.ts`. The scan's curved shader band, morph/aperture handoff and face disposal remain intact.

Verification: all 19 existing tests, TypeScript checks and the production build pass. Lint has zero errors and the same two inherited V1 audio-hook warnings. The production server is restarted on port 3003. Served HTML confirms the avatar, collapsed native control, real target ID and initially hidden method; served CSS includes the inward mirror. Browser automation still fails before initialization, so fresh visual alignment, pointer/touch/keyboard playback and responsive screenshots remain unverified. Automated checks do not certify pixel-level alignment or animation feel.
