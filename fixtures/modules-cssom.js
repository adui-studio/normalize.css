// 仅用于浏览器 Fixture；不作为 npm 运行时脚本发布。
export function inspectModuleStylesheet(sheet) {
  if (!sheet) return null;
  const rules = [];
  const visited = new Set();

  function visit(group) {
    if (!group || visited.has(group)) return;
    visited.add(group);
    for (const rule of group.cssRules) {
      if (rule.selectorText && rule.style) rules.push(rule);
      if (rule.styleSheet) visit(rule.styleSheet);
      if (rule.cssRules) visit(rule);
    }
  }

  try {
    visit(sheet);
  } catch (error) {
    return { complete: false, error: error.name };
  }

  const includes = (selector, property, value) =>
    rules.some(
      (rule) =>
        rule.selectorText.includes(selector) && rule.style.getPropertyValue(property).trim() === value,
    );
  const modules = {
    normalize: includes("strong", "font-weight", "bolder"),
    reset: includes("::before", "box-sizing", "border-box"),
    forms: includes("textarea", "font", "inherit"),
    a11y: includes(":focus-visible", "outline-offset", "2px"),
  };
  return { ...modules, complete: Object.values(modules).every(Boolean), error: null };
}
