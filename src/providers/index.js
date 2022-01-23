import React from "react";

import Account from "./Account.js";
import Images from "./Images.js";
import ScreenSize from "./ScreenSize.js";
import Colors from "./Colors.js";

export default function ContextProviders(props) {
  return (
    <Account>
      <ScreenSize>
        <Images>
          <Colors>{props.children}</Colors>
        </Images>
      </ScreenSize>
    </Account>
  );
}
