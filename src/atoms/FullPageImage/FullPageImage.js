import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useImages } from "hooks/";

import s from "./FullPageImage.module.scss";

export default function FullPageImage() {
  const { id: imageId } = useParams();
  const navigate = useNavigate();
  const images = useImages();

  const image = images.get.single(imageId);

  const goHome = useCallback(() => navigate("/"), [navigate]);

  if (!image.link) {
    return <div className={s.mask} onClick={goHome} />;
  }

  return (
    <div className={s.mask} onClick={goHome}>
      <div className={s.content}>
        <img src={image.link} alt={image.description} />
      </div>
    </div>
  );
}
