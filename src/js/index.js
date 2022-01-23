function combineTwoClasses(classes, newClass) {
  const space = classes.length ? " " : "";
  return `${classes}${space}${newClass}`;
}

export function combineClasses(...classes) {
  return classes.reduce((acc, c) => (c ? combineTwoClasses(acc, c) : acc), "");
}

export function isObject(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

export function isNumber(x) {
  return !isNaN(Number(x)) && !isNaN(parseInt(x, 10));
}

export function areEqual(val1, val2) {
  if (isObject(val1) || isObject(val2)) {
    if (!isObject(val1) || !isObject(val2)) {
      return false;
    }

    const keys1 = Object.keys(val1);
    const keys2 = Object.keys(val2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((val, i) => areEqual(val1[val], val2[val]));
  }

  if (Array.isArray(val1) || Array.isArray(val2)) {
    if (!Array.isArray(val1) || !Array.isArray(val2)) {
      return false;
    }

    if (val1.length !== val2.length) {
      return false;
    }

    return val1.every((val, i) => areEqual(val, val2[i]));
  }

  if (isNumber(val1) && isNumber(val2)) {
    return Number(val1) === Number(val2);
  }

  return val1 === val2;
}

export function findElementWithDataAttribute(element, attribute) {
  if (!element) {
    return null;
  }

  let target = element.target || element;

  while (target && !target.dataset?.hasOwnProperty(attribute)) {
    target = target.parentNode;
  }

  return target?.dataset ? target : null;
}

export function findDataAttribute(element, attribute) {
  const ele = findElementWithDataAttribute(element, attribute);
  return ele?.dataset[attribute] || null;
}

export function stopProp(e) {
  e.stopPropagation();
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

const subscriptions = {};
export function handleBodyClick() {
  Object.values(subscriptions).forEach((cb) => cb());
}

export function addSubscription(key, cb) {
  subscriptions[key] = cb;
  return () => delete subscriptions[key];
}

export function removeSubscription(key) {
  delete subscriptions[key];
}
