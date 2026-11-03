# @adui/normalize.css

[简体中文](README.md) · **English**

A planned, modern CSS normalization foundation emphasizing **minimal defaults, optional enhancements, predictable behavior, and verifiable compatibility**.

> **Status: documentation and design only.** This repository does not yet contain implementation CSS, a published npm package, build artifacts, or verified browser tests. The entry points listed below are proposals, not working imports.

## Goals

- Normalize demonstrable cross-browser differences while preserving useful native HTML semantics.
- Keep the default normalization entry low-impact; make reset, accessibility and form enhancements opt-in.
- Evaluate individual rules instead of copying another project's stylesheet wholesale.
- Design for plain HTML, Vue, React and component libraries such as Element Plus, Ant Design and TDesign.
- Aim for no runtime JavaScript dependency and reproducible CSS validation.

## Proposed package entries

| Proposed entry | Purpose | Default? |
| --- | --- | --- |
| `@adui/normalize.css` | Browser normalization | Yes |
| `@adui/normalize.css/reset.css` | Optional layout reset | No |
| `@adui/normalize.css/a11y.css` | Optional focus and preference support | No |
| `@adui/normalize.css/forms.css` | Optional native form enhancements | No |
| `@adui/normalize.css/all.css` | Explicit combined entry | No |

No npm installation instructions are provided until the package is implemented and published.

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
- [Proposed ADR-0001](docs/adr/0001-css-base-strategy.md)

Chinese documents are the source of truth for now; this README is an English orientation page, not a separately maintained specification.

## License

[MIT](LICENSE), Copyright © 2026 ADui Studio.