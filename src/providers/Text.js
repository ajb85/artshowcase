import { useState, createContext, useContext, useCallback } from "react";

const context = createContext();
const { Provider } = context;

const defaultText = {
  logo: "Tara's Art Gallery",
  loading: "Loading images...",
  loadingIcon: "Hearts",
  iconSpeed: "1",
};

const lastText = getTextFromStorage();
saveText(lastText);

export default function TextProvider(props) {
  const [text, setText] = useState(lastText);
  const [isLoading] = useState(false);

  const updateText = useCallback((value) => {
    setText(value);
    saveText(value);
  }, []);

  const value = {
    text,
    setText: updateText,
    isLoading,
  };

  return <Provider value={value}>{props.children}</Provider>;
}

export function useText() {
  return useContext(context);
}

function saveText(text, recursed) {
  if (text) {
    try {
      localStorage.setItem("text", JSON.stringify(text));
    } catch (err) {
      !recursed && saveText(defaultText, true);
    }
  }
}

function getTextFromStorage() {
  const lastTextStr = localStorage.getItem("text");
  try {
    if (!lastTextStr) {
      throw new Error("no text");
    }
    return JSON.parse(lastTextStr);
  } catch (err) {
    return defaultText;
  }
}
