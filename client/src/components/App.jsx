import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MainLanding from "./MainLanding";
import About from "./About";
import Portfolio from "./Portfolio";
import Code from "./Code";
import PurchaseConfirm from "./PurchaseConfirm";
import ServicesList from "./ServicesList";
import { photoContext } from "../context/PhotoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const stripePromise = loadStripe(
  "pk_live_51Q8V7eJuChuTF1ivWDUWvuX3nbGhf1nLmzmRnAp9kMnSDakJYJFN0ktBMvfoGrsosOSxl4ZT9jREKYbF8rhX0cYJ00hvPIycsF"
);

function App() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const location = useLocation();
  const API = "/photographs";

  useEffect(() => {
    fetch(API)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong. Let me know? :(");
        }
        return response.json();
      })
      .then((photos) => {
        if (photos && Array.isArray(photos)) {
          const sortedData = photos.sort((a, b) => {
            return a.key.localeCompare(b.key);
          });
          setPhotos(sortedData);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    setFadeIn(true);

    const timer = setTimeout(() => setFadeIn(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <a href="https://www.instagram.com/pnw.henry/" className="social-icon">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
    );
  }

  return (
    <div className="App">
      <div className={fadeIn ? "fade-in" : ""}>
        <photoContext.Provider value={{ photos, setPhotos }}>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route
              path="/portfolio"
              element={
                <Elements stripe={stripePromise}>
                  <Portfolio />
                </Elements>
              }
            />
            <Route
              path="/lifestyle"
              element={
                <Elements stripe={stripePromise}>
                  <Portfolio />
                </Elements>
              }
            />
            <Route
              path="/outdoors"
              element={
                <Elements stripe={stripePromise}>
                  <Portfolio />
                </Elements>
              }
            />
            <Route path="/code" element={<Code />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/success" element={<PurchaseConfirm />} />
            <Route exact path="/" element={<MainLanding />} />
            <Route path="*" element={<MainLanding />} />
          </Routes>
        </photoContext.Provider>
      </div>
    </div>
  );
}

export default App;
