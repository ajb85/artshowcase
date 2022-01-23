import {
  useState,
  createContext,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import axios from "axios";

import { hexToRGB } from "js";
import { useText } from "./Text";

const context = createContext();
const { Provider } = context;

export const colorKeys = [
  { name: "logo-main", default: "#ff00ff" },
  { name: "logo-stroke", default: "#FFF" },
  { name: "logo-shadow", default: "#000" },
  { name: "background", default: "#404040" },
  { name: "loading-icon", default: "#ff00ff" },
  { name: "loading-icon-stroke", default: "#ff00ff" },
  { name: "loading-text", default: "#f0e7e7" },
];

const root = document.documentElement;

function updateCSSColors(colorTheme, shouldSave = true) {
  try {
    const { name, preset, ...colors } = colorTheme;
    for (let category in colors) {
      const cssVar = `--${category}`;
      root.style.setProperty(cssVar, colors[category]);

      const rgbVar = `${cssVar}-rgb`;
      root.style.setProperty(rgbVar, hexToRGB(colors[category]));
      shouldSave && localStorage.setItem("colors", JSON.stringify(colorTheme));
    }
  } catch (err) {}
}

const lastColors = getColorsFromStorage();
lastColors && updateCSSColors(lastColors);

export default function ColorThemesProvider(props) {
  const { setText } = useText();
  const [colors, setColors] = useState(lastColors);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchCount = useRef(0);

  const getColors = useCallback(
    (value) => (value ? colors[camelToHyphenCase(value)] : colors),
    [colors]
  );

  const resetColors = useCallback(() => {
    updateCSSColors(colors);
  }, [colors]);

  const previewColors = useCallback(
    (newColors) => {
      updateCSSColors(newColors, false);
      return resetColors;
    },
    [resetColors]
  );

  useEffect(() => {
    const fetchCustomizations = async () => {
      setIsLoading(true);
      try {
        const results = await axios.get("/customizations");
        if (results.data?.colors && results.data?.text) {
          setColors(results.data.colors);
          setText(results.data.text);
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        fetchCount.current++;
        if (fetchCount.current <= 3) {
          setTimeout(fetchCustomizations, 500);
        }
      }
    };

    fetchCustomizations();
  }, []); // eslint-disable-line

  const saveCustomizations = useCallback(
    async (customizations) => {
      try {
        const results = await axios.put("/customizations", customizations);
        if (results.data?.colors && results.data?.text) {
          setColors(results.data.colors);
          setText(results.data.text);
        }
      } catch (err) {
        setError("Error updating customizations, try it again!");
      }
    },
    [setText]
  );

  useEffect(() => {
    updateCSSColors(colors);
  }, [colors]);

  const value = {
    get: getColors,
    value: colors,
    preview: previewColors,
    set: setColors,
    reset: resetColors,
    save: saveCustomizations,
    isLoading,
    error,
  };
  return <Provider value={value}>{props.children}</Provider>;
}

export function useColors() {
  return useContext(context);
}

export function getVariableValue(val) {
  if (val[0] !== "-") {
    val = "--" + val;
  }
  return root.getPropertyValue(val);
}

function getColorsFromStorage() {
  const lastColorsStr = localStorage.getItem("colors");
  try {
    if (!lastColorsStr) {
      throw new Error("no colors");
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
