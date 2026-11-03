import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareR003Evidence } from './r003-evidence.mjs';

const weights = [400, 600, 700];
const tags = ['b', 'strong'];

function makeEvidence(role, weightFor = ({ weight }) => weight === 400 ? 700 : 900) {
  return {
    userAgent: 'Synthetic Test Browser/1 (not a real UA test)',
    location: `/fixtures/r003-${role === 'native' ? 'native' : 'candidate'}.html`,
    rows: weights.flatMap((weight) => tags.map((tag) => ({
      id: `${tag}-${weight}`,
      tagName: tag,
      parentFontWeight: String(weight),
      fontWeight: String(weightFor({ tag, weight })),
      parentFontSize: '16px',
      fontSize: '16px',
      fontFamily: 'serif',
    }))),
  };
}

test('compares a synthetic old-UA weight difference without claiming a browser pass', () => {
  const native = makeEvidence('native', () => 700);
  const candidate = makeEvidence('candidate');
  const report = compareR003Evidence(native, candidate);
  assert.equal(report.differences, 4);
  assert.equal(report.candidateFailures, 0);
  assert.equal(report.status, 'COMPUTED_DIFFERENCE_OBSERVED');
  assert.equal(report.rows.find((row) => row.id === 'strong-700').candidateWeight, 900);
  assert.match(report.limitations[0], /DevTools/);
});

test('does not invent a difference when synthetic UA values already match', () => {
  const report = compareR003Evidence(makeEvidence('native'), makeEvidence('candidate'));
  assert.equal(report.status, 'NO_COMPUTED_DIFFERENCE');
  assert.equal(report.differences, 0);
});

test('reports a candidate mismatch instead of silently passing', () => {
  const candidate = makeEvidence('candidate', () => 700);
  const report = compareR003Evidence(makeEvidence('native', () => 700), candidate);
  assert.equal(report.status, 'CANDIDATE_MISMATCH');
  assert.equal(report.candidateFailures, 4);
});

test('rejects mixed browser builds and wrong T0/T1 page roles', () => {
  const native = makeEvidence('native');
  const candidate = makeEvidence('candidate');
  candidate.userAgent = 'Another Build';
  assert.throws(() => compareR003Evidence(native, candidate), /userAgent values differ/);
  candidate.userAgent = native.userAgent;
  candidate.location = '/fixtures/r003-native.html';
  assert.throws(() => compareR003Evidence(native, candidate), /candidate.location/);
});

test('rejects missing/duplicate measurement IDs and inconsistent parents', () => {
  const native = makeEvidence('native');
  const candidate = makeEvidence('candidate');
  native.rows[0].id = native.rows[2].id;
  native.rows[0].parentFontWeight = '600';
  assert.throws(() => compareR003Evidence(native, candidate), /duplicate row ID/);
  native.rows[0].id = 'b-400';
  native.rows[0].parentFontWeight = '700';
  assert.throws(() => compareR003Evidence(native, candidate), /unexpected parent font-weight/);
});

test('refuses samples with incompatible font context or missing computed values', () => {
  const native = makeEvidence('native');
  const candidate = makeEvidence('candidate');
  candidate.rows[0].fontFamily = 'another font';
  assert.throws(() => compareR003Evidence(native, candidate), /fontFamily differs/);
  candidate.rows[0].fontFamily = native.rows[0].fontFamily;
  candidate.rows[0].fontWeight = '';
  assert.throws(() => compareR003Evidence(native, candidate), /computed numeric font-weight/);
});

function runCli(native, candidate) {
  const dir = mkdtempSync(join(tmpdir(), 'adui-r003-evidence-'));
  try {
    const nativePath = join(dir, 'native.json');
    const candidatePath = join(dir, 'candidate.json');
    writeFileSync(nativePath, JSON.stringify(native));
    writeFileSync(candidatePath, JSON.stringify(candidate));
    return spawnSync(process.execPath, [fileURLToPath(new URL('./r003-evidence.mjs', import.meta.url)), nativePath, candidatePath], {
      encoding: 'utf8',
      timeout: 10_000,
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('CLI reads two synthetic exports and prints structured evidence JSON', () => {
  const result = runCli(makeEvidence('native', () => 700), makeEvidence('candidate'));
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.differences, 4);
  assert.equal(report.status, 'COMPUTED_DIFFERENCE_OBSERVED');
});

test('CLI returns a failing exit status if a synthetic candidate does not fix the comparison', () => {
  const result = runCli(makeEvidence('native', () => 700), makeEvidence('candidate', () => 700));
  assert.equal(result.status, 1, result.stderr);
  assert.equal(JSON.parse(result.stdout).candidateFailures, 4);
});
