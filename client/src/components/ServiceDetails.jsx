import React from "react";
import Header from "./Header.jsx";
import Navigation from "./Navigation.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { services } from "../context/photoServices.js";

import "../css/ServiceDetails.css";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = services.find((service) => service.id.toString() === id);

  if (!service) {
    navigate("/services");
    return null;
  }

  const { name, details, price } = service;

  return (
    <div className="service-page">
      <Header />
      <Navigation />
      <div className="service-details">
        <h2>{name}</h2>
        <p>{details}</p>
        <p>{price}</p>
      </div>
      <div className="service-contact-form">
        <h3>Request More Information</h3>
        <p>
          Fill out the form below to request more information about this
          service.
        </p>
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message"></textarea>
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ServiceDetails;
