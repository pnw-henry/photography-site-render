import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import "../css/Header.css";
import "../css/Logo.css";
import { Link } from "react-router-dom";

function Header({ allContentLoaded }) {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      allContentLoaded?.loaded && setShowHeader(true);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [allContentLoaded?.loaded]);

  return (
    <section className={`header ${showHeader ? "loaded" : ""}`}>
      <div className="logo">
        <h1>
          <Link to="/">
            <span className="logo-part">Henry</span>
            <span className="logo-part">
              Esc<span>{<Logo />}</span>bar
            </span>
          </Link>
        </h1>
      </div>
    </section>
  );
}

export default Header;
