import React from "react";
import logo from "../assets/logo.png";
import LocationSelector from "./LocationSelector";

function Header({ selectedCity, onLocationClick }) {
  return (
    <header className="header">
      <div className="logo-badge">
        <img src={logo} alt="TransitSense Logo" />
      </div>
      <div className="brand-meta">
        <strong>TransitSense</strong>
        <span>Live Tracking Portal</span>
      </div>
      <LocationSelector selectedCity={selectedCity} onClick={onLocationClick} />
    </header>
  );
}

export default Header;
