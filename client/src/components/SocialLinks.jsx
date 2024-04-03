import React from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import "../css/SocialLinks.css";

function SocialLinks() {
  const location = useLocation();

  const isAboutRoute =
    location.pathname === "/about" || location.pathname === "/about/";

  const ExternalLink = ({ url, icon }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-icon"
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  );

  return (
    <section className="user-buttons">
      <ExternalLink
        url="https://www.instagram.com/pnw.henry/"
        icon={faInstagram}
      />
      <ExternalLink url="https://github.com/pnw-henry" icon={faGithub} />
      <ExternalLink
        url="https://www.linkedin.com/in/pnw-henry/"
        icon={faLinkedin}
      />
      <ExternalLink url="mailto:henrye@gmail.com" icon={faEnvelope} />
      {!isAboutRoute && <h2>Life is made of small moments like these</h2>}
    </section>
  );
}

export default SocialLinks;
