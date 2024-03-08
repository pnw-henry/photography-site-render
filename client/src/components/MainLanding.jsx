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
  const [imageState, setImageState] = useState({
    homeImage: "",
  });
  const [homeImages, setHomeImages] = useState([]);
  const [lifestyleImages, setLifestyleImages] = useState([]);
  const [outdoorImages, setOutdoorImages] = useState([]);
  const [currentLifestyleIndex, setCurrentLifestyleIndex] = useState(0);
  const [currentOutdoorsIndex, setCurrentOutdoorsIndex] = useState(0);
  const [allContentLoaded, setAllContentLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

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
    setHomeImages(mainGallery.map((photo) => photo.url));
  }, [photos]);

  //Set the main landing image and add loaded class to the header and nav-bar
  useEffect(() => {
    if (lifestyleImages.length && outdoorImages.length && homeImages.length) {
      const randomIndex = Math.floor(Math.random() * homeImages.length);
      const selectedImageUrl = homeImages[randomIndex];
      const img = new Image();
      img.src = selectedImageUrl;
      img.onload = () => {
        setImageState({
          homeImage: selectedImageUrl,
        });
      };

      setTimeout(() => {
        document.querySelector(".header").classList.add("loaded");
        document.querySelector(".nav-bar").classList.add("loaded");
      }, 1000);

      document.querySelectorAll(".card-heading").forEach((element) => {
        element.classList.add("loaded");
      });

      const cleanup = cycleImages();
      setShowLoader(false);
      setAllContentLoaded(true);

      return cleanup;
    }
  }, [lifestyleImages.length, outdoorImages.length, homeImages.length]);

  //Show loader if content is not loaded after 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!allContentLoaded) {
        setShowLoader(true);
      }
    }, 500);
    return () => clearTimeout(timer);
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
    <section className="main-landing">
      <Header />
      <Navigation />
      <div className="main-image-placeholder">
        {imageState.homeImage && (
          <img
            id="main-landing-image"
            src={imageState.homeImage}
            onContextMenu={(e) => e.preventDefault()}
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
                onContextMenu={(e) => e.preventDefault()}
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
                onContextMenu={(e) => e.preventDefault()}
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
