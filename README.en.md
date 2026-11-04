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

The maintainer has verified **Vite+ 1.4.0** with `vp build` (six local HTML fixtures), `vp pack` (one `dist/normalize.css`, no published JS), and the real package installation and production consumer checks.

```sh
vp dev              # Local fixture server
vp build            # HTML fixture preview: dist-fixtures/
vp pack             # CSS-only package asset: dist/normalize.css
vp check
vp test
npm run test:offline
npm run test:package   # After vp pack: real tarball + offline installation
npm run test:consumer  # After vp pack: Vite+ production CSS retention
```

The only package export is `@adui/normalize.css` → `./dist/normalize.css`. Consumers can import the stylesheet through an appropriate bundler:

```js
import "@adui/normalize.css";
```

**Verified on Windows, 2026-11-04:** `npm run test:package` **1/1 PASS** against the full repository's actual tarball, and `npm run test:consumer` **1/1 PASS** against a separate Vite+ 1.4.0 production build with CSS retained. Previously, `vp test` passed 6/6 and the offline Node suite passed 26/26. Webpack 5, the Vite+ development consumer path, and actual browser/framework rendering are still unverified. The package remains private and is not published.

## Windows line endings

`.gitattributes` enforces LF working-tree line endings for Git-detected text, regardless of `core.autocrlf`; `.editorconfig` requests UTF-8, LF, and a final newline in editors (including JetBrains). These prevent repeated CRLF-to-LF formatting on future checkouts and saves but may not rewrite already checked-out files.

```powershell
git status --short
git pull --ff-only origin feat/viteplus-local-harness
git check-attr text eol -- README.md src/normalize.css
vp check
```

If previously checked-out files still contain CRLF, inspect local changes first, then run `vp check --fix` once for first-party files and review the diff. Avoid mass renormalization or destructive Git resets, especially for pinned upstream Skills.

## Scope and constraints

- Default Normalize is low-intrusion; no forced root font size, global theme, button reset, general margin reset or `@layer`.
- Exactly one CSS root export. There are no public `/reset.css`, `/forms.css`, `/a11y.css` or `/all.css` exports in the MVP.
- Baseline 2023-derived Chrome/Edge 120, Firefox 121 and Safari 17.2 browser targets are **test targets**, not supported-version claims. Edge, Safari, mobile browsers and component-library regressions remain unverified.
- No CI, no new runtime dependencies, no npm publication.

## Documentation

Chinese documents are the source of truth: [Requirements](docs/REQUIREMENTS.md), [Detailed design](docs/SDD.md), [Architecture](docs/ARCHITECTURE.md), [Codebase map](docs/CODEBASE_MAP.md), [Harness](docs/HARNESS.md), [R-003/R-004 evidence](docs/research/RULE_EVIDENCE_R003_R004.md), and [project context](docs/PROJECT_CONTEXT.md).

## License

[MIT](LICENSE), Copyright © 2026 ADui Studio.
