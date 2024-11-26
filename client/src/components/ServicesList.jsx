import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";
import { services } from "../context/photoServices.js";
import "../css/ServicesList.css";

const ServicesList = () => {
  return (
    <div className="services-list">
      <Header />
      <Navigation />
      {services.map((service) => {
        const { id, name, description, price } = service;
        return (
          <div className="service-card" key={id}>
            <h2>{name}</h2>
            <p>{description}</p>
            <p>{price}</p>
            <button className="details-button">
              <Link to={`/services/${id}`}>Details</Link>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesList;
