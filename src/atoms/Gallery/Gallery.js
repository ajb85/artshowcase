import { useEffect, useRef } from "react";
import { Card, CardBody, CardHeader, CardImg } from "shards-react";
import { useNavigate } from "react-router-dom";
import { Hearts } from "react-loading-icons";

import { Logo } from "atoms";
import { useImages, useColors } from "hooks";

import s from "./Gallery.module.scss";

export default function Gallery() {
  const navigate = useNavigate();
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
    return (
      <div className={s.loading}>
        <h1>Fetching...</h1>
        <Hearts fill={colors.get("loadingIcon")} />
        <p>Loading images...</p>
      </div>
    );
  }
  return (
    <div className={s.gallery}>
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
              <Card onClick={() => navigate(`/image/${i.id}`)}>
                <CardHeader className={s.header}>
                  {i.name || "Unnamed"}
                </CardHeader>
                <CardImg src={i.link} />
                <CardBody className={s.body}>
                  <p>{i.description || "No description"}</p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
