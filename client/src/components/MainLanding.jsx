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
  const [loadingState, setLoadingState] = useState({
    mainImageLoaded: false,
    lifestyleImagesLoaded: false,
    outdoorImagesLoaded: false,
  });
  const [homeImage, setHomeImage] = useState(null);
  const [lifestyleImages, setLifestyleImages] = useState([]);
  const [outdoorImages, setOutdoorImages] = useState([]);
  const [currentLifestyleIndex, setCurrentLifestyleIndex] = useState(0);
  const [currentOutdoorsIndex, setCurrentOutdoorsIndex] = useState(0);
  const [showLoader, setShowLoader] = useState(false);

  const allContentLoaded =
    loadingState.mainImageLoaded &&
    loadingState.lifestyleImagesLoaded &&
    loadingState.outdoorImagesLoaded;

  //Show loader if content is not loaded after 500ms
  useEffect(() => {
    document.title = "Henry Escobar | Photographer & Software Engineer";
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  //Filter photos to get the images for the main landing page
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
    const loadImage = (src, callback) => {
      const img = new Image();
      img.src = src;
      img.onload = callback;
    };

    if (homeImage?.url) {
      loadImage(homeImage.url, () =>
        setLoadingState((prev) => ({ ...prev, mainImageLoaded: true }))
      );
    }

    if (lifestyleImages.length) {
      loadImage(lifestyleImages[0], () =>
        setLoadingState((prev) => ({ ...prev, lifestyleImagesLoaded: true }))
      );
    }

    if (outdoorImages.length) {
      loadImage(outdoorImages[0], () =>
        setLoadingState((prev) => ({ ...prev, outdoorImagesLoaded: true }))
      );
    }

    setShowLoader(false);

    setTimeout(() => {
      const header = document.querySelector(".header");
      const navBar = document.querySelector(".nav-bar");
      if (header) header.classList.add("loaded");
      if (navBar) navBar.classList.add("loaded");
      document
        .querySelectorAll(".card-heading")
        .forEach((element) => element.classList.add("loaded"));
    }, 1000);

    return cycleImages();
  }, [lifestyleImages, outdoorImages, homeImage]);

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
      <Header />
      <Navigation />
      <div className="main-image-placeholder">
        {homeImage && (
          <img
            id="main-landing-image"
            style={{ pointerEvents: "none", userSelect: "none" }}
            className={loadingState.mainImageLoaded ? "loaded" : ""}
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
