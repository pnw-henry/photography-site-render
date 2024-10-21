import React from "react";
import Purchase from "./Purchase";
import "../css/PhotoModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";

function PhotoModal({ photo, onClose }) {
  if (!photo) return null;
  const handleRightClick = (e) => {
    e.preventDefault();
  };
  return (
    <div className="photo-modal-backdrop" onClick={onClose}>
      <div
        className={`photo-modal-content show`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="photo-modal-image-container">
          <img
            src={photo.url}
            alt={photo.key}
            onContextMenu={handleRightClick}
          />
        </div>
        <div className="purchase-container">
          {photo.key.startsWith("Outdoors/") && <Purchase photo={photo} />}
        </div>
        <button className="photo-modal-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faRectangleXmark} />
        </button>
      </div>
    </div>
  );
}

export default PhotoModal;
