import { inspectModuleStylesheet } from "./modules-cssom.js";

// 仅供本地浏览器 Fixture，绝不作为 npm 运行时脚本分发。
const properties = {
  "module-heading": ["marginBlockStart", "marginBlockEnd", "fontSize", "fontWeight"],
  "module-paragraph": ["marginBlockStart", "marginBlockEnd"],
  "module-list": ["marginBlockStart", "marginBlockEnd", "paddingInlineStart"],
  "module-box": ["boxSizing"],
  "module-svg": ["maxInlineSize", "inlineSize"],
  "module-table": ["borderCollapse", "borderSpacing", "borderTopColor"],
  "module-button": ["fontFamily", "fontSize", "margin", "appearance"],
  "module-input": ["fontFamily", "fontSize", "margin", "appearance"],
  "module-select": ["fontFamily", "fontSize", "margin", "appearance"],
  "module-textarea": ["fontFamily", "fontSize", "margin", "appearance"],
  "module-checkbox": ["boxSizing", "appearance"],
  "module-radio": ["boxSizing", "appearance"],
  "module-fieldset": ["minInlineSize"],
  "module-legend": ["paddingInlineStart", "paddingInlineEnd"],
  "module-details": ["display"],
  "module-hidden": ["display"],
};

function sample(id, names) {
  const element = document.getElementById(id);
  if (!element) return null;
  const style = getComputedStyle(element);
  return Object.fromEntries(names.map((name) => [name, style[name]]));
}

function capture() {
  const link = document.getElementById("modules-css");
  const focused = document.activeElement;
  const focusStyle = focused ? getComputedStyle(focused) : null;
  const result = {
    userAgent: navigator.userAgent,
    location: window.location.pathname,
    pageProtocol: window.location.protocol,
    capturedAt: new Date().toISOString(),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
    stylesheet: link
      ? {
          href: link.getAttribute("href"),
          loaded: link.sheet !== null,
          cssom: inspectModuleStylesheet(link.sheet),
        }
      : null,
    media: {
      forcedColors: matchMedia("(forced-colors: active)").matches,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    },
    rootScrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    focus: {
      id: focused?.id || null,
      focusVisible: focused?.matches(":focus-visible") ?? false,
      outlineWidth: focusStyle?.outlineWidth ?? null,
      outlineStyle: focusStyle?.outlineStyle ?? null,
      outlineColor: focusStyle?.outlineColor ?? null,
      outlineOffset: focusStyle?.outlineOffset ?? null,
    },
    styles: Object.fromEntries(
      Object.entries(properties).map(([id, names]) => [id, sample(id, names)]),
    ),
  };
  document.getElementById("module-output").textContent = JSON.stringify(result, null, 2);
  return result;
}

document.getElementById("show-dialog").addEventListener("click", () => {
  document.getElementById("module-dialog").showModal();
  requestAnimationFrame(capture);
});
for (const event of ["focusin", "focusout", "change", "toggle", "close"]) {
  document.addEventListener(event, () => requestAnimationFrame(capture), true);
}
document.getElementById("module-export").addEventListener("click", () => {
  const evidence = capture();
  const data = new Blob([JSON.stringify(evidence, null, 2) + "\n"], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  const role = evidence.stylesheet === null ? "m0" : "m1";
  link.href = url;
  link.download = `adui-modules-${role}-${evidence.capturedAt.replace(/[:.]/g, "-")}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
});
window.__aduiModuleCapture = capture;
capture();
