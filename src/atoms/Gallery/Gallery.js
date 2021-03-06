import { useEffect, useRef } from "react";
import { Card, CardBody, CardHeader, CardImg } from "shards-react";
import { useNavigate } from "react-router-dom";
import { MdOutlineManageAccounts } from "react-icons/md";

import { Logo, LoadingIcon } from "atoms";
import { useImages, useColors, useAccount } from "hooks";

import s from "./Gallery.module.scss";
import { combineClasses } from "js";

export default function Gallery() {
  const navigate = useNavigate();
  const tokenIsValidated = useAccount().token.validated;
  const images = useImages();
  const colors = useColors();
  const didFetch = useRef(false);
  const lastImage = useRef();
  const obs = useRef();
  const fetchPublicImages = images.get.public;

  if (!images.public.length && !didFetch.current) {
    setTimeout(fetchPublicImages);
    didFetch.current = true;
  }

  useEffect(() => {
    if (obs.current) {
      obs.current.disconnect();
    }

    obs.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        images.get.public();
      }
    });

    lastImage.current && obs.current.observe(lastImage.current);

    return () => {
      obs.current && obs.current.disconnect();
    };
  }, [images]);

  if (colors.isLoading || images.isLoading) {
    return <LoadingIcon className={s.loading} />;
  }

  return (
    <div className={s.gallery}>
      {tokenIsValidated && (
        <MdOutlineManageAccounts onClick={() => navigate("/manager")} />
      )}
      <header>
        <Logo />
      </header>
      <main>
        <div className={s.cardWrapper}>
          {images.public.map((i, index) => (
            <div
              ref={index === images.public.length - 1 ? lastImage : undefined}
              key={i.id}
            >
              <Card
                className={combineClasses(
                  s.card,
                  i.progress?.[0]?.link && s.dual
                )}
                onClick={() => navigate(`/image/${i.id}`)}
              >
                {i.name && (
                  <CardHeader className={s.header}>{i.name}</CardHeader>
                )}
                <CardImages baseURL={`/image/${i.id}`} image={i} />
                {i.description && (
                  <CardBody className={s.body}>
                    <p>{i.description}</p>
                  </CardBody>
                )}
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function CardImages({ image, baseURL }) {
  const navigate = useNavigate();
  return process.env.REACT_APP_GALLERY_FINAL_FIRST ? (
    <div className={s.images}>
      <CardImg src={image.link} />
      {image.progress?.[0]?.link && (
        <CardImg
          onClick={(e) => {
            e.stopPropagation();
            navigate(`${baseURL}/0`);
          }}
          src={image.progress[0].link}
        />
      )}
    </div>
  ) : (
    <div className={s.images}>
      {image.progress?.[0]?.link && (
        <CardImg
          onClick={(e) => {
            e.stopPropagation();
            navigate(`${baseURL}/0`);
          }}
          src={image.progress[0].link}
        />
      )}
      <CardImg src={image.link} />
    </div>
  );
}
