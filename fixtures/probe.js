// 本模块仅用于本地浏览器 Fixture。它不会进入任何 npm CSS 发布产物。
const rows = [...document.querySelectorAll("[data-probe]")].map((element) => {
  const style = getComputedStyle(element);
  const parentStyle = getComputedStyle(element.parentElement);

  return {
    id: element.id,
    tagName: element.tagName.toLowerCase(),
    parentFontWeight: parentStyle.fontWeight,
    fontWeight: style.fontWeight,
    parentFontSize: parentStyle.fontSize,
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    textDecorationLine: style.textDecorationLine,
    textDecorationStyle: style.textDecorationStyle,
    borderTopColor: style.borderTopColor,
    color: style.color,
  };
});

const evidence = {
  userAgent: navigator.userAgent,
  location: window.location.pathname,
  rows,
};

// T2 仅检查同源 CSSOM，不改变任何被测样式或交互节点。
const packageLink = document.getElementById("package-css");
if (packageLink) {
  const sheet = packageLink.sheet;
  let rules = null;
  if (sheet) {
    try {
      rules = Array.from(sheet.cssRules, (rule) => ({
        type: rule.type,
        selector: rule.selectorText ?? null,
        declarations: rule.style
          ? Array.from(rule.style, (name) => ({
              name,
              value: rule.style.getPropertyValue(name),
              priority: rule.style.getPropertyPriority(name),
            }))
          : null,
      }));
    } catch {
      // CSSOM 可能因访问限制不可读：保留 null 证据，不误判通过。
    }
  }
  evidence.packageStylesheet = {
    href: packageLink.getAttribute("href"),
    loaded: sheet !== null,
    rules,
  };
}

document.getElementById("probe-output").textContent = JSON.stringify(evidence, null, 2);
document.documentElement.dataset.probeStatus = "complete";
