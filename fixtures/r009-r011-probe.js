// 仅用于本地 R-009/R-011 浏览器 Fixture，不随 npm CSS 包发布。
const hrIds = [
  "hr-plain",
  "hr-size-one",
  "hr-size-four",
  "hr-noshade",
  "hr-color-width",
  "hr-author",
];
const summaryIds = ["summary-closed", "summary-open", "summary-author", "summary-marker"];

function markerContent(element) {
  try {
    return getComputedStyle(element, "::marker")?.content ?? null;
  } catch {
    // 旧引擎可能无法读取 ::marker：保留 null，不中止其它样本采集。
    return null;
  }
}

function sample(id) {
  const element = document.getElementById(id);
  const style = getComputedStyle(element);
  return {
    id,
    tagName: element.tagName.toLowerCase(),
    display: style.display,
    boxSizing: style.boxSizing,
    height: style.height,
    width: style.width,
    renderedHeight: element.getBoundingClientRect().height,
    overflow: style.overflow,
    borderTopWidth: style.borderTopWidth,
    borderBottomWidth: style.borderBottomWidth,
    borderTopStyle: style.borderTopStyle,
    marginBlockStart: style.marginBlockStart,
    marginBlockEnd: style.marginBlockEnd,
    listStyleType: style.listStyleType,
    listStylePosition: style.listStylePosition,
    color: style.color,
    markerContent: markerContent(element),
    detailsOpen: element.closest("details")?.open ?? null,
  };
}

function capture() {
  const link = document.getElementById("package-css");
  const focused = document.activeElement;
  const result = {
    userAgent: navigator.userAgent,
    location: window.location.pathname,
    protocol: window.location.protocol,
    stylesheet: link ? { href: link.getAttribute("href"), loaded: link.sheet !== null } : null,
    focus: {
      id: focused?.id || null,
      focusVisible: focused?.matches(":focus-visible") ?? false,
    },
    hr: hrIds.map(sample),
    summary: summaryIds.map(sample),
    detailsFallbackOpen: document.getElementById("details-fallback").open,
  };
  document.getElementById("r009-r011-output").textContent = JSON.stringify(result, null, 2);
  return result;
}

document.addEventListener("keyup", () => requestAnimationFrame(capture), true);
document.addEventListener("focusin", () => requestAnimationFrame(capture), true);
document.addEventListener("toggle", () => requestAnimationFrame(capture), true);
window.__aduiR009R011Capture = capture;
capture();
