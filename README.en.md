# @adui/normalize.css

[![npm version](https://img.shields.io/npm/v/%40adui%2Fnormalize.css?style=flat-square&logo=npm&logoColor=white&color=cb3837)](https://www.npmjs.com/package/@adui/normalize.css)
[![npm downloads/month](https://img.shields.io/npm/dm/%40adui%2Fnormalize.css?style=flat-square&logo=npm&logoColor=white&label=downloads%2Fmonth&color=0891b2)](https://www.npmjs.com/package/@adui/normalize.css)
[![GitHub release](https://img.shields.io/github/v/release/adui-studio/normalize.css?style=flat-square&logo=github&logoColor=white&color=2563eb)](https://github.com/adui-studio/normalize.css/releases/latest)
[![MIT license](https://img.shields.io/github/license/adui-studio/normalize.css?style=flat-square&color=64748b)](LICENSE)
[![CSS only](https://img.shields.io/badge/runtime-CSS--only-0f766e?style=flat-square)](package.json)

[简体中文](README.md) · **English**

A lightweight, modular CSS normalization library for modern web applications. It addresses reviewed browser-default differences while preserving native HTML semantics, user preferences, and existing application styles wherever practical.

The package provides a **conservative default Normalize** and explicitly optional **Reset, Forms, and Accessibility** modules. It ships CSS only, with **no runtime JavaScript dependencies**.

**Current release:** [v0.1.0](https://github.com/adui-studio/normalize.css/releases/tag/v0.1.0) · [npm](https://www.npmjs.com/package/@adui/normalize.css) · [Changelog](CHANGELOG.md)

## Features

- **Conservative defaults:** Only reviewed normalization rules; no blanket removal of margins, forced root typography, themes, or control appearances.
- **Modular imports:** Use Normalize, Reset, Forms, and Accessibility individually or opt in to the combined entry.
- **Native behavior first:** Preserve semantic elements, focus behavior, list markers, and system accessibility preferences; optional enhancements do not disable all animations.
- **Traceable decisions:** Significant rules are documented with their purpose, browser evidence, scope, and risks.
- **CSS-only distribution:** Works with tooling that supports package CSS imports; no runtime JavaScript dependencies.

## Installation

With pnpm:

```sh
pnpm add @adui/normalize.css
```

Or with npm:

```sh
npm install @adui/normalize.css
```

Import the default stylesheet in your application entry, generally before application-specific styles:

```js
import "@adui/normalize.css";
```

The default entry **does not** automatically include Reset, Forms, or Accessibility.

## Modules and imports

| Import                              | Purpose                                                                          |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `@adui/normalize.css`               | Default Normalize with only R-003, R-007, and R-008                              |
| `@adui/normalize.css/normalize.css` | Explicit alias of the default Normalize                                          |
| `@adui/normalize.css/reset.css`     | Optional layout reset for box sizing, selected margins, media sizing, and tables |
| `@adui/normalize.css/forms.css`     | Optional forms typography, spacing, and selected native control layout           |
| `@adui/normalize.css/a11y.css`      | Optional focus, forced-colors, and reduced-motion enhancements                   |
| `@adui/normalize.css/all.css`       | Opt-in combined entry: Normalize → Reset → Forms → Accessibility                 |

### Selective imports

You can import only the modules you need alongside default Normalize:

```js
import "@adui/normalize.css";
import "@adui/normalize.css/forms.css";
```

To enable the entire set, **import the combined entry alone** rather than duplicating individual modules:

```js
import "@adui/normalize.css/all.css";
```

The `all.css` entry uses relative CSS `@import` statements. Make sure your build tool handles these imports. Applications that already use Tailwind Preflight or UnoCSS Reset generally should not add this package's Reset or `all.css`, because multiple global resets may introduce redundant layout changes.

### Default Normalize

The default entry currently consists of three rules:

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

- **R-003:** Preserve relative emphasis for `b` and `strong`.
- **R-007:** Apply a dotted underline to `abbr` elements with a `title` attribute.
- **R-008:** Make `table` border color follow the current text color.

R-007 and R-008 use `:where()` for low selector specificity. See [ADR-0006](docs/adr/0006-v01-default-scope-and-compatibility-risk.md) for scope decisions and historical browser risks.

### Optional Reset

`reset.css` applies global `border-box` sizing, including `::before` and `::after`, and adjusts selected document margins, responsive media sizing, and table layout.

```js
import "@adui/normalize.css/reset.css";
```

Reset changes layout calculations and should be selected according to the application's existing CSS foundation. It preserves native heading sizes, heading weights, and list markers.

### Optional Forms and Accessibility

`forms.css` provides font inheritance and selected layout normalization while preserving native button and input appearance. Some rules affect control margins.

`a11y.css` enhances focus indication with `:focus-visible`, uses a system color under `forced-colors`, and sets root scrolling to `auto` under `prefers-reduced-motion: reduce`. It **does not remove native focus or disable animations globally**.

`:focus-visible` follows browser heuristics; it is not keyboard-only. Editable controls may match after pointer focus. See the [Accessibility behavior review](docs/research/A11Y_FOCUS_VISIBLE_CONTRACT_20261107.md).

## Browser compatibility

The project uses **Baseline 2023** as a reference for evaluating CSS features, **not** as a public minimum-browser-version guarantee.

Existing verification covers CSS packaging, real npm tarball consumption, Vite+ production builds, and selected browser and ecosystem comparisons. Auditable evidence does not yet cover every intended browser, device, operating system, and accessibility preference combination. Accordingly, the project **does not claim unsupported minimum browser versions**.

See the [browser support policy](docs/adr/0004-browser-support-policy.md) and [post-release compatibility record](docs/research/V010_POST_RELEASE_COMPATIBILITY.md). When integrating with UI libraries or other CSS resets, verify import order, cascade layers, specificity, and interactive behavior in the target application.

## Local development and verification

The project uses **Vite+ 1.4.0** and **pnpm 12.15.0**. Its Node.js engine range is `^22.18.0 || ^24.11.0 || >=26.0.0`.

```sh
git clone https://github.com/adui-studio/normalize.css.git
cd normalize.css
pnpm install --frozen-lockfile

pnpm exec vp pack
pnpm exec vp dev
```

Run the existing local quality checks and fixture build:

```sh
pnpm run verify:mvp
pnpm exec vp build
```

`verify:mvp` covers formatting, linting, tests, CSS packaging, real npm tarball consumption, and an npm package dry run. `vp build` builds local fixture pages. **Neither command publishes to npm.** The project does not use CI; maintainers run these checks locally.

See the [local verification and handoff guide](docs/MVP_0_0_1_HANDOFF.md).

## Documentation

- [Requirements](docs/REQUIREMENTS.md) · [Architecture](docs/ARCHITECTURE.md) · [Detailed design](docs/SDD.md)
- [Rule acceptance](docs/research/W05_RULE_ACCEPTANCE.md) · [Compatibility acceptance](docs/research/W06_ACCEPTANCE_INDEX.md)
- [Codebase map](docs/CODEBASE_MAP.md) · [Project context](docs/PROJECT_CONTEXT.md)
- [Changelog](CHANGELOG.md) · [Release process](docs/RELEASING.md)

## npm download trend

<a href="https://www.npmjs.com/package/@adui/normalize.css">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/chart/npm/@adui/normalize.css.svg?days=30&amp;bg=transparent&amp;border=false&amp;mode=dark" />
    <img src="https://shieldcn.dev/chart/npm/@adui/normalize.css.svg?days=30&amp;bg=transparent&amp;border=false&amp;mode=light" alt="@adui/normalize.css npm download trend over the last 30 days" width="760" />
  </picture>
</a>

The chart is generated by a third-party service and may be cached.

## Contributing

Use [GitHub Issues](https://github.com/adui-studio/normalize.css/issues) to report browser differences, component conflicts, or rule proposals. CSS behavior changes should include affected browsers and versions, reproduction steps, expected behavior, and possible layout or accessibility impacts.

Read [AGENTS.md](AGENTS.md) and the [Pull Request template](.github/pull_request_template.md) before contributing. Keep changes minimal; do not add CI or automated publishing workflows.

## License

[MIT](LICENSE) · Copyright © 2026 ADui Studio.
