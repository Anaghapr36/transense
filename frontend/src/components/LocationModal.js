import React, { useState, useEffect, useRef } from "react";
import CityList from "./CityList";
import { STATE_CITIES } from "../data/mockTransitData";

function LocationModal({ isOpen, onClose, selectedCity, onSelectCity }) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside modal content to close
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Quick select popular cities (helper shortcut)
  const popularCities = [
    { id: "Bangalore", name: "Bengaluru" },
    { id: "Mysore", name: "Mysuru" },
    { id: "Chennai", name: "Chennai" },
    { id: "Kochi", name: "Kochi" }
  ];

  return (
    <div className="location-modal-backdrop" onClick={handleBackdropClick}>
      <div className="location-modal-content" ref={modalRef}>
        <div className="location-modal-header">
          <div className="modal-title-group">
            <h3>🗺️ Select Location</h3>
            <p>Choose a city to explore live transit fleets</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Close Location Selector">
            ✕
          </button>
        </div>

        <div className="modal-search-wrapper">
          <span className="modal-search-icon">🔍</span>
          <input
            type="text"
            ref={inputRef}
            placeholder="Search for your city or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="modal-search-input"
          />
        </div>

        {/* Popular Cities Quick Select List */}
        {searchQuery === "" && (
          <div className="popular-cities-section">
            <span className="popular-label">Popular Cities:</span>
            <div className="popular-cities-pills">
              {popularCities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  className={`popular-city-pill ${selectedCity === city.id ? "active" : ""}`}
                  onClick={() => {
                    onSelectCity(city.id);
                    onClose();
                  }}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="modal-cities-body scrollable-y">
          <CityList
            searchQuery={searchQuery}
            selectedCity={selectedCity}
            onSelectCity={(cityId) => {
              onSelectCity(cityId);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
