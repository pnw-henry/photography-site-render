import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "../css/Portfolio.css";

import { photoContext } from "../context/PhotoContext";
import PhotoModal from "./PhotoModal";
import Header from "./Header";
import Navigation from "./Navigation";
import SocialLinks from "./SocialLinks";

function Portfolio() {
  const { photos } = useContext(photoContext);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loaded, setLoaded] = useState({});
  const [visiblePhotos, setVisiblePhotos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextIndex, setNextIndex] = useState(0);
  const [loadingMorePhotos, setLoadingMorePhotos] = useState(false);
  const photosPerPage = 9;

  const location = useLocation();
  const isLifestyleRoute = location.pathname.includes("/lifestyle");
  const isOutdoorsRoute = location.pathname.includes("/outdoors");

  const loader = useRef(null);

  //Filter Photos based on route
  const filterPhotos = useMemo(() => {
    return photos.filter((photo) => {
      if (isLifestyleRoute) {
        return photo.key.startsWith("People/");
      } else if (isOutdoorsRoute) {
        return photo.key.startsWith("Outdoors/");
      }

      return (
        photo.key.startsWith("People/") || photo.key.startsWith("Outdoors/")
      );
    });
  }, [photos, isLifestyleRoute, isOutdoorsRoute]);

  // Initialize visiblePhotos on component mount or path change
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoaded({});
    setVisiblePhotos(filterPhotos.slice(0, photosPerPage));
    setNextIndex(photosPerPage);
    setHasMore(filterPhotos.length > photosPerPage);
  }, [location.pathname, photos]);

  //Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMorePhotos) {
          loadMorePhotos();
        }
      },
      { rootMargin: "100px" }
    );

    if (loader.current) observer.observe(loader.current);
    return () => observer && observer.disconnect();
  }, [hasMore, nextIndex, filterPhotos, loadingMorePhotos]);

  //Load more photos on scroll
  const loadMorePhotos = () => {
    if (loadingMorePhotos) return;
    setLoadingMorePhotos(true);

    setNextIndex((prevIndex) => {
      const newIndex = prevIndex + photosPerPage;
      const morePhotos = filterPhotos.slice(prevIndex, newIndex);

      setVisiblePhotos((prevPhotos) => [...prevPhotos, ...morePhotos]);
      setHasMore(nextIndex + photosPerPage < filterPhotos.length);

      morePhotos.forEach((photo) => {
        if (!loaded[photo.key]) {
          setLoaded((prevState) => ({ ...prevState, [photo.key]: false }));
        }
      });
      setLoadingMorePhotos(false);
      return newIndex;
    });
  };

  //Handle image load error
  const handleImageError = (key) => {
    console.error("Failed to load image:", key);
    setLoaded((prevState) => ({ ...prevState, [key]: "error" }));
  };

  //Show social links on scroll
  const useScrollDetection = () => {
    useEffect(() => {
      let scrollTimeout = null;

      const handleScroll = () => {
        document
          .querySelector(".social-media-links")
          .classList.remove("show-social-links");

        if (scrollTimeout !== null) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
          document
            .querySelector(".social-media-links")
            .classList.add("show-social-links");
        }, 150); // Add the class 150ms after the user stops scrolling
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeout !== null) {
          clearTimeout(scrollTimeout);
        }
      };
    }, []);
  };

  useScrollDetection();

  //Display photos on the page and handle loading
  const imagesToDisplay = visiblePhotos.map((photo, index) => (
    <div
      className={`photo-container ${loaded[photo.key] ? "fade-in" : ""}`}
      key={index}
    >
      {!loaded[photo.key] && (
        <div className="photo-loading">
          <div className="stretching-bars-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <img
        alt={photo.key}
        src={photo.url}
        onContextMenu={(e) => e.preventDefault()}
        onClick={() => setSelectedPhoto(photo.url)}
        className={`portfolio-photo ${loaded[photo.key] ? "" : "hidden"}`}
        onLoad={() =>
          setLoaded((prevState) => ({ ...prevState, [photo.key]: true }))
        }
        onError={() => handleImageError(photo.key)}
      />
    </div>
  ));

  return (
    <section
      className="portfolio-container"
      key={location.pathname}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Header />
      <Navigation />
      {imagesToDisplay.length > 0 ? imagesToDisplay : <div></div>}
      <div ref={loader} />
      {selectedPhoto && (
        <PhotoModal
          photoUrl={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
      <SocialLinks />
    </section>
  );
}

export default Portfolio;
