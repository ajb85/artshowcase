import * as LoadingIcons from "react-loading-icons";

import { useColors, useText } from "hooks";

import s from "./LoadingIcon.module.scss";

export default function LoadingIcon(props) {
  const { text } = useText();
  const colors = useColors();
  const Icon = LoadingIcons[props.icon || text.loadingIcon];

  return (
    <div className={props.className}>
      <Icon
        stroke={props.stroke || colors.get("loadingIconStroke")}
        fill={props.fill || colors.get("loadingIcon")}
        speed={props.speed || text.iconSpeed}
      />
      <p className={s.text}>{props.text || text.loading}</p>
    </div>
  );
}
