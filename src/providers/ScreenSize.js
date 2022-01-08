import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import debounce from "js/debounce";

const context = createContext();
const { Provider } = context;

function getScreenSize() {
  const height =
    window.innerHeight || window.screen.availHeight || window.screen.height;
  const width =
    window.innerWidth || window.screen.availWidth || window.screen.width;

  return { height, width };
}

export default function ScreenSize(props) {
  const [size, setSize] = useState(props.value || getScreenSize());

  const isWidthLess = useCallback(
    (value) => Number(size.width) < Number(value),
    [size]
  );

  const isWidthMore = useCallback(
    (value) => Number(size.width) >= Number(value),
    [size]
  );

  const isHeightLess = useCallback(
    (value) => Number(size.height) < Number(value),
    [size]
  );

  const isHeightMore = useCallback(
    (value) => Number(size.height) >= Number(value),
    [size]
  );

  useEffect(() => {
    const updateSize = debounce(() => setSize(getScreenSize()), {
      wait: 200,
      throttle: true,
    });
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const value = {
    width: { isLess: isWidthLess, isMore: isWidthMore, value: size.width },
    height: { isLess: isHeightLess, isMore: isHeightMore, value: size.height },
  };

  return <Provider value={value}>{props.children}</Provider>;
}

export function useScreenSize() {
  return useContext(context);
}
