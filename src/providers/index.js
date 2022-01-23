import React from "react";

import Account from "./Account.js";
import Images from "./Images.js";
import ScreenSize from "./ScreenSize.js";
import Colors from "./Colors.js";
import Text from "./Text.js";

export default function ContextProviders(props) {
  return (
    <Account>
      <ScreenSize>
        <Images>
          <Text>
            <Colors>{props.children}</Colors>
          </Text>
        </Images>
      </ScreenSize>
    </Account>
  );
}
