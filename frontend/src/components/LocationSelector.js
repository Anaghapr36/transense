import React from "react";
import { STATE_CITIES } from "../data/mockTransitData";

function LocationSelector({ selectedCity, onClick }) {
  // Find human friendly name
  let displayName = selectedCity;
  Object.keys(STATE_CITIES).forEach((stateName) => {
    const city = STATE_CITIES[stateName].find((c) => c.id === selectedCity);
    if (city) {
      displayName = city.name;
    }
  });

  return (
    <button type="button" className="location-selector-trigger" onClick={onClick}>
      <span className="pin-icon">📍</span>
      <span className="city-name">{displayName}</span>
      <span className="dropdown-chevron">▾</span>
    </button>
  );
}

export default LocationSelector;
