# V1 details carried into V3 — 8 October 2026

The owner requested the live V1 USMHACS simulator with V3 colors, a hero without project names, and a more deliberate Scan entry. The original source repository remains read-only.

The local V1 commit and current remote HEAD both equal `1011122d185156c7542894747e9ce32a60156e4c`. The live `/usmhacs` response contains the hardware diagram and console; its `0v4_hbqewtiwz.js` chunk includes the same 1040×560 diagram, scenario messages, delay log and alarm frequency. This verifies the source/production relationship; it does not claim byte equality between TypeScript and compiled JavaScript.

## Simulator

`components/usmhacs/USMHACSPanel.tsx` is copied from V1, rather than reconstructed. Palette substitutions map success to cyan, warnings/key/reset to gold, faults to coral, and surfaces/text to V3's near-black/warm palette. Coordinates, labels, reducer, handler bodies, timing, Perfect Entry/Brute Force/Env Breach, sound toggle, repeating alarm, success chime, Protected Reset feedback and timestamped console are retained. The native V1 button skin is scoped locally and recolored. A narrow toolbar wrap and heading rule keep the original diagram usable inside V3's shell; the board keeps its horizontal scroll on narrow screens.

The integration adds a root CSS class and named state/reducer exports for testing. `V1-USMHACS-PROVENANCE.json` stores both hashes and the color mapping. The verification script compares the original/current hashes and sixteen unchanged state, layout and handler initializers. Copying V1 also preserves its existing timer/audio behavior; tests for the old, now-unused V3 instrument do not certify this copied UI's scenario scheduling. Two inherited audio-effect dependency warnings are recorded without refactoring the requested source.

## Hero

The named project strip, its stage/description footer and project-specific action are removed. The foil artifact is now a personal VP identity card, including its reverse and accessible description. Explore the work goes to the systems section. The full-scale Flow Field, original Ignition shader, foil materials, viewpoint/flip/reset and home-wide Pause remain. Matrix, Gateway and Constellation continue in lower project sections. The previously removed object panels stay removed.

## Entry

V1's deliberate Scan action, scroll lock, completion release and scroll-attempt feedback are adapted to the supplied GLB. The face waits in visible standby and only starts its real bidirectional scan after Scan is pressed. Mesh lighting and the scan band are brighter; centered reticle brackets, process progress and four stage labels connect the visitor's action to the result. Dissolve ends the sequence and disposes its renderer before the hero card mounts. No random confidence, FPS or inference timing is copied from V1.

Entry resets on full page refresh, while same-document navigation keeps its completed state. Viewports up to 760px wide or 700px high expose Skip. The interface is centered and can scroll internally on constrained screens. Reduced motion and renderer/load failure expose Enter and Skip; a load deadline and a running-sequence deadline prevent an unavailable renderer from permanently trapping visitors. Covered content is inert, focus stays inside entry, overflow restores on teardown and completion focuses the hero heading. Direct project routes remain available.

## Other V1 features

V1's Connect terminal and larger project dossiers are candidates for a separate content pass. They are not added here: the existing V3 contact actions and source-backed project instruments retain their current roles. The desktop-site notice from V1 is replaced by a responsive centered entry and a compact-screen skip path.

## Verification scope

The copied reducer and deliberate scan timeline have meaningful model tests. Build, typecheck, source fidelity, source preservation and production responses are checked in this pass. The browser tool currently fails before initialization (`failed to write kernel assets`), so fresh GPU screenshots, pointer/keyboard playback, viewport geometry and visual motion quality remain unverified. Earlier captures and review verdicts predate this refinement and cannot approve the changed entry, identity card or V1 port.
