import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Navigation.css";

function Navigation({ isMainImageLoaded }) {
  const location = useLocation();
  const { pathname } = location;

  const isAbout = pathname === "/about";
  const isPortfolio = pathname === "/portfolio";

  return (
    <nav className={`nav-bar ${isMainImageLoaded ? "loaded" : ""}`}>
      {!isPortfolio && (
        <Link to="/portfolio" className="navigation-link">
          Portfolio
        </Link>
      )}
      {!isAbout && (
        <Link to="/about" className="navigation-link">
          About
        </Link>
      )}
    </nav>
  );
}

export default Navigation;
