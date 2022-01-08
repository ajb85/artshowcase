function combineTwoClasses(classes, newClass) {
  const space = classes.length ? " " : "";
  return `${classes}${space}${newClass}`;
}

export function combineClasses(...classes) {
  return classes.reduce((acc, c) => (c ? combineTwoClasses(acc, c) : acc), "");
}

export function copyToClipboard(value) {
  navigator.clipboard.writeText(value);
}

export function getLookupByProp(prop) {
  return (arr) =>
    arr.reduce((acc, cur) => {
      acc[cur[prop]] = cur;
      return acc;
    }, {});
}

export const getLookupByID = getLookupByProp("id");
