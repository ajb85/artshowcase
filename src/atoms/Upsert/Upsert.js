import { ImageUpload } from "atoms";
import { useState, useCallback, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
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

import { newImage } from "data";

import s from "./Upsert.module.scss";

export default function Upsert(props) {
  const { onSubmit, toggle } = props;
  const [image, setImage] = useState(props.image || newImage);
  const [uploadingProgress, setUploadingProgress] = useState(false);

  const progressImage = image.progress[0];

  const updateImage = useCallback((e) => {
    const { id, value } = e.target;
    if (id === "private") {
      setImage((i) => ({ ...i, private: !i.private }));
    } else {
      setImage((i) => ({ ...i, [id]: value }));
    }
  }, []);

  const setLink = useCallback((link) => setImage((i) => ({ ...i, link })), []);
  const setProgressLink = useCallback(
    (link) =>
      setImage((i) => ({
        ...i,
        progress: [{ ...(i.progress[0] || {}), link }],
      })),
    []
  );

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
      <ModalHeader className={s.header}>
        {props.image ? "Edit Image" : "Add Image"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup className={s.imageUpload}>
            {process.env.REACT_APP_FINAL_FIRST ? (
              <>
                <ImageUpload
                  title="Final"
                  setLink={setLink}
                  value={image.link || null}
                />
                <div className={s.inProgressWrapper}>
                  <ImageUpload
                    title="In Progress"
                    setLink={setProgressLink}
                    value={progressImage?.link || null}
                    setIsLoading={setUploadingProgress}
                  />
                  {progressImage?.link && (
                    <MdDeleteForever
                      className={s.deleteIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProgressLink();
                      }}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={s.inProgressWrapper}>
                  <ImageUpload
                    title="In Progress"
                    setLink={setProgressLink}
                    value={progressImage?.link || null}
                    setIsLoading={setUploadingProgress}
                  />
                  {progressImage?.link && (
                    <MdDeleteForever
                      className={s.deleteIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProgressLink();
                      }}
                    />
                  )}
                </div>
                <ImageUpload
                  title="Final"
                  setLink={setLink}
                  value={image.link || null}
                />
              </>
            )}
          </FormGroup>
          <FormGroup>
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
            <Button type="submit" disabled={!image.link || uploadingProgress}>
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
