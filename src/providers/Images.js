import React, {
  useState,
  createContext,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import debounce from "js/debounce";
import { getLookupByID } from "js";
import { newImage } from "data";

const context = createContext();
const { Provider } = context;

const count = 20;

const debouncer = debounce(() => {}, { leading: true, wait: 1000 });

export default function Images(props) {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [fetched, setFetched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onFinal, setOnFinal] = useState(false);
  const [error, setError] = useState(false);

  const imagesLookup = useMemo(
    () => getLookupByID([...images, ...fetched]),
    [images, fetched]
  );

  const publicImages = useMemo(
    () => images.filter((i) => !i.private),
    [images]
  );

  const getNextPublic = useCallback(async () => {
    try {
      if (!onFinal) {
        setIsLoading(true);
        const results = await axios.post("/images/public", {
          page: Math.ceil(publicImages.length / count),
          count,
        });

        if (results.data?.images) {
          setImages([...images, ...results.data.images]);
          setOnFinal(results.data.isFinal);
          setIsLoading(false);
          setError("");
        }
      }
    } catch (err) {
      setError("Oops, couldn't fetch any more images :(");
      setIsLoading(false);
    }
  }, [onFinal, images, publicImages.length]);

  const debouncedPublic = useMemo(() => {
    return debouncer.swapCallback(getNextPublic);
  }, [getNextPublic]);

  const fetchSingleImageFromID = useCallback(
    async (id) => {
      try {
        if (!isLoading) {
          setIsLoading(true);

          const results = await axios.get(`/images/${id}`);
          if (results.data) {
            results.data.private = true;
            setFetched([...fetched, results.data]);
            setIsLoading(false);
            setError("");
          }
        }
      } catch (err) {
        setIsLoading(false);
        setError("Could not fetch your image :(");
      }
    },
    [fetched, isLoading]
  );

  const getImageByID = useCallback(
    (id) => {
      const image = imagesLookup[id];
      if (!image) {
        fetchSingleImageFromID(id).catch(() => navigate("/"));
        return newImage;
      }

      return image;
    },
    [imagesLookup, fetchSingleImageFromID, navigate]
  );

  const getAllImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const results = await axios.get("/images/all");

      if (results.data) {
        setImages(results.data);
        setError("");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Oops, couldn't fetch images :(");
      setIsLoading(false);
    }
  }, []);

  const uploadImage = useCallback((file) => {
    const formData = new FormData();
    formData.append("image", file);
    return axios.post("/postImage", formData);
  }, []);

  const upsertImage = useCallback(
    async (isEditing, image) => {
      try {
        setIsLoading(true);
        const query = isEditing
          ? axios.put(`/images/${image.id}`, image)
          : axios.post("/images", image);
        const results = await query;
        if (results.data) {
          isEditing
            ? setImages(
                images.map((i) => {
                  if (i.id === results.data.id) {
                    return results.data;
                  }

                  return i;
                })
              )
            : setImages([results.data, ...images]);
          setIsLoading(false);
          setError("");
        }
      } catch (err) {
        setError("Whoops, failed to create your image :(");
        setIsLoading(false);
      }
    },
    [images]
  );

  const createImage = useCallback(
    (image) => upsertImage(false, image),
    [upsertImage]
  );

  const editImage = useCallback(
    (image) => upsertImage(true, image),
    [upsertImage]
  );

  const deleteImage = useCallback(
    async (id) => {
      try {
        setIsLoading(true);
        const results = await axios.delete(`/images/${id}`);
        if (results.data.message === "Error") {
          throw new Error(results.data.message);
        }

        setImages(images.filter((i) => i.id !== id));
        setIsLoading(false);
        setError("");
      } catch (err) {
        setError("Whoops, failed to create your image :(");
        setIsLoading(false);
      }
    },
    [images]
  );

  return (
    <Provider
      value={{
        value: images,
        public: publicImages,
        isLoading,
        error,
        onFinal,
        get: {
          public: debouncedPublic,
          all: getAllImages,
          single: getImageByID,
        },
        upload: uploadImage,
        create: createImage,
        edit: editImage,
        delete: deleteImage,
      }}
    >
      {props.children}
    </Provider>
  );
}

export function useImages() {
  return useContext(context);
}
