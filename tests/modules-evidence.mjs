import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

function record(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
  return value;
}

function validate(value, role) {
  const data = record(value, role);
  const path = role === "M0" ? "/fixtures/modules-native.html" : "/fixtures/modules-all.html";
  if (data.location !== path) throw new Error(`${role}.location must be ${path}`);
  if (typeof data.userAgent !== "string" || !data.userAgent.trim()) {
    throw new TypeError(`${role}.userAgent must be a non-empty string`);
  }
  if (typeof data.pageProtocol !== "string") {
    throw new TypeError(`${role}.pageProtocol must be a string`);
  }
  record(data.media, `${role}.media`);
  for (const key of ["reducedMotion", "forcedColors"]) {
    if (typeof data.media[key] !== "boolean") {
      throw new TypeError(`${role}.media.${key} must be boolean`);
    }
  }
  record(data.styles, `${role}.styles`);
  for (const key of [
    "module-box",
    "module-table",
    "module-button",
    "module-input",
    "module-select",
    "module-textarea",
    "module-hidden",
  ]) {
    record(data.styles[key], `${role}.styles.${key}`);
  }
  if (typeof data.rootScrollBehavior !== "string") {
    throw new TypeError(`${role}.rootScrollBehavior must be a string`);
  }
  if (role === "M0" && data.stylesheet !== null) {
    throw new Error("M0 must not load a modules stylesheet");
  }
  if (role === "M1") {
    const css = record(data.stylesheet, "M1.stylesheet");
    if (css.href !== "../src/all.css" || typeof css.loaded !== "boolean") {
      throw new Error("M1 must report the expected all.css link and a boolean loaded flag");
    }
    if (css.cssom !== null) record(css.cssom, "M1.stylesheet.cssom");
  }
  return data;
}

/** Static M0/M1 checks only. Browser interactions and system preferences require manual evidence. */
export function compareModuleEvidence(nativeJson, allJson) {
  const native = validate(nativeJson, "M0");
  const all = validate(allJson, "M1");
  const checks = [];
  const check = (name, passed, description) => {
    checks.push({ name, passed: Boolean(passed), ...(passed ? {} : { description }) });
  };

  check("same-user-agent", native.userAgent === all.userAgent, "两份证据的 userAgent 不一致");
  check(
    "same-http-environment",
    ["http:", "https:"].includes(native.pageProtocol) && native.pageProtocol === all.pageProtocol,
    "两页必须通过相同的 HTTP(S) 协议访问，不能使用 file://",
  );
  check(
    "same-media-preferences",
    native.media.reducedMotion === all.media.reducedMotion &&
      native.media.forcedColors === all.media.forcedColors,
    "两页的系统媒体偏好不一致；请在相同设置下重新采样",
  );
  check("native-without-module-css", native.stylesheet === null, "M0 必须不加载可选模块");
  check("all-css-loaded", all.stylesheet.loaded === true, "M1 all.css 样式表尚未加载");
  const modules = all.stylesheet.cssom;
  for (const key of ["normalize", "reset", "forms", "a11y"]) {
    check(`cssom-${key}`, modules?.[key] === true, `M1 CSSOM 缺少 ${key} 模块代表声明`);
  }
  check(
    "cssom-complete",
    modules?.complete === true && modules?.error === null,
    "M1 CSSOM 未完整读取",
  );
  check(
    "reset-box-sizing",
    all.styles["module-box"].boxSizing === "border-box",
    "Reset 盒模型应为 border-box",
  );
  check(
    "reset-table",
    all.styles["module-table"].borderCollapse === "collapse",
    "Reset 表格应采用 collapse",
  );
  for (const key of ["module-button", "module-input", "module-select", "module-textarea"]) {
    check(`forms-${key}`, all.styles[key].fontSize === "18px", `${key} 应继承作者区域的 18px 字号`);
  }
  check(
    "native-hidden-preserved",
    native.styles["module-hidden"].display === "none" &&
      all.styles["module-hidden"].display === "none",
    "原生 hidden 元素在 M0/M1 都应保持隐藏",
  );
  check(
    "native-scroll-behavior",
    native.rootScrollBehavior === "smooth",
    "M0 应保持作者声明的 smooth",
  );
  check(
    "a11y-reduced-motion",
    all.rootScrollBehavior === (all.media.reducedMotion ? "auto" : "smooth"),
    "M1 应在减少动态效果时改为 auto，其余情况保持 smooth",
  );
  const failures = checks.filter((item) => !item.passed);
  return {
    status: failures.length ? "PROBE_FAIL" : "PROBE_PASS",
    checked: checks.length,
    failed: failures.length,
    issues: failures.map((item) => `${item.name}: ${item.description}`),
    checks,
    limitations: [
      "PROBE_PASS 只表示有限的静态 CSSOM 与计算样式检查通过，不能证明真实交互或跨浏览器兼容。",
      "键盘 Tab、焦点可见性、Details、Dialog、表单输入、系统偏好切换与 Network 请求需要人工另行验证。",
      "JSON 来自采样页面，未包含可验证的独立浏览器构建号或原始 HTTP 响应真实性证明。",
    ],
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 4) {
    console.error("用法: node tests/modules-evidence.mjs <M0.json> <M1.json>");
    process.exitCode = 2;
  } else {
    try {
      const native = JSON.parse(readFileSync(resolve(process.argv[2]), "utf8"));
      const all = JSON.parse(readFileSync(resolve(process.argv[3]), "utf8"));
      const result = compareModuleEvidence(native, all);
      console.log(JSON.stringify(result, null, 2));
      if (result.status !== "PROBE_PASS") process.exitCode = 1;
    } catch (error) {
      console.error(error.message);
      process.exitCode = 2;
    }
  }
}
