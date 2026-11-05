# @adui/normalize.css

[简体中文](README.md) · **English**

A lightweight, low-intrusion CSS Normalize library built around documented rule evidence.

`@adui/normalize.css` corrects selected browser-default differences while preserving native HTML semantics, user preferences, and existing component styles wherever possible. It ships **CSS only, with no runtime JavaScript dependencies**.

> **Version note:** Published `0.0.2` includes R-003, R-007, and R-008 and has matching `v0.0.2` Git Tag and GitHub Release; earlier `0.0.1` contains R-003 only. **`0.1.0` will only be considered after further Normalize improvements and acceptance, and has not been published.**

## Features

- **Conservative by default:** No blanket removal of element margins or forced root font size, theme, or button appearance.
- **Native behavior first:** Keeps browser-default monospace settings, keyboard focus, and system accessibility preferences intact.
- **CSS-only distribution:** One root package export, built with Vite+, without runtime JavaScript.
- **Evidence-driven rules:** Every included rule has an explicit purpose, scope, and compatibility review.
- **Composable:** Suitable for plain HTML and Vue/React applications with CSS import support. When combining with other resets, review cascade order.

## Installation and usage

### Install from npm

```sh
pnpm add @adui/normalize.css
# or
npm install @adui/normalize.css
```

Import the stylesheet from an application entry point that supports package CSS imports, preferably before application-specific styles:

```js
import "@adui/normalize.css";
```

The sole package export is `@adui/normalize.css`, resolving to `dist/normalize.css`. If the version you need is not available on the npm registry, build it locally as described below.

### Published `0.0.1` versus `0.0.2`

Published `0.0.1` contains R-003 alone. **Published `0.0.2`** contains three rules (R-003, R-007 and R-008):

```css
b,
strong {
  font-weight: bolder;
}

:where(abbr[title]) {
  text-decoration: underline dotted;
}

:where(table) {
  border-color: currentColor;
}
```

R-003 preserves relative emphasis; R-007 standardizes dotted underlines on titled abbreviations; R-008 aligns table border color with the current text color. The two newer rules use low-specificity `:where()` selectors. **These three rules ship in `0.0.2`, and Windows engineering checks passed; this does not constitute a full real-browser T0/T2 compatibility pass or a minimum-browser-version guarantee.** See the [rule evidence](docs/research/RULE_EVIDENCE_R003_R004.md) and [default scope review](docs/research/DEFAULT_NORMALIZE_V01_READINESS.md).

This version **does not export** `reset.css`, `a11y.css`, `forms.css`, or `all.css`. Those are potential future optional modules, not features available to import today. The default stylesheet does not use `@layer`.

## Browser compatibility and design boundaries

The project uses **Baseline 2023** as a reference for evaluating CSS features, alongside browser evidence and local regression results. This reference **is not a published minimum-browser-version guarantee**.

Existing checks cover CSS-only packing, installation from a real local npm tarball, Vite+ production consumption, and selected browser/framework comparisons. Auditable, per-target results are not archived for every historical browser and operating-system target, so this README makes no unsupported minimum-version claims. Refer to the [browser support policy](docs/adr/0004-browser-support-policy.md) and [W-06 acceptance index](docs/research/W06_ACCEPTANCE_INDEX.md).

## Local development

The repository uses **Vite+ 1.4.0** and **pnpm 12.15.0**. Supported Node.js engine ranges are `^22.18.0 || ^24.11.0 || >=26.0.0`.

```sh
git clone https://github.com/adui-studio/normalize.css.git
cd normalize.css
pnpm install --frozen-lockfile

pnpm exec vp pack   # Produce dist/normalize.css
pnpm exec vp dev    # Start local fixtures
```

Run the local verification suite and build the fixture pages:

```sh
pnpm run verify:mvp
pnpm exec vp build
```

`verify:mvp` runs formatting/lint checks, unit and offline tests, CSS packing, real tarball consumption, and an npm package **dry run**. `vp build` produces local fixture pages under `dist-fixtures/`. **Neither command publishes to npm**, and this repository does not use CI. See the [MVP handoff and verification checklist](docs/MVP_0_0_1_HANDOFF.md) for the test scope and historical results.

## Documentation

- [Requirements](docs/REQUIREMENTS.md) · [Architecture](docs/ARCHITECTURE.md) · [Detailed design](docs/SDD.md)
- [Rule acceptance](docs/research/W05_RULE_ACCEPTANCE.md) · [Browser/ecosystem acceptance](docs/research/W06_ACCEPTANCE_INDEX.md)
- [Local verification](docs/MVP_0_0_1_HANDOFF.md) · [Codebase map](docs/CODEBASE_MAP.md)
- [Changelog](CHANGELOG.md) · [Project context](docs/PROJECT_CONTEXT.md)

## Contributing

Use [GitHub Issues](https://github.com/adui-studio/normalize.css/issues) to report browser differences or propose rules or documentation changes. For CSS rule changes, describe the browser evidence, affected scope, cascade/accessibility risks, and a reproducible test case when possible.

Read [AGENTS.md](AGENTS.md) and the [Pull Request template](.github/pull_request_template.md) before contributing. Keep changes minimal; **do not add CI or automated publishing workflows**.

## License

[MIT](LICENSE) · Copyright © 2026 ADui Studio.
