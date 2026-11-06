import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

const readFixture = (name: string) =>
  readFileSync(new URL("../fixtures/" + name, import.meta.url), "utf8");

describe("规则复现 Fixture 契约", () => {
  it("R-003 T0 不添加 b/strong 的候选修复", () => {
    const source = readFixture("r003-native.html");
    expect(source).toContain('id="b-600"');
    expect(source).toContain('id="strong-700"');
    expect(source).not.toContain('id="candidate-rule"');
    expect(source).not.toContain("font-weight: bolder");
  });

  it("R-003 T1 只单独包含待审查的 bolder 声明", () => {
    const source = readFixture("r003-candidate.html");
    expect(source).toContain('id="candidate-rule"');
    expect(source).toMatch(/b,\s*strong\s*\{\s*font-weight:\s*bolder;/);
    expect(source).toContain('id="b-600"');
    expect(source).toContain('id="strong-700"');
  });

  it("R-004 T0 保留浏览器等宽字体字号偏好", () => {
    const source = readFixture("r004-native.html");
    expect(source).toContain('id="code"');
    expect(source).toContain('id="pre"');
    expect(source).not.toContain("font-size: 1em");
    expect(source).not.toContain('id="risk-review-only"');
  });

  it("R-004 风险对照与默认 Normalize 隔离", () => {
    const source = readFixture("r004-risk-review.html");
    expect(source).toContain('id="risk-review-only"');
    expect(source).toMatch(/code,\s*kbd,\s*samp,\s*pre\s*\{\s*font-size:\s*1em;/);
  });

  it("R-004 T1b 只额外添加重复等宽字体族", () => {
    const baseline = readFixture("r004-risk-review.html");
    const familyReview = readFixture("r004-family-review.html");
    expect(baseline).not.toContain('id="family-review-only"');
    expect(familyReview).toContain('id="family-review-only"');
    expect(familyReview).toMatch(/font-family:\s*monospace,\s*monospace;/);
    expect(familyReview).toMatch(/font-size:\s*1em;/);
    for (const id of ["code", "kbd", "samp", "pre"]) {
      expect(baseline).toContain(`id="${id}" data-probe`);
      expect(familyReview).toContain(`id="${id}" data-probe`);
    }
  });

  it("W-06 T0/T2 仅差实际 CSS link，页面内容与被测对象一致", () => {
    const native = readFixture("t2-native.html");
    const integrated = readFixture("t2-package.html");
    const body = (source: string) =>
      source.slice(source.indexOf("<body>"), source.indexOf("</body>") + "</body>".length);

    expect(body(native)).toBe(body(integrated));
    expect(native).not.toContain('id="package-css"');
    expect(integrated).toContain(
      '<link id="package-css" rel="stylesheet" href="../dist/normalize.css" />',
    );
    for (const id of ["b-600", "strong-700", "code", "kbd", "samp", "pre"]) {
      expect(native).toContain(`id="${id}" data-probe`);
      expect(integrated).toContain(`id="${id}" data-probe`);
    }
    expect(integrated).not.toContain('id="candidate-rule"');
  });

  it("v0.0.3 可选模块 T0/T2 的 DOM 与作者样式严格一致", () => {
    const native = readFixture("modules-native.html");
    const all = readFixture("modules-all.html");
    const body = (source: string) =>
      source.slice(source.indexOf("<body>"), source.indexOf("</body>") + "</body>".length);
    const style = (source: string) =>
      source.slice(source.indexOf("<style>"), source.indexOf("</style>") + "</style>".length);
    expect(body(native)).toBe(body(all));
    expect(style(native)).toBe(style(all));
    expect(native).not.toContain('id="modules-css"');
    expect(all).toContain('<link id="modules-css" rel="stylesheet" href="../src/all.css" />');
    expect(all).toContain('src="./modules-probe.js"');
    expect(all).not.toMatch(/https?:\/\//);
  });

  it("所有 Fixture 只读取数据，不依赖远程资源", () => {
    const files = [
      "r003-native.html",
      "r003-candidate.html",
      "r004-native.html",
      "r004-risk-review.html",
      "r004-family-review.html",
      "t2-native.html",
      "t2-package.html",
    ];
    for (const name of files) {
      const source = readFixture(name);
      expect(source).toContain('src="./probe.js"');
      expect(source).toContain('id="probe-output"');
      expect(source).not.toMatch(/https?:\/\//);
    }
  });
});
