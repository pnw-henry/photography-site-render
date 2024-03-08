import React from "react";
import "../css/PhotoModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";

function PhotoModal({ photoUrl, onClose }) {
  const handleRightClick = (event) => {
    event.preventDefault();
  };

  return (
    <div className="photo-modal-backdrop" onClick={onClose}>
      <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="photo-modal-container">
          <img
            src={photoUrl}
            alt="Expanded Photograph"
            onContextMenu={handleRightClick}
          />
        </div>
        <button className="photo-modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faRectangleXmark} />
        </button>
      </div>
    </div>
  );
}

export default PhotoModal;
