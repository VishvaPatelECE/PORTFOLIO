# Porting the workflow to another coding agent

Keep the source of truth in these platform-neutral project files. Do not copy an agent's memory, skill install, tool config or hidden context as if it were portable.

## Portable now

- `AGENTS.md` and `DESIGN.md` contain project-level constraints/tokens.
- `docs/agent-handoff/00_EXECUTIVE_HANDOFF.md` through `09_EVIDENCE_AND_UNKNOWNS.md` contain current scope, decisions, implementation facts, workflow and evidence limits.
- Existing project docs, code, tests, provenance JSON, asset licenses and review captures remain authoritative for their specific facts.
- The V3 app package manifest defines its runtime; installed user-level agent tools are not project dependencies.

## Claude Code

**RECOMMENDED mapping:** Adapt the concise invariants from `06_PORTABLE_AGENT_INSTRUCTIONS.md` into root `CLAUDE.md`. Keep the longer chronology/evidence in `docs/agent-handoff/`. Add `.claude/skills/` only for repeatable project-specific procedures whose source/license are clear. Use `.claude/agents/` only when scopes are truly independent; use hooks only for a deterministic, justified check. Do not add platform files during this audit.

## Antigravity

**RECOMMENDED mapping:** Adapt the same invariants into workspace/project instructions supported by the installed version. Put reusable focused procedures in its supported skill location (for example `.agents/skills/` only if that version supports it). Use supported agent/workflow features rather than copying Claude hooks or assuming MCP compatibility. No Antigravity runtime/config was inspected; confirm current supported formats before creating files.

## Other platforms

Translate the policy to the platform's instruction, skill, delegation and tool mechanism. Preserve scope, owner authority, evidence labels, no-fabrication rules, licensing, and review criteria. Omit unsupported machinery; never emulate MCP or hooks with unreviewed scripts.

## Skills and licensing

Impeccable/Taste files are user-level instructions, not app packages. Their exact redistribution terms are **UNKNOWN** from this audit. UI/UX Pro Max source is locally present at `.design-tools/ui-ux-pro-max-source`, version 2.13.0, MIT; include its license/notices if relocating substantial source. Prefer porting project-specific principles in original prose over copying third-party skill contents wholesale. Keep copied ThreeUI/Tubes implementation notices and licenses with the respective assets.

## Safe migration order

1. Copy only the handoff Markdown and needed project assets to a reviewed destination.
2. Confirm destination access to the V3 source and required Node version without printing environment values.
3. Review asset licenses and lockfile before running installs; this handoff itself installed nothing.
4. Ask the new agent to summarize constraints and unknowns before it edits.
5. Implement only the single RANGraph cover task and produce desktop/762 evidence.
6. Have a separate reviewer inspect evidence, then obtain owner acceptance before applying the visual pattern to other projects.

