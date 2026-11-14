# Technical state (read-only audit)

## Stack and app map

**VERIFIED:** `package.json` defines Next.js 16.4.0, React 19.2.4, TypeScript, Three.js 0.180.0, `@designcodeio/threeui` 1.2.0, Framer Motion 12.38.0, GSAP 3.12.2 (dev dependency), Anybody/Recursive variable fonts and lucide-react. Scripts: `dev` and `start` bind `127.0.0.1:3003`; `build`, `lint`, `test`, `typecheck`. Node >=20.9 is stated in README. Do not update/install during this documentation task.

**VERIFIED routes** from `app/**/page.tsx` and build records: `/`, `/about`, `/credits`, `/darvs`, `/darvs/demo`, `/demo/projects`, `/graphmarl`, `/rangraph`, `/research`, `/usmhacs`, `/usmhacs/full`. Project route components are in `app/<project>/page.tsx`; reusable instruments are under `components/{darvs,rangraph,usmhacs}`; factual content and models under `lib/content` and `lib/models`. The home uses `app/page.tsx`. Verify current route list before work.

## Project truth

- **RANGraph — VERIFIED in page and instrument source:** browser fixture: two timesteps, three UEs, two gNBs, one handover. TypeScript ingestion/compiler/validator derive visible output from the fixture. Edges follow source-reported serving-cell references; no proximity-inferred interference edges. Layout is schematic, not measured location. Browser exporter exports fixture IR JSON; it does not run the Python compiler or export tensor data. The separate repo `C:\RESEARCH\RANGraph` is at `c5125d0` and had 204 changed/untracked entries in its Git status count during this audit; do not reset or clean it. Its current source and data were not exhaustively audited here.
- **DARVS — VERIFIED in `app/darvs/page.tsx`:** documented system pipeline is camera → MTCNN detection → movement/eye-state liveness → FaceNet → decision. Portfolio demonstrations are controlled examples; they do not capture biometrics or run model inference. Current DARVS page discloses a source eye-state training/inference label discrepancy; no security/performance benchmark is claimed. Entry animation is distinct from that project pipeline.
- **USMHACS — VERIFIED in `app/usmhacs/page.tsx`:** the page uses the original V1 diagram/scenarios/alarm/console with a browser logic model; it is not transistor-level simulation or physical security validation. It describes Boolean sensor inputs, code, key, delay, tamper, persistent fault latch, door and event log. Wrong code/brute-force demo does not implement an attempt counter. `docs/V1-DETAILS.md` documents source-port provenance and two inherited audio-hook dependency warnings. **UNKNOWN:** the previously noted asynchronous scenario timer race is not revalidated in this audit; do not claim fixed. Inspect the actual current V1-derived scheduler and tests before touching it.
- **GraphMARL — VERIFIED placeholder:** current route labels it “research in progress,” says details are coming, and says SUMO is used for mobility generation, with source/results forthcoming. Do not elevate this into a demonstrated policy/result. Cover imagery is conceptual unless validated against actual output.

## Entry, hero, visuals

**VERIFIED in `docs/ENTRY-MOTION.md`, `docs/ACCEPTANCE.md` and source:** The scan is a deliberate entry experience; temporary face geometry is disposed at completion, after a ribbon/aperture handoff to the prepared personal hero. Reduced-motion, skip/short-screen and failure paths are described in source records. DARVS System Overview is explanatory text, not a project link. Owner wants the original curved facial scan look and less visual clutter. The scanner does not perform authentication.

**VERIFIED but superseded owner direction:** The native image deck was implemented and documented, and old review artifacts reported a bounded pass. The latest owner says the card motion is bad and rejects that direction. Do not interpret a historical “ship” review as present owner acceptance. `/demo/projects` remains a distinct preserved RANGraph prototype archive (`docs/prototypes/rangraph-cover-v1-2026-10-09.zip`, SHA256 in `docs/PROJECT-CARDS.md`). TubesCursor is recorded as retained/restored with SHA256 `676abd6…`; its source license is CC BY-NC-SA 4.0 and Three.js MIT notice applies; verify current hosting and attribution before changes.

## Checks and limits

**VERIFIED in project records:** A latest acceptance note records 26 tests passing; current acceptance docs also record successful typecheck/build and lint with two inherited V1 audio-effect warnings in that test-era state. A more recent build after a CSS adjustment was reported passing in the task summary; do not state that tests were rerun after that adjustment. Historical checks at earlier points report 11, 16, or 19 tests; use the latest count only with date/scope context.

**VERIFIED:** `.impeccable/review/` contains captures and detector/review reports, including desktop, mobile and 762px artifacts. A finished reviewer summary says it viewed project-cover desktop/762/mobile captures but did not independently rerun tests or browser operation. Those are evidence of bounded review, not current universal accessibility/performance certification.

**UNKNOWN:** No V3 `.git` worktree was present, so commit history, clean/dirty status and source diffs for this portfolio could not be inspected. No env files were present; values were not read. Browser evidence is mixed across historical captures and current app view; OS-level reduced-motion, physical mobile, complete screen-reader, cross-browser and measured FPS/Core Web Vitals remain uncertified. Never print secrets or biometric data.

