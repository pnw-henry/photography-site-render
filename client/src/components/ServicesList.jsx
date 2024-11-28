import React, { useContext } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";
import { services } from "../context/photoServices.js";
import "../css/ServicesList.css";

import { photoContext } from "../context/PhotoContext";

const ServicesList = () => {
  const { photos } = useContext(photoContext);
  return (
    <div className="services-list">
      <Header />
      <Navigation />
      {services.map((service) => {
        const { id, name, description } = service;
        return (
          <div className="service-card" key={id}>
            <h2>{name}</h2>
            <p>{description}</p>
            <Link to={`/services/${id}`} className="details-link">
              Details →
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesList;
