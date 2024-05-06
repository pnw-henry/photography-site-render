import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Navigation.css";

function Navigation({ allContentLoaded }) {
  const location = useLocation();
  const { pathname } = location;
  const [showNav, setShowNav] = useState(false);

  const isAbout = pathname === "/about";
  const isPortfolio = pathname === "/portfolio";
  const isCode = pathname === "/code";

  useEffect(() => {
    const timeout = setTimeout(() => {
      allContentLoaded?.loaded && setShowNav(true);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [allContentLoaded?.loaded]);

  return (
    <nav className={`nav-bar ${showNav ? "loaded" : ""}`}>
      {!isPortfolio && (
        <Link to="/portfolio" className="navigation-link">
          Photo
        </Link>
      )}
      {!isCode && (
        <Link to="/code" className="navigation-link">
          Code
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
