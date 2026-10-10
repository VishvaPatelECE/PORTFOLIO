# Original source preservation

Reverified after V3 implementation on 8 October 2026.

- Original path: `C:\Users\HP\darvs-portfolio`.
- HEAD: `1011122d185156c7542894747e9ce32a60156e4c`.
- Git working tree: clean before and after the audit (`git --no-optional-locks status`).
- Tracked files: **35 before, 35 after**.
- SHA-256 comparison: **0 changed, 0 removed, 0 added tracked files**.
- Baseline: [source-baseline.json](source-baseline.json).

No install, development server, build, migration, application edit or Git mutation was run in the original repository. Source diagnostics read the TSX file and transpiled selected declarations in memory; they did not write into the original project.

The hash comparison covers tracked files. It is not a recursive hash of ignored directories such as node_modules or .next. Those directories were not used as development or build output targets.

The complete V3 application, dependencies, build artifacts and verification records live in `C:\RESEARCH\portfolio v3`. The separately authorized Impeccable update affected user-level skill installations and reported engine/hook updates; it did not modify the original portfolio.
