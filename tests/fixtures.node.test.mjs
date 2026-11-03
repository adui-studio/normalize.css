import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

const read = (name) => readFileSync(new URL(`../fixtures/${name}`, import.meta.url), 'utf8');
const fixtureNames = [
  'r003-native.html',
  'r003-candidate.html',
  'r004-native.html',
  'r004-risk-review.html',
];

const ids = (markup) => [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const measuredIds = (markup) => [...markup.matchAll(/\bid="([^"]+)"\s+data-probe\b/g)].map((match) => match[1]).sort();
const cssFor = (markup, id) => {
  const block = markup.match(new RegExp(`<style id="${id}">([\\s\\S]*?)<\\/style>`));
  assert.ok(block, `Missing style block ${id}`);
  return block[1].replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, '');
};

test('every fixture has unique probe IDs and only uses local probe resources', () => {
  for (const name of fixtureNames) {
    const markup = read(name);
    const values = ids(markup);
    assert.equal(new Set(values).size, values.length, `${name}: duplicate IDs`);
    assert.match(markup, /<script type="module" src="\.\/probe\.js"><\/script>/);
    assert.match(markup, /<pre id="probe-output" aria-live="polite">/);
    assert.doesNotMatch(markup, /(?:src|href)="https?:\/\//i);
    assert.ok(values.includes('probe-output'));
  }
});

test('R-003 native and candidate pages measure identical elements', () => {
  const native = read('r003-native.html');
  const candidate = read('r003-candidate.html');
  assert.deepEqual(measuredIds(native), measuredIds(candidate));
  for (const weight of [400, 600, 700]) {
    assert.match(native, new RegExp(`class="weight-${weight}"`));
    assert.match(native, new RegExp(`id="b-${weight}" data-probe`));
    assert.match(native, new RegExp(`id="strong-${weight}" data-probe`));
  }
  assert.doesNotMatch(native, /id="candidate-rule"|font-weight:\s*bolder/);
  assert.equal(cssFor(candidate, 'candidate-rule'), 'b,strong{font-weight:bolder;}');
});

test('R-004 risk style remains isolated from native typography fixture', () => {
  const native = read('r004-native.html');
  const risk = read('r004-risk-review.html');
  assert.deepEqual(measuredIds(native), measuredIds(risk));
  assert.doesNotMatch(native, /<style\b|font-size:\s*1em/);
  assert.equal(cssFor(risk, 'risk-review-only'), 'code,kbd,samp,pre{font-size:1em;}');
});

test('fixture landing page links to every existing local test page', () => {
  const index = read('index.html');
  for (const name of fixtureNames) {
    assert.ok(index.includes(`href="./${name}"`), `Missing link: ${name}`);
    assert.ok(existsSync(new URL(`../fixtures/${name}`, import.meta.url)));
  }
});
