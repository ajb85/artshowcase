import { useCallback, useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardImg,
  CardBody,
  Button,
  ButtonGroup,
} from "shards-react";
import { BsLink45Deg } from "react-icons/bs";
import { BiEditAlt, BiHomeHeart } from "react-icons/bi";
import { MdDeleteForever, MdOutlineColorLens } from "react-icons/md";
import { GrHide } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

import { Upsert, TooltipButton, EditAccount } from "atoms/";
import { useImages } from "hooks/";
import { copyToClipboard } from "js";

import s from "./ImageManager.module.scss";

export default function ImageManager() {
  const navigate = useNavigate();
  const images = useImages();
  const [activeImage, setActiveImage] = useState(null);
  const fetchAllImages = images.get.all;

  const upsertImage = useCallback((index) => {
    if (index !== true) {
      setActiveImage(index.toString());
    } else {
      setActiveImage(true);
    }
  }, []);

  const closeUpsert = useCallback(() => setActiveImage(null), []);

  useEffect(() => fetchAllImages(), [fetchAllImages]);

  return (
    <section className={s.imageManager}>
      <div className={s.svgs}>
        <BiHomeHeart onClick={() => navigate("/")} />
        <MdOutlineColorLens onClick={() => navigate("/manager/site")} />
      </div>
      <h2>Manage Uploads</h2>
      <Button onClick={upsertImage.bind(this, true)}>Upload Image</Button>
      <EditAccount />
      <div className={s.cardWrapper}>
        {images.value.map((i, index) => (
          <Card key={index}>
            <CardHeader className={s.header}>
              {i.name || "Unnamed"}
              {i.private && <GrHide />}
            </CardHeader>
            <CardImg src={i.link} onClick={() => upsertImage(index)} />
            <CardBody className={s.body}>
              <p>{i.description || "No description"}</p>
              <ButtonGroup className={s.buttonGroup}>
                <TooltipButton
                  onClick={() => upsertImage(index)}
                  tooltip="Edit"
                >
                  <BiEditAlt />
                </TooltipButton>
                <TooltipButton
                  onClick={() =>
                    copyToClipboard(
                      process.env.REACT_APP_URL + `/image/${i.id}`
                    )
                  }
                  tooltip="Copy Link"
                >
                  <BsLink45Deg />
                </TooltipButton>
                <TooltipButton
                  onClick={() => images.delete(i.id)}
                  theme="danger"
                  tooltip="Delete"
                >
                  <MdDeleteForever />
                </TooltipButton>
              </ButtonGroup>
            </CardBody>
          </Card>
        ))}
      </div>
      <Upsert
        isOpen={activeImage !== null}
        image={activeImage !== true && images.value[activeImage]}
        toggle={closeUpsert}
        onSubmit={activeImage === true ? images.create : images.edit}
      />
    </section>
  );
}
