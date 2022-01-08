import React from "react";

import Account from "./Account.js";
import Images from "./Images.js";
import ScreenSize from "./ScreenSize.js";

export default function ContextProviders(props) {
  return (
    <Account>
      <ScreenSize>
        <Images>{props.children}</Images>
      </ScreenSize>
    </Account>
  );
}
