import { pathToFileURL } from "node:url";
import { readEvidenceFile } from "./evidence-file.mjs";

const WEIGHTS = [400, 600, 700];
const TAGS = ["b", "strong"];
const MONO = ["code", "kbd", "samp", "pre"];
const IDS = [
  ...WEIGHTS.flatMap((weight) => TAGS.map((tag) => tag + "-" + weight)),
  ...MONO,
  "abbr-title",
  "table-border",
  "abbr-plain",
  "abbr-author",
  "table-author",
];

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(label + " must be an object");
  }
  return value;
}

function text(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(label + " must be a nonempty string");
  }
  return value;
}

function weight(value, label) {
  if (value === "normal") return 400;
  if (value === "bold") return 700;
  if (typeof value !== "string" || !/^\d{1,4}$/.test(value)) {
    throw new TypeError(label + " must be a computed font-weight");
  }
  const number = Number(value);
  if (number < 1 || number > 1000) throw new RangeError(label + " weight out of range");
  return number;
}

function validate(input, role) {
  const data = object(input, role);
  const userAgent = text(data.userAgent, role + ".userAgent");
  const expected = role === "native" ? "/fixtures/t2-native.html" : "/fixtures/t2-package.html";
  if (data.location !== expected) throw new Error(role + ".location must equal " + expected);
  if (role === "native") {
    if (Object.hasOwn(data, "packageStylesheet"))
      throw new Error("T0 must not include packageStylesheet");
  } else {
    const stylesheet = object(data.packageStylesheet, "T2.packageStylesheet");
    if (stylesheet.href !== "../dist/normalize.css" || typeof stylesheet.loaded !== "boolean") {
      throw new Error("T2 must report the packed CSS href and boolean loaded flag");
    }
    if (
      !Object.hasOwn(stylesheet, "rules") ||
      (stylesheet.rules !== null && !Array.isArray(stylesheet.rules))
    ) {
      throw new Error("T2 must include CSSOM rules (array or null if unavailable)");
    }
  }
  if (!Array.isArray(data.rows) || data.rows.length !== IDS.length) {
    throw new Error(role + ".rows must contain exactly 15 probes");
  }
  const rows = new Map();
  for (const raw of data.rows) {
    const item = object(raw, role + ".row");
    const id = text(item.id, role + ".row.id");
    if (!IDS.includes(id) || rows.has(id))
      throw new Error(role + " unknown or duplicate probe: " + id);
    const tag = id.startsWith("strong-")
      ? "strong"
      : id.startsWith("b-")
        ? "b"
        : id.startsWith("abbr-")
          ? "abbr"
          : id.startsWith("table-")
            ? "table"
            : id;
    if (item.tagName !== tag) throw new Error(role + "." + id + " wrong tagName");
    const parent = weight(item.parentFontWeight, role + "." + id + ".parentFontWeight");
    if ((tag === "b" || tag === "strong") && parent !== Number(id.split("-")[1])) {
      throw new Error(role + "." + id + " wrong parent weight");
    }
    rows.set(id, {
      parent,
      weight: weight(item.fontWeight, role + "." + id + ".fontWeight"),
      parentFontSize: text(item.parentFontSize, role + "." + id + ".parentFontSize"),
      fontSize: text(item.fontSize, role + "." + id + ".fontSize"),
      fontFamily: text(item.fontFamily, role + "." + id + ".fontFamily"),
      ...(tag === "abbr"
        ? {
            textDecorationLine: text(
              item.textDecorationLine,
              role + "." + id + ".textDecorationLine",
            ),
            textDecorationStyle: text(
              item.textDecorationStyle,
              role + "." + id + ".textDecorationStyle",
            ),
          }
        : {}),
      ...(tag === "table"
        ? {
            color: text(item.color, role + "." + id + ".color"),
            borderTopColor: text(item.borderTopColor, role + "." + id + ".borderTopColor"),
          }
        : {}),
    });
  }
  return {
    userAgent,
    rows,
    loaded: role === "package" ? data.packageStylesheet.loaded : null,
    rules: role === "package" ? data.packageStylesheet.rules : null,
  };
}

/** Compares T0/T2 static probes; PROBE_PASS is not a full browser-support guarantee. */
export function compareT2Evidence(nativeJson, packageJson) {
  const native = validate(nativeJson, "native");
  const packed = validate(packageJson, "package");
  if (native.userAgent !== packed.userAgent) throw new Error("T0/T2 userAgent differs");
  const issues = [];
  const rows = [];
  let weightDifferences = 0;
  for (const id of IDS) {
    const before = native.rows.get(id);
    const after = packed.rows.get(id);
    for (const field of ["parent", "parentFontSize", "fontSize", "fontFamily"]) {
      if (before[field] !== after[field]) issues.push(id + ": " + field + " changed");
    }
    let expectedWeight;
    if (id.startsWith("b-") || id.startsWith("strong-")) {
      expectedWeight = before.parent === 400 ? 700 : 900;
      if (after.weight !== expectedWeight) {
        issues.push(id + ": expected bolder weight " + expectedWeight + ", got " + after.weight);
      }
      if (before.weight !== after.weight) weightDifferences += 1;
    } else if (before.weight !== after.weight) {
      issues.push(id + ": font-weight changed unexpectedly");
    }
    if (
      id === "abbr-title" &&
      (after.textDecorationLine !== "underline" || after.textDecorationStyle !== "dotted")
    ) {
      issues.push("R-007: abbr[title] must have a dotted underline");
    }
    if (id === "table-border" && after.borderTopColor !== after.color) {
      issues.push("R-008: table border color must match currentColor");
    }
    if (
      id === "abbr-plain" &&
      (before.textDecorationLine !== after.textDecorationLine ||
        before.textDecorationStyle !== after.textDecorationStyle)
    ) {
      issues.push("R-007: abbr without title must preserve native decoration");
    }
    if (
      id === "abbr-author" &&
      (before.textDecorationLine !== "overline" ||
        before.textDecorationStyle !== "solid" ||
        after.textDecorationLine !== before.textDecorationLine ||
        after.textDecorationStyle !== before.textDecorationStyle)
    ) {
      issues.push("R-007: explicit author abbreviation style must take precedence");
    }
    if (
      id === "table-author" &&
      (before.color !== "rgb(20, 40, 60)" ||
        before.borderTopColor !== "rgb(120, 80, 40)" ||
        after.color !== before.color ||
        after.borderTopColor !== before.borderTopColor)
    ) {
      issues.push("R-008: explicit author table colors must take precedence");
    }
    rows.push({
      id,
      nativeWeight: before.weight,
      packageWeight: after.weight,
      ...(expectedWeight === undefined ? {} : { expectedWeight }),
      changed: before.weight !== after.weight,
    });
  }
  const rules = packed.rules;
  const expectedRules = [
    ["b,strong", "font-weight", "bolder"],
    [":where(abbr[title])", "text-decoration", "underline dotted"],
    [":where(table)", "border-color", "currentcolor"],
  ];
  const contentMatches = Boolean(
    Array.isArray(rules) &&
    rules.length === expectedRules.length &&
    rules.every((rule, index) => {
      const [selector, name, value] = expectedRules[index];
      return (
        rule &&
        rule.type === 1 &&
        typeof rule.selector === "string" &&
        rule.selector.replace(/\s+/g, "").toLowerCase() === selector &&
        Array.isArray(rule.declarations) &&
        rule.declarations.length === 1 &&
        rule.declarations[0]?.name === name &&
        typeof rule.declarations[0]?.value === "string" &&
        rule.declarations[0].value.trim().replace(/\s+/g, " ").toLowerCase() === value &&
        rule.declarations[0].priority === ""
      );
    }),
  );
  if (!packed.loaded) {
    issues.unshift("T2 packed stylesheet is not loaded");
  } else if (!contentMatches) {
    issues.unshift("T2 CSSOM must contain only the three approved R-003/R-007/R-008 rules");
  }
  return {
    userAgent: native.userAgent,
    status: !packed.loaded
      ? "STYLESHEET_NOT_LOADED"
      : !contentMatches
        ? "STYLESHEET_CONTENT_MISMATCH"
        : issues.length
          ? "STYLE_MISMATCH"
          : "PROBE_PASS",
    stylesheetLoaded: packed.loaded,
    stylesheetContentMatches: contentMatches,
    weightDifferences,
    issues,
    rows,
    limitations: [
      "PROBE_PASS checks recorded styles and local parsed CSSOM, not actual browser identity, response bytes or network integrity.",
      "Record full browser/OS versions, CSS Network response, native interactions and accessibility separately.",
      "Do not extrapolate this result to other browsers or to the complete support matrix.",
    ],
  };
}

function main() {
  if (process.argv.length !== 4) {
    console.error("Usage: node tests/t2-evidence.mjs <t2-native.json> <t2-package.json>");
    process.exitCode = 2;
    return;
  }
  try {
    const report = compareT2Evidence(
      readEvidenceFile(process.argv[2]),
      readEvidenceFile(process.argv[3]),
    );
    console.log(JSON.stringify(report, null, 2));
    if (report.status !== "PROBE_PASS") process.exitCode = 1;
  } catch (error) {
    console.error("T0/T2 evidence invalid: " + error.message);
    process.exitCode = 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
