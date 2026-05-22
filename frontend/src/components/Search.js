import React, { useState, useEffect, useRef } from "react";
import { STOPS } from "../data/mockTransitData";

function Search({ onSearch, initialFrom = "", initialTo = "", onDetectLocation, stops }) {
  const [fromInput, setFromInput] = useState(initialFrom);
  const [toInput, setToInput] = useState(initialTo);
  const [activeInput, setActiveInput] = useState(null); // 'from' or 'to'
  const [suggestions, setSuggestions] = useState([]);
  
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const suggestionsRef = useRef(null);

  const stopNames = Object.keys(stops || STOPS);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !fromRef.current.contains(event.target) &&
        !toRef.current.contains(event.target)
      ) {
        setActiveInput(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (val, field) => {
    if (field === "from") {
      setFromInput(val);
    } else {
      setToInput(val);
    }

    if (val.trim() === "") {
      setSuggestions(stopNames);
    } else {
      const filtered = stopNames.filter(stop => 
        stop.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleFocus = (field) => {
    setActiveInput(field);
    const currentVal = field === "from" ? fromInput : toInput;
    if (currentVal.trim() === "") {
      setSuggestions(stopNames);
    } else {
      const filtered = stopNames.filter(stop => 
        stop.toLowerCase().includes(currentVal.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const selectSuggestion = (stop) => {
    if (activeInput === "from") {
      setFromInput(stop);
      // Automatically shift focus to "to" field if it's empty
      if (!toInput) {
        setTimeout(() => toRef.current?.focus(), 100);
      }
    } else {
      setToInput(stop);
    }
    setActiveInput(null);
  };

  const handleSwap = () => {
    setFromInput(toInput);
    setToInput(fromInput);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromInput && toInput) {
      onSearch(fromInput, toInput);
    }
  };

  const handleUseCurrentLocation = () => {
    onDetectLocation((latlng, stopName) => {
      setFromInput(stopName || "Your Location");
    });
    setActiveInput(null);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-inputs-wrapper">
          {/* FROM INPUT */}
          <div className="search-field" ref={fromRef}>
            <div className="search-icon-dot green"></div>
            <input
              type="text"
              placeholder="From: Select starting stop"
              value={fromInput}
              onChange={(e) => handleInputChange(e.target.value, "from")}
              onFocus={() => handleFocus("from")}
              className="search-input"
            />
            {fromInput && (
              <button 
                type="button" 
                className="clear-input-btn" 
                onClick={() => handleInputChange("", "from")}
              >
                ✕
              </button>
            )}
          </div>

          {/* SWAP BUTTON */}
          <button type="button" className="swap-btn" onClick={handleSwap}>
            ⇅
          </button>

          {/* TO INPUT */}
          <div className="search-field" ref={toRef}>
            <div className="search-icon-dot red"></div>
            <input
              type="text"
              placeholder="To: Select destination stop"
              value={toInput}
              onChange={(e) => handleInputChange(e.target.value, "to")}
              onFocus={() => handleFocus("to")}
              className="search-input"
            />
            {toInput && (
              <button 
                type="button" 
                className="clear-input-btn" 
                onClick={() => handleInputChange("", "to")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* SUGGESTIONS PANEL */}
        {activeInput && (
          <div className="suggestions-panel" ref={suggestionsRef}>
            {activeInput === "from" && (
              <button 
                type="button" 
                className="suggestion-item current-location-item"
                onClick={handleUseCurrentLocation}
              >
                <span className="location-gps-icon">🎯</span> Use current location
              </button>
            )}
            
            <div className="suggestions-header">Popular Stops</div>
            
            {suggestions.length > 0 ? (
              suggestions.map((stop) => (
                <button
                  key={stop}
                  type="button"
                  className="suggestion-item"
                  onClick={() => selectSuggestion(stop)}
                >
                  <span className="pin-icon">📍</span>
                  <span className="stop-name">{stop}</span>
                </button>
              ))
            ) : (
              <div className="no-suggestions">No stops found matching "{activeInput === "from" ? fromInput : toInput}"</div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="search-submit-btn"
          disabled={!fromInput || !toInput}
        >
          Find Buses
        </button>
      </form>
    </div>
  );
}

export default Search;
