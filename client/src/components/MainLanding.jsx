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
  const [showLoader, setShowLoader] = useState(false);

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

  //Show loader if content is not loaded after 500ms
  useEffect(() => {
    document.title = "Henry Escobar | Photographer & Software Engineer";
    window.scrollTo(0, 0);

    const loaderDelay = setTimeout(() => {
      setShowLoader(true);
    }, 2000);

    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoadedImages((prev) => ({ ...prev, [src]: true }));
    };

    if (homeImage?.url) preloadImage(homeImage.url);
    [...lifestyleImages, ...outdoorImages].forEach((url) => preloadImage(url));

    return () => clearTimeout(loaderDelay);
  }, [homeImage, lifestyleImages, outdoorImages]);

  const allContentLoaded = homeImage?.url
    ? loadedImages[homeImage.url]
    : true &&
      lifestyleImages.every((img) => loadedImages[img]) &&
      outdoorImages.every((img) => loadedImages[img]);

  useEffect(() => {
    if (allContentLoaded) setShowLoader(false);
  }, [allContentLoaded]);

  useEffect(() => {
    const loadImage = (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoadedImages((prev) => ({ ...prev, [src]: true }));
    };

    if (homeImage?.url) {
      loadImage(homeImage.url);
    }

    lifestyleImages.forEach((imageUrl) => loadImage(imageUrl));
    outdoorImages.forEach((imageUrl) => loadImage(imageUrl));

    return cycleImages();
  }, [lifestyleImages, outdoorImages, homeImage]);

  useEffect(() => {
    document
      .querySelectorAll(".card-heading")
      .forEach((element) => element.classList.add("loaded"));
  }, [allContentLoaded]);

  //Add reveal class to the cards when they are in view
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

  //Cycle through the images for the lifestyle and outdoor cards
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

  if (!allContentLoaded && showLoader) {
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
      <Header isMainImageLoaded={showLoader} />
      <Navigation isMainImageLoaded={showLoader} />
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
