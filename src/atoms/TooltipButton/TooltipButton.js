import { useCallback, useState, useRef } from "react";
import { Button, Tooltip } from "shards-react";

const getID = (
  (id) => () =>
    id++
)(1);
export default function TooltipButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const instanceID = useRef(getID());

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const elementID = `TooltipButton_${instanceID.current}`;

  return (
    <>
      <Button onClick={props.onClick} theme={props.theme} id={elementID}>
        {props.children}
      </Button>
      <Tooltip open={isOpen} target={"#" + elementID} toggle={toggle}>
        {props.tooltip}
      </Tooltip>
    </>
  );
}
