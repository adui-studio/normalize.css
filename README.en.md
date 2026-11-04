# @adui/normalize.css

[简体中文](README.md) · **English**

A minimal, evidence-driven CSS Normalize library. It aims to preserve native browser defaults while correcting demonstrated inconsistencies, without runtime JavaScript.

> **Development preview; not published.** The feature branch now contains one Normalize rule (R-003), one CSS root export and a dependency-free static CSS build. The package remains `private: true` at version `0.0.0`. Browser support and UI-framework integration have not completed release validation.

## First implementation

Only R-003 is included in `src/normalize.css`:

```css
b,
strong {
  font-weight: bolder;
}
```

Chrome for Testing 120.0.6099.109 showed four computed-weight differences between the native and candidate pages for `b` and `strong` with parent weights 600/700; the candidate changed 700 to 900. Firefox 121 and Chrome 156 showed no additional computed-weight change. These are limited, observed results—not a full compatibility guarantee.

R-004 deliberately does **not** normalize the font size or font family of `code`, `kbd`, `samp` and `pre`. Browser defaults are retained. Reset, Forms, Accessibility and combined styles are deferred.

## Local build

The build copies the authored CSS verbatim to `dist/normalize.css`, with no JS entry or additional build dependency. Vite+ remains the development/testing toolchain.

```sh
npm run build
npm run test:offline
vp check
```

The only package export is `@adui/normalize.css` → `./dist/normalize.css`. The intended integration with a bundler that supports CSS package imports is:

```js
import "@adui/normalize.css";
```

This import is **not yet production-verified** in Vite+ and Webpack consumers. Build the CSS before packaging, and do not publish the package without explicit release approval.

The new CSS-only build and five focused Node tests passed in an isolated Linux Node.js 22.16.0 validation environment, including a local offline tarball install and root-export resolution check. This environment does not meet the package's stated Node/Vite+ version requirement, so these checks do **not** replace the maintainer's supported local Vite+ runs. The earlier Windows tests passed before these latest changes.

## Scope and constraints

- Default Normalize is low-intrusion; no forced root font size, global theme, button reset, general margin reset or `@layer`.
- Exactly one CSS root export. There are no public `/reset.css`, `/forms.css`, `/a11y.css` or `/all.css` exports in the MVP.
- Baseline 2023-derived Chrome/Edge 120, Firefox 121 and Safari 17.2 browser targets are **test targets**, not supported-version claims. Edge, Safari, mobile browsers and component-library regressions remain unverified.
- No CI, no new runtime dependencies, no npm publication.

## Documentation

Chinese documents are the source of truth: [Requirements](docs/REQUIREMENTS.md), [Detailed design](docs/SDD.md), [Architecture](docs/ARCHITECTURE.md), [Codebase map](docs/CODEBASE_MAP.md), [Harness](docs/HARNESS.md), [R-003/R-004 evidence](docs/research/RULE_EVIDENCE_R003_R004.md), and [project context](docs/PROJECT_CONTEXT.md).

## License

[MIT](LICENSE), Copyright © 2026 ADui Studio.
