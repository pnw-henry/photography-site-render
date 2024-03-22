import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Portfolio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesUp,
  faHome,
  faAddressCard,
  faMountainSun,
  faPersonThroughWindow,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";

import { photoContext } from "../context/PhotoContext";
import PhotoModal from "./PhotoModal";
import Header from "./Header";
import Navigation from "./Navigation";

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
  const isPortfolioRoute = location.pathname.includes("/portfolio");

  const initialFilter = useMemo(() => {
    if (location.pathname.includes("/lifestyle")) return "lifestyle";
    if (location.pathname.includes("/outdoors")) return "outdoors";
    return "all";
  }, [location.pathname]);
  const [filter, setFilter] = useState(initialFilter);
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);
  const filterOptions = ["all", "lifestyle", "outdoors"];

  useEffect(() => {
    switch (location.pathname) {
      case "/lifestyle":
        document.title = "Henry Escobar | Lifestyle Photos";
        break;
      case "/outdoors":
        document.title = "Henry Escobar | Outdoor Photos";
        break;
      case "/portfolio":
      default:
        document.title = "Henry Escobar | Portfolio";
    }
  }, [location.pathname]);

  const loader = useRef(null);
  const navigate = useNavigate();

  const toggleFilter = () => {
    if (isPortfolioRoute) {
      setFilter((currentFilter) => {
        const currentIndex = filterOptions.indexOf(currentFilter);
        const nextIndex = (currentIndex + 1) % filterOptions.length;
        return filterOptions[nextIndex];
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navigateHome = () => {
    navigate("/");
  };

  const navigateToAbout = () => {
    navigate("/about");
  };

  //Filter Photos based on route and filter option
  const filterPhotos = useMemo(() => {
    return photos.filter((photo) => {
      if (filter === "lifestyle") {
        return photo.key.startsWith("People/");
      } else if (filter === "outdoors") {
        return photo.key.startsWith("Outdoors/");
      }

      return (
        photo.key.startsWith("People/") || photo.key.startsWith("Outdoors/")
      );
    });
  }, [photos, filter]);

  // Initialize visiblePhotos on component mount or path change
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoaded({});
    setVisiblePhotos(filterPhotos.slice(0, photosPerPage));
    setNextIndex(photosPerPage);
    setHasMore(filterPhotos.length > photosPerPage);
  }, [filterPhotos]);

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
        key={photo.key + filter}
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
      <section className="portfolio-bottom-nav">
        <div className="icons-row">
          <div className="photo-filter">
            {isPortfolioRoute && (
              <div onClick={toggleFilter} className="action-icon">
                {filter === "lifestyle" ? (
                  <FontAwesomeIcon icon={faPersonThroughWindow} />
                ) : filter === "outdoors" ? (
                  <FontAwesomeIcon icon={faMountainSun} />
                ) : (
                  <FontAwesomeIcon icon={faTableCellsLarge} />
                )}
              </div>
            )}
          </div>
          <div onClick={scrollToTop} className="action-icon">
            <FontAwesomeIcon icon={faAnglesUp} />
          </div>
          <div onClick={navigateHome} className="action-icon">
            <FontAwesomeIcon icon={faHome} />
          </div>
          <div onClick={navigateToAbout} className="action-icon">
            <FontAwesomeIcon icon={faAddressCard} />
          </div>
        </div>
        <h2 className="photo-grid-row">
          {isLifestyleRoute || filter === "lifestyle"
            ? "Small moments in everyday life"
            : isOutdoorsRoute || filter === "outdoors"
            ? "Small moments outside"
            : "Life is made of small moments like these"}{" "}
        </h2>
      </section>
    </section>
  );
}

export default Portfolio;
