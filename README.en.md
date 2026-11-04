# @adui/normalize.css

[简体中文](README.md) · **English**

A minimal, evidence-driven CSS Normalize library. It aims to preserve native browser defaults while correcting demonstrated inconsistencies, without runtime JavaScript.

> **Latest status (2026-11-04): development preview, not published.** W-03 (local harness), W-04 (package contract), W-05 (36-rule acceptance decisions), and W-06 (regression work) have been closed following maintainer approval. The MVP still contains **one** default Normalize rule, R-003, and one CSS root export; other candidates are excluded from the MVP. W-07 release-readiness review is in progress. The package remains `private: true` at `0.0.0`. Maintainer acceptance of regression work must not be presented as independently auditable support for every proposed minimum browser version.

**Current audit references:** [W-05 rule decisions](docs/research/W05_RULE_ACCEPTANCE.md) · [W-06 acceptance index](docs/research/W06_ACCEPTANCE_INDEX.md) · [W-07 release-readiness review](docs/research/W07_RELEASE_READINESS_REVIEW.md) · [Unreleased changelog](CHANGELOG.md). Earlier W-03/W-04/W-06 sections retain historical results and intermediate test states; use these latest acceptance records for current project status.

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

The maintainer has verified **Vite+ 1.4.0** with `vp build` (the initial six local HTML fixtures; now eight with W-06, pending fresh build verification), `vp pack` (one `dist/normalize.css`, no published JS), and the real package installation and production consumer checks.

```sh
vp dev              # Local fixture server
vp build            # HTML fixture preview: dist-fixtures/
vp pack             # CSS-only package asset: dist/normalize.css
vp check
vp test
npm run test:offline
npm run test:package   # After vp pack: real tarball + offline installation
npm run test:consumer  # After vp pack: Vite+ production CSS retention
npm run test:ecosystem -- vue-element # Optional, isolated Vue + Element Plus
npm run test:ecosystem -- react-antd   # Optional, isolated React + Ant Design
npm run test:ecosystem -- vue-tdesign # Optional, isolated Vue + TDesign
```

The only package export is `@adui/normalize.css` → `./dist/normalize.css`. Consumers can import the stylesheet through an appropriate bundler:

```js
import "@adui/normalize.css";
```

**Verified on Windows, 2026-11-04:** `npm run test:package` **1/1 PASS** against the full repository's actual tarball, and `npm run test:consumer` **1/1 PASS** against a separate Vite+ 1.4.0 production build with CSS retained. Previously, `vp test` passed 6/6 and the offline Node suite passed 26/26. The Vite+ development consumer path and actual browser/framework rendering are still unverified; Webpack is not part of the required project toolchain. The package remains private and is not published.

**W-04 scope:** Vite+ is the only build and required consumer toolchain for this CSS library. The previously added Webpack-specific smoke test has been removed; standard CSS assets do not require Webpack. The real npm tarball and Vite+ production consumer checks have passed. Browser and framework rendering remain separate release-readiness work. Only syntax validation has been completed so far.

## W-06 real CSS T2 browser comparison

First run `vp pack` to generate `dist/normalize.css`, then `vp build` or `vp dev`. Compare `/fixtures/t2-native.html` (native) with `/fixtures/t2-package.html` (the identical content with a link to the actual packed CSS). The probe reports `packageStylesheet.loaded`; a failed stylesheet load cannot count as a browser compatibility pass.

The new fixtures cover R-003 emphasis weights, unchanged R-004 monospace values, and native form/dialog/focus observation points. **The maintainer provided Chrome 156 T0/T2 screenshots and confirmed a local PASS.** Dialog opening/Esc, keyboard focus and hidden-until-found behavior also passed manual checks; exact event logs and complete browser/UI framework matrices are still unavailable. See the [Chinese local verification guide](docs/research/W06_T2_LOCAL_VERIFICATION.md). No new library rules, runtime dependencies, CI, or public exports were added.

## W-06 isolated Vue / React / TDesign ecosystem consumers

Three optional consumer cases are available: Vue 3 with Element Plus, React with Ant Design, and Vue 3 with TDesign Vue Next. All install the actual `vp pack` tarball into an ignored temporary directory and use the project's existing Vite+ 1.4.0 to build independent native/T2 pages. Framework dependencies are **not** added to the package itself. Runs are explicit and may require npm network access.

```sh
vp pack
npm run test:offline
npm run test:ecosystem -- vue-element
npm run test:ecosystem -- react-antd
npm run test:ecosystem -- vue-tdesign
```

Add `--keep` to retain a temporary native/package pair for manual browser comparison. **Both Vite+ production consumers have passed.** The maintainer also supplied Chrome 156 native/package screenshots for Vue + Element Plus: Button/Input mount in both, their static appearance matches, and all five computed-style samples are identical. This is a **Chrome 156 static UI comparison PASS**, not a keyboard interaction or broader browser compatibility guarantee. React + Ant Design also has Chrome 156 native/package browser screenshots: Button/Input mount in both, visible styling matches, and all five computed-style samples are identical. Both Vue+Element Plus and React+Ant Design have now passed this Chrome 156 static comparison; keyboard/input interactions and other browsers remain unverified. The maintainer has since rerun the original full offline suite with **30/30 PASS**. The newly added TDesign case is not included in that previously executed result and still needs local validation. TDesign Vue Next 1.20.10 is now available as a separate optional test case, **NOT_RUN** for installation/build/browser behavior. See the [local ecosystem verification guide](docs/research/W06_ECOSYSTEM_LOCAL_VERIFICATION.md).

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
- Baseline 2023-derived Chrome/Edge 120, Firefox 121 and Safari 17.2 targets are **test targets**, not public supported-version claims. The maintainer has formally accepted W-06; a complete per-browser, per-OS results appendix for those targets was not provided with the acceptance, so this README makes no unsubstantiated version-specific compatibility promise.
- No CI, no new runtime dependencies, no npm publication.

## Documentation

Chinese documents are the source of truth: [Requirements](docs/REQUIREMENTS.md), [Detailed design](docs/SDD.md), [Architecture](docs/ARCHITECTURE.md), [Codebase map](docs/CODEBASE_MAP.md), [Harness](docs/HARNESS.md), [R-003/R-004 evidence](docs/research/RULE_EVIDENCE_R003_R004.md), and [project context](docs/PROJECT_CONTEXT.md).

## License

[MIT](LICENSE), Copyright © 2026 ADui Studio.
