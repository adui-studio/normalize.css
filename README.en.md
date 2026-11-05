# @adui/normalize.css

[简体中文](README.md) · **English**

A planned, modern CSS normalization foundation emphasizing **minimal defaults, optional enhancements, predictable behavior, and verifiable compatibility**.

> **Status: architecture approved; implementation not started.** ADR-0001 through ADR-0004 are Accepted. No CSS, published npm package, build output, or verified browser tests currently exist. The entries below are not usable imports yet.

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

The MVP default entry does not embed `@layer`, CSS feature admission uses fixed **Baseline 2023** as a reference, and **Vite+** is the approved future development toolchain (not yet installed). Minimum **test targets** are approved: Chrome/Edge 120, Firefox 121, Safari 17.2 and corresponding core mobile browsers. **No actual compatibility tests have been run, and these are not published support claims.** No installation instructions are available before implementation and release.

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