# Evidence and unknowns ledger

Audit date: 10 October 2026. Paths are relative to V3 unless absolute. Labels describe confidence, not importance.

| Claim | Status | Evidence | Limit |
|---|---|---|---|
| V3 stack, scripts, routes | VERIFIED | `package.json`, `README.md`, `app/**/page.tsx`, prior build records | Read current files again before implementation. |
| V3 repository has no Git metadata | VERIFIED | `git rev-parse` and status failed in `C:\RESEARCH\portfolio v3` | Cannot reconstruct local commit diff/status. |
| Original V1 source must remain read-only; recorded baseline | VERIFIED | `docs/PRESERVATION.md`, `docs/source-baseline.json` | Prior hash verification is historical, not rerun in this audit. |
| RANGraph browser fixture dimensions/limits | VERIFIED | `app/rangraph/page.tsx`, `components/rangraph/RangraphInstrument.tsx`, `lib/rangraph/*` | External Python repo not exhaustively reviewed here. |
| Separate RANGraph repo state | VERIFIED | `git -C C:\RESEARCH\RANGraph rev-parse --short HEAD` → `c5125d0`; 204 status entries counted | Do not discard or clean; count alone gives no change semantics. |
| DARVS pipeline/demo boundary | VERIFIED | `app/darvs/page.tsx`, `lib/content/darvs.ts`, `docs/ENTRY-MOTION.md` | No current model accuracy/performance evidence. |
| USMHACS is an abstraction of V1 logic, not transistor-level validation | VERIFIED | `app/usmhacs/page.tsx`, `docs/V1-DETAILS.md`, `docs/V1-USMHACS-PROVENANCE.json` | Do not assume async scheduling safety; timer race not revalidated. |
| GraphMARL placeholder and SUMO sentence | VERIFIED | `app/graphmarl/page.tsx` | SUMO sentence is owner-reported; source/results not verified. |
| Owner rejected current card motion; next task is one RANGraph cover | VERIFIED | Latest user instruction and attached mission text | Exact final composition remains unaccepted. |
| Previous deck bounded review exists | VERIFIED | `.impeccable/review/project-deck-verdict.md`, captures, task-context reviewer summaries | Historical verdict does not override latest owner rejection; some checks supplied by parent. |
| Impeccable installed v4.5.0 and update user-approved | VERIFIED | `C:\Users\HP\.agents\skills\impeccable\SKILL.md`; `docs/REFERENCE-REVIEW.md`; earlier user reply authorizing update | Current setup scripts/hooks not run in this audit. |
| Taste/motion informed earlier audit | VERIFIED as project-doc claim | `docs/REFERENCE-REVIEW.md` | Exact invocation transcripts unavailable. |
| UI/UX Pro Max source/version/license | VERIFIED | `.design-tools/ui-ux-pro-max-source/skill.json`, `LICENSE` | Installed as active user-level skill: no; actual use: unknown. |
| Exact `taste-skill` and user `ui-ux-pro-max-skill` paths | VERIFIED absent at checked user-level locations | PowerShell `Test-Path` false for both | Other installations/aliases may exist. |
| Subagents were used | VERIFIED | Collaboration task context exposes named agents and three completion summaries | Full prompts/model IDs/transcripts for all agents unavailable; do not infer task scope from names. |
| Browser/reviewer artifacts exist | VERIFIED | `.impeccable/review/*`, screenshots, detector JSON; active local preview context | They do not certify all browsers/devices, current animation, FPS, or full accessibility. |
| Current RANGraph prototype snapshot retained | VERIFIED in docs | `docs/PROJECT-CARDS.md`, `docs/prototypes/rangraph-cover-v1-2026-10-09.zip` | This is a separate demo; not owner approval for home gallery. |
| TubesCursor is retained/restored with attribution | VERIFIED recorded provenance | `docs/CHATGPT-PROGRESS-HANDOFF.md`, `docs/RANGRAPH-COVER-DEMO.md`, `docs/PROJECT-CARDS.md` | Recheck actual current runtime/host before changing it; no FPS benchmark. |
| Environment config exists and values | UNKNOWN / not read | No `.env`, `.env.local`, `.env.production` files were present in V3 root at prior inspection | No secrets were read or exposed. Other user-level config unknown. |
| V3 current worktree cleanliness/commit history | UNKNOWN | No `.git` metadata in V3 | Do not claim clean or dirty. |
| Browser/MCP server configuration and all hooks | UNKNOWN | No project-local config found; user-level inventory unavailable | Only accessible tools in this session are listed in `03_SKILLS_TOOLS_AGENTS.md`. |
| Physical-device, OS reduced-motion, screen-reader, universal contrast and measured performance certification | UNKNOWN/unverified | Acceptance/review docs explicitly limit these claims | Must be tested separately if required. |
| All prior effect demos fully undone in exact code | UNKNOWN | Owner requested undo and tube restoration; no V3 Git history | Inspect current source; never use broad revert/reset. |

## Transcript access limits

The current conversation contains the owner’s latest constraints and the attached mission. Collaboration context yielded identities for eight non-root agents and summaries for three. Complete past prompts/transcripts, exact model/provider, all MCP server configs and historical source diffs were not available. Therefore, this handoff reports only surfaced evidence. References in prior conversation or a skill catalog are not treated as proof of use.

