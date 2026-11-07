# @adui/normalize.css

[简体中文](README.md) · **English**

A lightweight, low-intrusion CSS Normalize library built around documented rule evidence.

`@adui/normalize.css` corrects selected browser-default differences while preserving native HTML semantics, user preferences, and existing component styles wherever possible. It ships **CSS only, with no runtime JavaScript dependencies**.

> **Version note:** The latest published npm version is **[`0.1.0`](https://github.com/adui-studio/normalize.css/releases/tag/v0.1.0)** (npm `latest`, package digests, annotated Git tag, and published GitHub Release verified). Default Normalize retains R-003, R-007 and R-008; Reset, Forms, Accessibility and `all.css` remain explicit opt-ins and were first introduced in `0.0.3`. Earlier `0.0.1` includes only R-003, and `0.0.2` first introduced the three-rule default. See the [post-release compatibility matrix](docs/research/V010_POST_RELEASE_COMPATIBILITY.md); no unverified minimum-browser-version guarantee is made.

## Features

- **Conservative by default:** No blanket removal of element margins or forced root font size, theme, or button appearance.
- **Native behavior first:** Keeps browser-default monospace settings, keyboard focus, and system accessibility preferences intact.
- **CSS-only distribution:** The root export remains a Vite+-built CSS asset, and optional CSS sources are packaged as static files without runtime JavaScript.
- **Evidence-driven rules:** Every included rule has an explicit purpose, scope, and compatibility review.
- **Complete and composable:** Conservative Normalize, optional Reset, Forms, Accessibility, and a combined entry point for plain HTML, Vue, and React apps.

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

The default package root `@adui/normalize.css` still resolves to `dist/normalize.css`. The subpaths below are **published starting with npm `0.0.3`** and are not available in `0.0.2` or earlier.

### Default Normalize rules (since `0.0.2`)

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

R-003 preserves relative emphasis; R-007 standardizes dotted underlines on titled abbreviations; R-008 aligns table border color with the current text color. The two newer rules use low-specificity `:where()` selectors. **The `0.0.3` default entry retains the same three rules.** Windows engineering checks passed on its release commit, but this is not a full real-browser T0/T2 compatibility pass or a minimum-browser-version guarantee. See the [rule evidence](docs/research/RULE_EVIDENCE_R003_R004.md) and [default scope review](docs/research/DEFAULT_NORMALIZE_V01_READINESS.md).

### Published `0.0.3`: CSS modules and import paths

| Entry                               | Scope                                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `@adui/normalize.css`               | **Default Normalize**: only R-003, R-007, and R-008, preserving the low-intrusion published behavior                                  |
| `@adui/normalize.css/normalize.css` | Explicit alias for the default CSS root                                                                                               |
| `@adui/normalize.css/reset.css`     | Optional layout Reset: border-box sizing, selected margins, responsive media sizing, table collapse; preserves list markers and focus |
| `@adui/normalize.css/forms.css`     | Optional forms typography, margins, fieldset/legend sizing, native file button font; does not repaint native controls                 |
| `@adui/normalize.css/a11y.css`      | Optional focus-visible, forced-colors, and reduced-motion root scrolling enhancements; does not disable animations globally           |
| `@adui/normalize.css/all.css`       | Full opt-in composition: Normalize → Reset → Forms → Accessibility                                                                    |

**Recommended selective imports:**

```js
import "@adui/normalize.css";
import "@adui/normalize.css/forms.css";
```

**Use the combined entry by itself if you explicitly want all modules:**

```js
import "@adui/normalize.css/all.css";
```

The `all.css` entry uses relative CSS `@import` references to files shipped inside the package. Vite+ and other CSS-aware bundlers can inline these imports. The default CSS still avoids `@layer`, root font-size changes, global themes, invasive control resets, and `!important`. The optional Reset **changes margins and table layout**; projects already using Tailwind Preflight or UnoCSS Reset should normally avoid stacking `reset.css` or `all.css` on top of another reset.

## Browser compatibility and design boundaries

The project uses **Baseline 2023** as a reference for evaluating CSS features, alongside browser evidence and local regression results. This reference **is not a published minimum-browser-version guarantee**.

Existing checks cover CSS-only packing, installation from a real local npm tarball, Vite+ production consumption, and selected browser/framework comparisons. Auditable, per-target results are not archived for every historical browser and operating-system target, so this README makes no unsupported minimum-version claims. Refer to the [browser support policy](docs/adr/0004-browser-support-policy.md) and [W-06 acceptance index](docs/research/W06_ACCEPTANCE_INDEX.md).

## Local development

The repository uses **Vite+ 1.4.0** and **pnpm 12.15.0**. Supported Node.js engine ranges are `^22.18.0 || ^24.11.0 || >=26.0.0`.

```sh
git clone https://github.com/adui-studio/normalize.css.git
cd normalize.css
pnpm install --frozen-lockfile

pnpm exec vp pack   # Build default dist/normalize.css; optional modules ship from src/*.css
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
