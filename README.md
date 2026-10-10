# VishvaProjects V3

A Next.js engineering portfolio with a short Three.js entry sequence, a holographic project card, actual ThreeUI flow/matrix/constellation/gateway fields, an explorable DARVS architecture, a state-driven USMHACS circuit and a source-backed RANGraph fixture explorer.

## Run locally

Requires Node.js 20.9 or newer and npm. No credentials or environment variables are required.

```powershell
cd 'C:\RESEARCH\portfolio v3'
npm ci
npm run dev
```

Open <http://127.0.0.1:3003>. For a production preview:

```powershell
npm run build
npm run start
```

Stop the running server before switching between development and production. Both use port 3003. Do not run a build concurrently with the development server in this directory.

## Verify

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Model tests cover fault latching, protected reset, stale delays, overlapping scenario cancellation, unmount cleanup, fixture conversions, graph diagnostics and the bidirectional intro scan. See [acceptance notes](docs/ACCEPTANCE.md) for browser checks and testing limits.

## Routes and boundaries

- `/`: centered visitor-triggered Scan entry, resetting on full home refresh like V1. Small/short screens expose Skip; reduced motion or rendering failure allow immediate entry. The larger supplied face supports pointer/drag/keyboard inspection. Its 6.9-second scan, ribbon morph and aperture reveal prepare the hero during the final handoff and dispose the face on exit. Replay Entry starts it again. The hero contains personal identity, a generic Explore the work action, the VP foil card and no project names/dock. Reverse, bounded viewpoint keys, home-wide Pause and Reset work. A personal static fallback handles unavailable rendering. Lower project sections retain atmospheric fields, text and working actions; their illustration panels stay removed. See [entry motion](docs/ENTRY-MOTION.md) for controls and verification limits.
- `/darvs`: deterministic architecture examples. No camera, face recognition or biometric processing runs in the browser.
- `/usmhacs` and `/usmhacs/full`: the original V1 diagram component, copied with V3 palette substitutions. Controls, coordinates, scenarios, gate/latch logic, five-second delay, alarm/chime, sound toggle and console retain V1 behavior. See [V1 details](docs/V1-DETAILS.md) for source fidelity and verification limits.
- `/rangraph`: the source project's golden fixture and TypeScript pipeline. Two timesteps, three UEs, two gNBs and one handover. Graph geometry is schematic; edges and conversions come from computation. Invalid IR cannot be exported.
- `/research`: RANGraph and an honest GraphMARL placeholder.
- `/about`, `/credits`: CV-backed background and source/asset attribution. Contact links appear on every page.

## Maintain

Content and destinations: `lib/content/site.ts` and route pages. State models: `lib/models`. Scenario clocks: `lib/schedulers`. Source-derived RANGraph pipeline: `lib/rangraph`. Rendering: `three/face`, `three/assembly`, `three/holo`, `three/ignition` and `components/home`. Official isolated field frames and their source hashes: `public/threeui`. Shared visual tokens, responsive layouts and reduced-motion rules: `app/globals.css`, `app/laboratory.css` and the final home override `app/signal.css`. The canonical visual-world record is `DESIGN.md`.

Anybody Variable and Recursive are served locally. Licenses/notices are in `public/licenses`; the supplied head's attribution is in `public/face/HEAD-LICENSE.txt`. The face is a third-party illustrative head, not Vishva or the visitor. ThreeUI Community 1.2.0 is used directly: its official field renderers are baked into local isolated frames, and its exact Ignition shaders power the native action. The custom holographic card and face remain adaptations. See `docs/THREEUI-INTEGRATION.md` for an honest mapping of every supplied link. Animmaster Lib informed the earlier motion study; its component package is not installed.

## Deploy

Use a Next.js-compatible host with `npm ci` and `npm run build`. For a self-hosted Node server, launch `npx next start --hostname 0.0.0.0 --port 3000` behind the host's HTTPS proxy. The local `start` script deliberately binds to loopback. This project has not been published to a public host.

## Source preservation

The original portfolio at `C:\Users\HP\darvs-portfolio` is read-only. V3 lives entirely here. `docs/source-baseline.json` records the original tracked-file hashes. DARVS and RANGraph repositories were inspected without modifying them. Historical audit documents remain as provenance; the execution brief and this implementation supersede their planning-only status.
