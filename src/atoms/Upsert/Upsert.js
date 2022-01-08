import { ImageUpload } from "atoms";
import { useState, useCallback, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormInput,
  FormGroup,
  FormCheckbox,
  ButtonGroup,
} from "shards-react";

// import s from "./Upsert.module.scss";

import { newImage } from "data";

export default function Upsert(props) {
  const { onSubmit, toggle } = props;
  const [image, setImage] = useState(props.image || newImage);

  const updateImage = useCallback(
    (e) => {
      const { id, value } = e.target;
      if (id === "private") {
        setImage({ ...image, private: !image.private });
      } else {
        setImage({ ...image, [id]: value });
      }
    },
    [image]
  );

  const setLink = useCallback((link) => setImage({ ...image, link }), [image]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      image.link && onSubmit(image);
      toggle();
    },
    [onSubmit, image, toggle]
  );

  useEffect(() => {
    setImage(props.image || newImage);
  }, [props.image]);

  return (
    <Modal open={props.isOpen} toggle={toggle}>
      <ModalHeader>{props.image ? "Edit Image" : "Add Image"}</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <ImageUpload setLink={setLink} value={image.link || null} />
            <label htmlFor="name">Name</label>
            <FormInput
              id="name"
              placeholder="Name"
              value={image.name}
              onChange={updateImage}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="description">Description</label>
            <FormInput
              id="description"
              placeholder="Description"
              value={image.description}
              onChange={updateImage}
            />
          </FormGroup>

          <FormCheckbox
            id="private"
            checked={image.private}
            onChange={updateImage}
          >
            Private
          </FormCheckbox>
          <ButtonGroup>
            <Button type="submit" disabled={!image.link}>
              Submit
            </Button>
            <Button onClick={toggle}>Cancel</Button>
          </ButtonGroup>
          {props.error && <p style={{ color: "red" }}>{props.error}</p>}
        </Form>
      </ModalBody>
    </Modal>
  );
}
