# Skills, tools and agent evidence

This inventory distinguishes available, referenced, and used. File presence or a mention alone does not prove invocation.

## Skills

| Skill | Evidence and status | Contribution / portability |
|---|---|---|
| `impeccable` | **VERIFIED installed** at `C:\Users\HP\.agents\skills\impeccable\SKILL.md`, version 4.5.0. `docs/REFERENCE-REVIEW.md` records use during earlier source review and a user-approved update from 3.8.0. | Audit-first frontend design; bounded visual verification. Markdown principles transfer; setup scripts, hooks and runtime updates are host-specific. Do not rerun updater as part of the handoff. |
| `design-taste-frontend` | **VERIFIED available** at `C:\Users\HP\.agents\skills\design-taste-frontend\SKILL.md`. The project review says installed Taste informed an earlier audit; exact invocation transcript is unavailable. | Brief/evidence-led anti-template direction. Portable as a checklist; preserve local procedure separately. |
| `design-motion-principles` | **VERIFIED available** at `C:\Users\HP\.agents\skills\design-motion-principles\SKILL.md`; prior review says motion-design guidance informed earlier audits. Exact tool invocation transcript unavailable. | Motion tied to intent, interruption and response. Portable principles; tool-specific implementation guidance may not be. |
| `ui-ux-pro-max` | **VERIFIED source present** at `.design-tools/ui-ux-pro-max-source`, version 2.13.0, MIT license, with Codex among listed platforms. The local user-level `ui-ux-pro-max-skill` path was absent. User referenced it; **actual invocation/use UNKNOWN**. | Large skill suite can be ported with the included license and relevant files; avoid bulk installation. Select only applicable accessibility, UX and visual guidance. |
| `taste-skill` | **UNKNOWN/unavailable by exact path.** User referenced this name. Installed `design-taste-frontend` is similar, not proof the exact skill existed or ran. | Map by instructions, not by name. |
| `review-animations`, `high-end-visual-design`, `emil-design-eng`, `redesign-existing-projects`, `imagegen-frontend-web` | **VERIFIED available** from this session's skill catalog and/or files under `C:\Users\HP\.agents\skills`. Their historic invocation in this project is **UNKNOWN** unless a specific artifact/doc confirms it. | Useful when the next task actually needs motion review, visual critique, or authored imagery; do not invoke all at once. |

**Licensing:** Project-local UI/UX Pro Max source declares MIT in `skill.json` and `LICENSE`. The local Impeccable and Taste skill license terms were not established in this audit; do not copy their full contents into another platform without checking. Portable project instructions should summarize project rules in original prose.

## Tools and infrastructure

- **VERIFIED available/used in this environment:** PowerShell shell/file inspection; `functions.exec_command`; Codex app tools; `mcp__cua_repl` browser automation. Historical `.impeccable/review` captures and reports provide evidence of browser-based QA. Current app context showed the local preview on port 3003. `web__run` is available for public references; avoid revisiting unless it changes a decision.
- **VERIFIED present in repo:** `.design-tools` scripts for ThreeUI fields, V1 USMHACS provenance/porting, and design refinements; project model/test scripts. These are historical tooling artifacts; inspect before running because scripts may mutate files.
- **VERIFIED absent:** V3 directory is not a Git worktree. No root `.claude`, `.agents` or `.codex` instruction/config directory was found in the checked paths. `docs/agent-handoff` was absent before this audit.
- **UNKNOWN:** Installed MCP server inventory/config, user-level hooks beyond Impeccable updater notes, and credentials/config values. Do not inspect or disclose secrets. No package, MCP server, plugin or skill was installed during this audit.

## Subagents

**VERIFIED from accessible collaboration task context:** Parallel subagent use is real. Names visible include `impeccable_documenter`, `impeccable_documenter_2`, `_3`, `_4`, `impeccable_finish_reviewer`, `_8`, `_9`, and `face_audit`. The current task tree exposed completion summaries for `_4`, finish reviewer `_8`, and `_9`. `_4` updated six documentation/surface files and reported no new browser/tests; `_8` reviewed the isolated RANGraph demo captures and source, recommended it for owner review, and listed verification limits; `_9` reviewed anchor clearance captures/source and resolved the scoped finding. Historical prompts, model/provider, complete files touched for every agent and detailed transcripts were **not accessible**. Do not infer assignments from agent names. Other visible agents' output was not recovered.

**INFERRED workflow:** Lead delegates bounded work, review agents inspect artifacts/source and report findings, lead reconciles and integrates. This is an inference from exposed summaries, not a complete transcript reconstruction. A future recommended protocol is in [`07_RECOMMENDED_AGENT_ORCHESTRATION.md`](07_RECOMMENDED_AGENT_ORCHESTRATION.md).

