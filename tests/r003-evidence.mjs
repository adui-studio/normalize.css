import { readEvidenceFile } from './evidence-file.mjs';
import { pathToFileURL } from 'node:url';

const WEIGHTS = [400, 600, 700];
const TAGS = ['b', 'strong'];
const EXPECTED_IDS = new Set(WEIGHTS.flatMap((weight) => TAGS.map((tag) => `${tag}-${weight}`)));

function requireText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${field} must be a nonempty string`);
  }
  return value;
}

function numericWeight(value, field) {
  if (value === 'bold') return 700;
  if (value === 'normal') return 400;
  if (typeof value !== 'string' || !/^\d{1,4}$/.test(value)) {
    throw new TypeError(`${field} must be a computed numeric font-weight`);
  }
  const weight = Number(value);
  if (weight < 1 || weight > 1000) {
    throw new RangeError(`${field} must be within the CSS font-weight range`);
  }
  return weight;
}

function validateFixture(evidence, role) {
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) {
    throw new TypeError(`${role} evidence must be a JSON object`);
  }
  const agent = requireText(evidence.userAgent, `${role}.userAgent`);
  const location = requireText(evidence.location, `${role}.location`);
  const expectedFile = role === 'native' ? 'r003-native.html' : 'r003-candidate.html';
  if (!location.endsWith(`/${expectedFile}`)) {
    throw new Error(`${role}.location must end in /${expectedFile}`);
  }
  if (!Array.isArray(evidence.rows) || evidence.rows.length !== EXPECTED_IDS.size) {
    throw new Error(`${role}.rows must contain exactly ${EXPECTED_IDS.size} entries`);
  }
  const seen = new Set();
  const rows = new Map();
  for (const row of evidence.rows) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new TypeError(`${role} row must be an object`);
    }
    if (!EXPECTED_IDS.has(row.id) || seen.has(row.id)) {
      throw new Error(`${role} contains unknown or duplicate row ID: ${String(row.id)}`);
    }
    seen.add(row.id);
    const [tag, weightText] = row.id.split('-');
    if (row.tagName !== tag) {
      throw new Error(`${role}.${row.id}.tagName must be ${tag}`);
    }
    const parent = numericWeight(row.parentFontWeight, `${role}.${row.id}.parentFontWeight`);
    if (parent !== Number(weightText)) {
      throw new Error(`${role}.${row.id} has unexpected parent font-weight ${parent}`);
    }
    const computed = numericWeight(row.fontWeight, `${role}.${row.id}.fontWeight`);
    const parentFontSize = requireText(row.parentFontSize, `${role}.${row.id}.parentFontSize`);
    const fontSize = requireText(row.fontSize, `${role}.${row.id}.fontSize`);
    const fontFamily = requireText(row.fontFamily, `${role}.${row.id}.fontFamily`);
    rows.set(row.id, { tag, parent, computed, parentFontSize, fontSize, fontFamily });
  }
  return { agent, rows };
}

/**
 * Compare two actual browser evidence exports. This does not prove UA origin,
 * font-file rendering, release authenticity, or framework compatibility.
 */
export function compareR003Evidence(nativeJson, candidateJson) {
  const baseline = validateFixture(nativeJson, 'native');
  const candidate = validateFixture(candidateJson, 'candidate');
  if (baseline.agent !== candidate.agent) {
    throw new Error('T0/T1 userAgent values differ; use the same browser build');
  }
  let differences = 0;
  let candidateFailures = 0;
  const rows = [];
  for (const weight of WEIGHTS) {
    for (const tag of TAGS) {
      const id = `${tag}-${weight}`;
      const before = baseline.rows.get(id);
      const after = candidate.rows.get(id);
      for (const key of ['parent', 'parentFontSize', 'fontSize', 'fontFamily']) {
        if (before[key] !== after[key]) {
          throw new Error(`${id}: T0/T1 ${key} differs; environments are not comparable`);
        }
      }
      const expectedCandidate = weight === 400 ? 700 : 900;
      const changed = before.computed !== after.computed;
      const candidateMatches = after.computed === expectedCandidate;
      if (changed) differences += 1;
      if (!candidateMatches) candidateFailures += 1;
      rows.push({ id, parentWeight: weight, nativeWeight: before.computed,
        candidateWeight: after.computed, expectedCandidate, changed, candidateMatches });
    }
  }
  return {
    userAgent: baseline.agent,
    status: candidateFailures ? 'CANDIDATE_MISMATCH' : differences ? 'COMPUTED_DIFFERENCE_OBSERVED' : 'NO_COMPUTED_DIFFERENCE',
    candidateFailures,
    differences,
    rows,
    limitations: [
      'Confirm the UA declaration origin in DevTools before calling a difference a browser defect.',
      'A computed weight does not prove that a matching physical font face was rendered.',
      'This does not verify target browser release authenticity or UI framework compatibility.',
    ],
  };
}

function readEvidence(path) {
  return readEvidenceFile(path);
}

function main() {
  if (process.argv.length !== 4) {
    console.error('Usage: node tests/r003-evidence.mjs <r003-native.json> <r003-candidate.json>');
    process.exitCode = 2;
    return;
  }
  try {
    const report = compareR003Evidence(readEvidence(process.argv[2]), readEvidence(process.argv[3]));
    console.log(JSON.stringify(report, null, 2));
    if (report.candidateFailures) process.exitCode = 1;
  } catch (error) {
    console.error(`R-003 evidence invalid: ${error.message}`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
