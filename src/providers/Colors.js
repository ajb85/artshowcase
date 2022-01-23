import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";

import { hexToRGB } from "js";

const context = createContext();
const { Provider } = context;

export const colorKeys = [
  { displayName: "Main Logo Color", name: "logo-main", default: "#ff00ff" },
  { displayName: "Logo Outline", name: "logo-stroke", default: "#FFF" },
  { displayName: "Logo Shadow", name: "logo-shadow", default: "#000" },
  { displayName: "Background Color", name: "background", default: "#404040" },
  { displayName: "Loading Icon", name: "loading-icon", default: "#ff00ff" },
  { displayName: "Loading Text", name: "loading-text", default: "#f0e7e7" },
];

const root = document.documentElement;

function updateCSSColors(colorTheme) {
  console.log("COLOR THEME: ", colorTheme);
  try {
    const { name, preset, ...colors } = colorTheme;
    for (let category in colors) {
      const cssVar = `--${category}`;
      root.style.setProperty(cssVar, colors[category]);

      const rgbVar = `${cssVar}-rgb`;
      root.style.setProperty(rgbVar, hexToRGB(colors[category]));
      localStorage.setItem("colors", JSON.stringify(colorTheme));
    }
  } catch (err) {}
}

const lastColors = getColorsFromStorage();
lastColors && updateCSSColors(lastColors);

export default function ColorThemesProvider(props) {
  const [colors, setColors] = useState(lastColors);
  const [isLoading] = useState(false);

  const getColors = useCallback(
    (value) => colors[camelToHyphenCase(value)],
    [colors]
  );

  const value = {
    get: getColors,
    isLoading,
  };
  return <Provider value={value}>{props.children}</Provider>;
}

export function useColors() {
  return useContext(context);
}

function getColorsFromStorage() {
  const lastColorsStr = localStorage.getItem("colors");
  try {
    if (!lastColorsStr) {
      throw "no colors";
    }
    return JSON.parse(lastColorsStr);
  } catch (err) {
    return colorKeys.reduce((acc, cur) => {
      acc[cur.name] = cur.default;
      return acc;
    }, {});
  }
}

function camelToHyphenCase(str) {
  return str
    .split("")
    .reduce(
      (acc, cur) =>
        acc + (cur === cur.toUpperCase() ? `-${cur.toLowerCase()}` : cur),
      ""
    );
}
