import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import Navigation from "./Navigation";

import "../css/Code.css";
import { photoContext } from "../context/PhotoContext";

function Code() {
  const [appPhotos, setAppPhotos] = useState([]);
  const { photos } = useContext(photoContext);

  useEffect(() => {
    document.title = "Henry Escobar | App Portfolio";
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const appGallery = photos.filter((photo) => photo.key.startsWith("Apps/"));
    setAppPhotos(appGallery.map((photo) => photo.url));
  }, [photos]);

  const projects = [
    {
      name: "Wilder",
      description:
        "Find your next outdoor adventure by searching for hiking trails, learning about them, and reading trip reports from other users!",
      technologies: [
        "React.js",
        "Ruby on Rails",
        "PostgreSQL",
        "AWS S3",
        "Javascript",
        "CSS",
        "HTML",
      ],
      moreInfoLink: "https://www.wilder.living",
    },
  ];
  return (
    <section className="coding-portfolio">
      <Header />
      <Navigation />
      <h1 className="code-heading">App Portfolio</h1>
      <div className="project-container">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h2>{project.name}</h2>
            <img src={appPhotos[index]} alt={`Thumbnail of ${project.name}`} />
            <p>{project.description}</p>
            <div className="project-technologies">
              {project.technologies.map((tech, techIndex) => (
                <div className="project-technology" key={techIndex}>
                  {tech}
                </div>
              ))}
            </div>
            <button
              onClick={() => window.open(`${project.moreInfoLink}`, "_blank")}
              className="link-button"
            >
              {`Visit ${project.name}`}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Code;
