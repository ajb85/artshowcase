// @flow
import { useState, useEffect, useCallback, useRef } from "react";
import type { Node } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import { MdOutlineUploadFile, MdError } from "react-icons/md";
import { ImSpinner10 } from "react-icons/im";
import { BsFillFileEarmarkXFill, BsCheckCircleFill } from "react-icons/bs";

import { useImages } from "hooks/";
import { combineClasses } from "js/";
import styles from "./ImageUpload.module.scss";

export default function ImageUpload(props) {
  const { upload } = useImages();
  const { setLink } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [file, setFile] = useState(null);
  const [render, setRender] = useState(props.value || null);
  const dropzone = useRef();

  const startDragging = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = e.dataTransfer?.items[0];
      setFile(item || null);
    },
    [setFile]
  );

  const endDragging = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setFile(null);
    },
    [setFile]
  );

  const handleFile = useCallback(
    async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => setRender(event.target.result);
      reader.readAsDataURL(file);
      setFile(file);

      try {
        setIsUploading(true);
        const { data } = await upload(file);

        setIsUploading(false);
        setLink(data.link);
      } catch (err) {
        setIsUploading(false);
        setUploadError(true);
      }
    },
    [setRender, setLink, upload]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleFile({ target: { files: Array.from(e.dataTransfer.files) } });
      e.dataTransfer.clearData();
    },
    [handleFile]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    const div = dropzone.current;
    if (div) {
      div.addEventListener("dragenter", startDragging);
      div.addEventListener("dragleave", endDragging);
      div.addEventListener("dragover", handleDrag);
      div.addEventListener("drop", handleDrop);
    }

    return () => {
      div.removeEventListener("dragenter", startDragging);
      div.removeEventListener("dragleave", endDragging);
      div.removeEventListener("dragover", handleDrag);
      div.removeEventListener("drop", handleDrop);
    };
  }, [startDragging, endDragging, handleDrag, handleDrop]);

  useEffect(() => {
    if (props.value && !render) {
      setRender(props.value);
      setFile(null);
      setIsUploading(false);
      setUploadError(false);
      setLink("");
    }
  }, [
    props.value,
    render,
    setRender,
    setFile,
    setIsUploading,
    setUploadError,
    setLink,
  ]);

  const successfulUpload = !!file && !isUploading && !uploadError;

  return (
    <>
      <div className={combineClasses(styles.imageUpload)}>
        <label className={styles.large} ref={dropzone}>
          <input
            disabled={isUploading}
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
        </label>
        {render ? (
          <div
            className={combineClasses(styles.imageWrapper, styles[props.size])}
          >
            <img src={render} alt="Uploaded Img" />
          </div>
        ) : (
          <UploadIcon fileType={file?.type || ""} size={props.size} />
        )}
        <div className={styles.indicator}>
          {successfulUpload ? (
            <BsCheckCircleFill className={styles.success} />
          ) : uploadError ? (
            <MdError className={styles.error} />
          ) : isUploading ? (
            <ImSpinner10 className={styles.uploading} />
          ) : null}
        </div>
      </div>
      {uploadError && (
        <p className={styles.error}>Image failed to upload, please try again</p>
      )}
    </>
  );
}

ImageUpload.defaultProps = {
  size: "large",
};

const allowedFilesTypes = {
  "image/png": true,
  "image/jpg": true,
  "image/jpeg": true,
  "image/gif": true,
};

type IconProps = {
  fileType: string,
  size: string,
};

function UploadIcon(props: IconProps): Node {
  const { fileType, size } = props;

  if (!fileType) {
    return <AiOutlineFileImage className={combineClasses(styles[size])} />;
  }

  if (allowedFilesTypes[fileType]) {
    return (
      <MdOutlineUploadFile
        className={combineClasses(styles[size], styles.success)}
      />
    );
  }

  return (
    <>
      <BsFillFileEarmarkXFill
        className={combineClasses(styles[size], styles.error)}
      />
      <p>Unsupported file type :(</p>
    </>
  );
}
