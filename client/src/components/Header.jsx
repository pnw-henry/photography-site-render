import React from "react";
import Logo from "./Logo";
import "../css/Header.css";
import "../css/Logo.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <section className="header">
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
