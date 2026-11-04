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
  };
});

const evidence = {
  userAgent: navigator.userAgent,
  location: window.location.pathname,
  rows,
};

// T2 只记录实际 CSS 是否被浏览器挂载；不改变测量节点或样式。
const packageLink = document.getElementById("package-css");
if (packageLink) {
  evidence.packageStylesheet = {
    href: packageLink.getAttribute("href"),
    loaded: packageLink.sheet !== null,
  };
}

document.getElementById("probe-output").textContent = JSON.stringify(evidence, null, 2);
document.documentElement.dataset.probeStatus = "complete";
