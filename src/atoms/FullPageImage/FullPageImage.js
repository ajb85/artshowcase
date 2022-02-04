import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

import { useImages } from "hooks/";

import s from "./FullPageImage.module.scss";

export default function FullPageImage() {
  const { id: imageId, progressIndex } = useParams();
  const navigate = useNavigate();
  const images = useImages();

  const image = images.get.single(imageId);
  const progressImage = image.progress?.[progressIndex];
  const goHome = useCallback(() => navigate("/"), [navigate]);

  if (!image.link) {
    return <div className={s.mask} onClick={goHome} />;
  }

  return (
    <div className={s.mask} onClick={goHome}>
      <div className={s.content}>
        <img src={progressImage?.link || image.link} alt={image.description} />
      </div>
      {image.progress?.length && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            progressIndex
              ? navigate(`/image/${imageId}`)
              : navigate(`/image/${imageId}/0`);
          }}
        >
          <HiOutlineSwitchHorizontal />
        </button>
      )}
    </div>
  );
}
