import { useText } from "hooks";
import s from "./Logo.module.scss";

export default function Logo(props) {
  const { text } = useText();
  return <h1 className={s.logo}>{props.children || text.logo}</h1>;
}
