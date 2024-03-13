import React, { useContext } from "react";
import "../css/About.css";
import Navigation from "./Navigation";
import Header from "./Header";

import { photoContext } from "../context/PhotoContext";
import SocialLinks from "./SocialLinks";

function About() {
  const { photos } = useContext(photoContext);
  const aboutImages = photos.filter((photo) => photo.key.startsWith("Me/"));

  return (
    <section className="about-section">
      <Header />
      <Navigation />
      <section className="about-content">
        <div className="about-top-container">
          <div className="summary-text">
            <h1>About</h1>
            <p>
              I'm a Seattle-based photographer and software engineer. I'm also
              really bad at writing these things. This is what other people
              totally, 100% no lie, have said about me:
            </p>
            <p>
              <b>Eric, barista at a local coffee shop:</b> "Henry's got a knack
              for capturing the moment, but his idea of 'travel light' is
              bringing enough snacks to feed a small army."
            </p>
            <p>
              <b>Brian, some guy that went on a date with me:</b> "He showed
              more interest in talking about his apps than relationships. I
              threw my drink in his face."
            </p>
            <p>
              <b>Becky, former coworker and software developer:</b> "He's great
              at building websites, not so great at choosing pastries. It's like
              witnessing a midlife crisis."
            </p>
            <p>
              <b>Devin, fellow raver:</b> "He can keep up on the trail, but on
              the dance floor? You did your best, sweetie."
            </p>
          </div>
          <SocialLinks />
        </div>
        <div className="about-images-container">
          {aboutImages.length > 0 ? (
            aboutImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`About me ${index + 1}`}
                className="about-image"
              />
            ))
          ) : (
            <div>Lost my face</div>
          )}
        </div>
      </section>
    </section>
  );
}

export default About;
