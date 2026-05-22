import React from "react";
import { STATE_CITIES } from "../data/mockTransitData";

function CityList({ searchQuery, selectedCity, onSelectCity }) {
  // Filter state_cities based on search query
  const filteredStates = Object.keys(STATE_CITIES).reduce((acc, stateName) => {
    const cities = STATE_CITIES[stateName];
    const filteredCities = cities.filter(
      (city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stateName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredCities.length > 0) {
      acc[stateName] = filteredCities;
    }
    return acc;
  }, {});

  const hasResults = Object.keys(filteredStates).length > 0;

  if (!hasResults) {
    return (
      <div className="city-list-no-results">
        🔍 No cities found matching "{searchQuery}"
      </div>
    );
  }

  return (
    <div className="city-list-container scrollable-y">
      {Object.keys(filteredStates).map((stateName) => (
        <div key={stateName} className="state-group">
          <h4 className="state-header-title">{stateName}</h4>
          <div className="city-buttons-grid">
            {filteredStates[stateName].map((city) => {
              const isSelected = selectedCity === city.id;
              return (
                <button
                  key={city.id}
                  type="button"
                  className={`city-select-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => onSelectCity(city.id)}
                >
                  <span className="city-btn-icon">📍</span>
                  <div className="city-btn-meta">
                    <span className="city-name-label">{city.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CityList;
