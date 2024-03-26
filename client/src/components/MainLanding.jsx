import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";
import SocialLinks from "./SocialLinks";
import "../css/MainLanding.css";

import { photoContext } from "../context/PhotoContext";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function MainLanding() {
  const { photos } = useContext(photoContext);
  const [loadedImages, setLoadedImages] = useState({});
  const [homeImage, setHomeImage] = useState(null);
  const [lifestyleImages, setLifestyleImages] = useState([]);
  const [outdoorImages, setOutdoorImages] = useState([]);
  const [currentLifestyleIndex, setCurrentLifestyleIndex] = useState(0);
  const [currentOutdoorsIndex, setCurrentOutdoorsIndex] = useState(0);
  const [allContentLoaded, setAllContentLoaded] = useState({
    loaded: false,
    showLoader: false,
  });

  console.log("allContentLoaded", allContentLoaded);

  useEffect(() => {
    document.title = "Henry Escobar | Photographer & Software Engineer";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const lifestyleGallery = photos.filter((photo) =>
      photo.key.startsWith("Home/Lifestyle")
    );
    const outdoorGallery = photos.filter((photo) =>
      photo.key.startsWith("Home/Outdoor")
    );
    const mainGallery = photos.filter((photo) =>
      photo.key.startsWith("Home/Main")
    );

    setLifestyleImages(lifestyleGallery.map((photo) => photo.url));
    setOutdoorImages(outdoorGallery.map((photo) => photo.url));
    setHomeImage(mainGallery[0]);
  }, [photos]);

  useEffect(() => {
    if (
      Object.keys(loadedImages).length ===
      lifestyleImages.length + outdoorImages.length + 1
    ) {
      setAllContentLoaded((prev) => ({
        ...prev,
        loaded: true,
        showLoader: false,
      }));
    }
  }, [loadedImages]);

  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoadedImages((prev) => ({ ...prev, [src]: true }));
    };

    if (homeImage?.url) preloadImage(homeImage.url);
    [...lifestyleImages, ...outdoorImages].forEach((url) => preloadImage(url));
  }, [homeImage, lifestyleImages, outdoorImages]);

  useEffect(() => {
    const handleScroll = () => {
      const maxWidthForAnimation = 768;

      if (window.innerWidth <= maxWidthForAnimation) {
        const revealElements = document.querySelectorAll(
          ".lifestyle-card, .outdoor-card"
        );

        for (const element of revealElements) {
          const elementTop = element.getBoundingClientRect().top;
          const isVisible = elementTop < window.innerHeight - 100;

          if (isVisible) {
            element.classList.add("reveal");
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cycleImages = () => {
    const lifestyleInterval = setInterval(() => {
      setCurrentLifestyleIndex(
        (prevIndex) => (prevIndex + 1) % lifestyleImages.length
      );
    }, 4000);

    const outdoorsInterval = setInterval(() => {
      setCurrentOutdoorsIndex(
        (prevIndex) => (prevIndex + 1) % outdoorImages.length
      );
    }, 5000);

    return () => {
      clearInterval(lifestyleInterval);
      clearInterval(outdoorsInterval);
    };
  };

  useEffect(() => {
    let loaderTimeout = null;
    if (allContentLoaded.loaded) {
      cycleImages();
    } else {
      loaderTimeout = setTimeout(() => {
        setAllContentLoaded((prev) => ({ ...prev, showLoader: true }));
      }, 500);
    }

    return () => {
      clearTimeout(loaderTimeout);
    };
  }, [allContentLoaded.loaded]);

  if (allContentLoaded.showLoader) {
    return (
      <div className="main-landing">
        <div className="photo-loading">
          <div className="stretching-bars-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="main-landing" onContextMenu={(e) => e.preventDefault()}>
      <Header allContentLoaded={allContentLoaded} />
      <Navigation allContentLoaded={allContentLoaded} />
      <div className="main-image-placeholder">
        {homeImage && (
          <img
            id="main-landing-image"
            style={{ pointerEvents: "none", userSelect: "none" }}
            className={loadedImages[homeImage.url] ? "loaded" : ""}
            src={homeImage.url}
            alt="Home"
          />
        )}
      </div>
      <section className="main-landing-cards">
        <div className="lifestyle-card">
          <h2 className="card-heading lifestyle-heading">
            <span className="heading-part">Lifestyle</span>
            <Link to="/lifestyle" className="heading-part">
              Explore More →
            </Link>
          </h2>
          <TransitionGroup className="image-transition-group">
            <CSSTransition
              key={currentLifestyleIndex}
              timeout={1000}
              classNames="fade"
            >
              <img
                src={lifestyleImages[currentLifestyleIndex]}
                style={{ pointerEvents: "none", userSelect: "none" }}
                loading="lazy"
                className="lifestyle-image"
                alt=""
              />
            </CSSTransition>
          </TransitionGroup>
        </div>
        <div className="outdoor-card">
          <h2 className="card-heading outdoor-heading">
            <span className="heading-part">Outdoors</span>
            <Link to="/outdoors" className="heading-part">
              Explore More →
            </Link>
          </h2>
          <TransitionGroup className="image-transition-group">
            <CSSTransition
              key={currentOutdoorsIndex}
              timeout={1000}
              classNames="fade"
            >
              <img
                src={outdoorImages[currentOutdoorsIndex]}
                style={{ pointerEvents: "none", userSelect: "none" }}
                loading="lazy"
                className="outdoor-image"
                alt=""
              />
            </CSSTransition>
          </TransitionGroup>
        </div>
      </section>
      <SocialLinks />
    </section>
  );
}

export default MainLanding;
