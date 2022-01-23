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

export function hexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0;

  if (h.length === 4) {
    // 3 digits
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
  } else if (h.length === 7) {
    // 6 digits
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return +r + ", " + +g + ", " + +b;
}
