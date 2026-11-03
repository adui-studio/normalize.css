# @adui/normalize.css

[简体中文](README.md) · **English**

A planned, modern CSS normalization foundation emphasizing **minimal defaults, optional enhancements, predictable behavior, and verifiable compatibility**.

> **Status: W-03 development started on a separate branch.** ADR-0001 through ADR-0005 are Accepted. Vite+ configuration, standalone HTML fixtures and local tests now exist. No distributable Normalize stylesheet, npm export, or verified minimum-browser compatibility claim exists yet.

## Goals

- Normalize demonstrable cross-browser differences while preserving useful native HTML semantics.
- Keep the default normalization entry low-impact; make reset, accessibility and form enhancements opt-in.
- Evaluate individual rules instead of copying another project's stylesheet wholesale.
- Design for plain HTML, Vue, React and component libraries such as Element Plus, Ant Design and TDesign.
- Aim for no runtime JavaScript dependency and reproducible CSS validation.

## Approved MVP scope (not implemented)

| Entry | Purpose | MVP status |
| --- | --- | --- |
| `@adui/normalize.css` | Evidence-based browser normalization | Only planned public entry |
| `@adui/normalize.css/reset.css` | Optional layout reset | Deferred |
| `@adui/normalize.css/a11y.css` | Optional focus/preferences | Deferred |
| `@adui/normalize.css/forms.css` | Optional native forms | Deferred |
| `@adui/normalize.css/all.css` | Combined styles | Deferred |

The MVP default entry does not embed `@layer`, CSS feature admission uses fixed **Baseline 2023** as a reference, and **Vite+ 1.4.0** is declared as a development dependency (not installed in this environment). Minimum **test targets** are approved: Chrome/Edge 120, Firefox 121, Safari 17.2 and corresponding core mobile browsers. **No actual compatibility tests have been run, and these are not published support claims.** No installation instructions are available before implementation and release.

## Local W-03 harness

Use Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`, then install dependencies and run `npm exec -- vp dev` to open the `/fixtures/` pages. Use `npm exec -- vp test` for the Vite+ test suite, or `npm run test:offline` for all dependency-free Node tests (including a synthetic offline CSS-package install/resolve smoke test). The fixture-only CSS must never be treated as published normalization rules. After collecting real R-003 T0/T1 JSON from the two HTML pages, run `node tests/r003-evidence.mjs r003-native.json r003-candidate.json` to compare the same browser's six computed-weight samples. The analyzer's 8 new tests use **synthetic data only**, not actual browser observations.

**Verified here**: all **18/18 dependency-free Node tests pass**. Offline `npm pack --dry-run --json --ignore-scripts --offline .` also runs; with `files: ["dist"]` and no `dist` present, the dry-run includes only `package.json`, **not a functional CSS package**. A separate temporary, synthetic CSS tarball was successfully packed, installed offline, and resolved through its single root export; unexported subpaths were rejected. **This is not a test of the real unpublished Normalize stylesheet or Vite+/Webpack consumers.** CSS side effects are explicitly preserved in staging metadata; `exports` is still absent and the package remains private. **Not verified here**: Vite+ commands, CSS-only packaging or browser results (offline registry, local Node 22.16.0 below requirement; headless Chromium timed out). New evidence-file validation checks regular files and a 256 KiB limit **before reading/parsing**. Its four new tests **4/4 PASS**; the previous offline suite independently passed **18/18**, but the updated complete 22-test command **has not been rerun as a whole**. No CI or npm release.

## Design constraints

The default entry must not silently impose a root font-size, page theme, custom global scrollbars, button appearance resets, or broad margin removal. High-impact rules belong in optional, tested modules.

## Documentation

- [Agent instructions](AGENTS.md)
- [Requirements](docs/REQUIREMENTS.md) (Chinese)
- [Architecture](docs/ARCHITECTURE.md) (Chinese)
- [Detailed design](docs/SDD.md) (Chinese)
- [Project context](docs/PROJECT_CONTEXT.md) (Chinese)
- [Codebase map](docs/CODEBASE_MAP.md) (Chinese)
- [Skills index](docs/SKILLS.md) (Chinese)
- [Harness](docs/HARNESS.md) (Chinese)
- [Documentation validation](docs/DOCUMENTATION_VALIDATION.md) (Chinese)
- [Accepted ADR-0001: module boundaries](docs/adr/0001-css-base-strategy.md)
- [Accepted ADR-0002: no default CSS Layers](docs/adr/0002-cascade-layers.md)
- [Accepted ADR-0003: MVP only default Normalize](docs/adr/0003-mvp-package-contract.md)
- [Accepted ADR-0004: Baseline 2023 feature reference](docs/adr/0004-browser-support-policy.md)
- [Accepted ADR-0005: Vite+ development toolchain](docs/adr/0005-viteplus-toolchain.md)
- [Baseline 2023 browser version mapping (research)](docs/research/BASELINE_2023_MAPPING.md)
- [MVP implementation plan (Chinese)](docs/plans/MVP_IMPLEMENTATION_PLAN.md)

Chinese documents are the source of truth for now; this README is an English orientation page, not a separately maintained specification.

## License

[MIT](LICENSE), Copyright © 2026 ADui Studio.