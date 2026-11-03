import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vite-plus/test';

const readFixture = (name: string) =>
  readFileSync(new URL('../fixtures/' + name, import.meta.url), 'utf8');

describe('规则复现 Fixture 契约', () => {
  it('R-003 T0 不添加 b/strong 的候选修复', () => {
    const source = readFixture('r003-native.html');
    expect(source).toContain('id="b-600"');
    expect(source).toContain('id="strong-700"');
    expect(source).not.toContain('id="candidate-rule"');
    expect(source).not.toContain('font-weight: bolder');
  });

  it('R-003 T1 只单独包含待审查的 bolder 声明', () => {
    const source = readFixture('r003-candidate.html');
    expect(source).toContain('id="candidate-rule"');
    expect(source).toMatch(/b,\s*strong\s*\{\s*font-weight:\s*bolder;/);
    expect(source).toContain('id="b-600"');
    expect(source).toContain('id="strong-700"');
  });

  it('R-004 T0 保留浏览器等宽字体字号偏好', () => {
    const source = readFixture('r004-native.html');
    expect(source).toContain('id="code"');
    expect(source).toContain('id="pre"');
    expect(source).not.toContain('font-size: 1em');
    expect(source).not.toContain('id="risk-review-only"');
  });

  it('R-004 风险对照与默认 Normalize 隔离', () => {
    const source = readFixture('r004-risk-review.html');
    expect(source).toContain('id="risk-review-only"');
    expect(source).toMatch(/code,\s*kbd,\s*samp,\s*pre\s*\{\s*font-size:\s*1em;/);
  });

  it('所有 Fixture 只读取数据，不依赖远程资源', () => {
    const files = ['r003-native.html', 'r003-candidate.html', 'r004-native.html', 'r004-risk-review.html'];
    for (const name of files) {
      const source = readFixture(name);
      expect(source).toContain('src="./probe.js"');
      expect(source).toContain('id="probe-output"');
      expect(source).not.toMatch(/https?:\/\//);
    }
  });
});
