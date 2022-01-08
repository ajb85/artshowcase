import { Button, Modal, ModalBody, ModalHeader } from "shards-react";

export default function Upsert(props) {
  const { toggle } = props;

  return (
    <Modal open={props.isOpen} toggle={toggle}>
      <ModalHeader>{props.title}</ModalHeader>
      <ModalBody>
        {props.children}
        <Button onClick={props.buttons?.primary?.onClick}>
          {props.buttons?.primary?.text || "Confirm"}
        </Button>
        <Button onClick={props.buttons?.secondary?.onClick || toggle}>
          {props.buttons?.secondary?.text || "Cancel"}
        </Button>
        {props.error && <p style={{ color: "red" }}>{props.error}</p>}
      </ModalBody>
    </Modal>
  );
}
