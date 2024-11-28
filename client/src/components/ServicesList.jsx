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
    <div className="services-page">
      <Header />
      <Navigation />
      <h1 className="services-heading">Photography Services</h1>
      <section className="services-list">
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
      </section>
    </div>
  );
};

export default ServicesList;
