import React from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";

import "../css/SocialLinks.css";

function SocialLinks() {
  const location = useLocation();
  const isAboutRoute = location.pathname === "/about";
  const isMainRoute = location.pathname === "/";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="social-media-links">
      {!isMainRoute && !isAboutRoute && (
        <a href="#" onClick={scrollToTop} className="social-icon">
          <FontAwesomeIcon icon={faCircleUp} />
        </a>
      )}
      <a href="https://www.instagram.com/pnw.henry/" className="social-icon">
        <FontAwesomeIcon icon={faInstagram} />
      </a>
      <a href="https://github.com/pnw-henry" className="social-icon">
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <a href="https://www.linkedin.com/in/pnw-henry/" className="social-icon">
        <FontAwesomeIcon icon={faLinkedin} />
      </a>
      {!isAboutRoute && <h2>Life is made of small moments like these</h2>}
    </section>
  );
}

export default SocialLinks;
