import React from "react";

function BusCard({ bus, route, eta, isRecommended, isFastest, isLeastCrowded, onClick, isSelected }) {
  const getCrowdColor = (crowd) => {
    switch (crowd) {
      case "Low":
        return "#10b981"; // Emerald
      case "Medium":
        return "#f59e0b"; // Amber
      case "High":
        return "#ef4444"; // Rose
      default:
        return "#6b7280";
    }
  };

  const getCrowdLabel = (crowd) => {
    switch (crowd) {
      case "Low":
        return "Not Crowded";
      case "Medium":
        return "Moderately Crowded";
      case "High":
        return "Very Crowded";
      default:
        return crowd;
    }
  };

  const co2Saved = ((bus.calculatedEta || eta || 15) * 0.12).toFixed(1);
  const isPremium = route.type && (route.type.toLowerCase().includes("ac") || route.type.toLowerCase().includes("vajra") || route.type.toLowerCase().includes("airavata"));

  return (
    <div 
      className={`bus-card ${isSelected ? "selected" : ""}`} 
      onClick={onClick}
      style={{
        borderLeft: `4px solid ${route.color || "#0052cc"}`
      }}
    >
      <div className="bus-card-header">
        <span 
          className="route-badge" 
          style={{ backgroundColor: route.color || "#0052cc" }}
        >
          {bus.routeNo}
        </span>
        <span className="bus-type">{route.type}</span>
        
        <div className="card-badges">
          {isRecommended && <span className="badge recommended-badge">★ Recommended</span>}
          {isFastest && !isRecommended && <span className="badge fastest-badge">⚡ Fastest</span>}
          {isLeastCrowded && !isRecommended && <span className="badge crowd-badge">👥 Empty</span>}
          <span className="badge eco-badge" title="Carbon emissions saved compared to driving a private taxi.">🌱 {co2Saved}kg CO₂</span>
        </div>
      </div>

      <div className="bus-card-body">
        <div className="route-info">
          <div className="route-endpoints">
            <strong>{route.stops[0]}</strong>
            <span className="route-arrow">→</span>
            <strong>{route.stops[route.stops.length - 1]}</strong>
          </div>
          <span className="bus-duration">{route.duration} • {route.fare}</span>
        </div>

        <div className="eta-section">
          <span className="eta-value">{eta} <small>mins</small></span>
          <span className="eta-label">ETA</span>
        </div>
      </div>

      <div className="bus-amenities-row">
        <div className="bus-amenities">
          {isPremium && <span className="amenity-chip" title="Air Conditioned Commute">❄️ AC</span>}
          <span className="amenity-chip" title="USB Mobile Charging Active">🔌 USB</span>
          <span className="amenity-chip" title="Low-floor Wheelchair Accessible">♿ Access</span>
          {isPremium && <span className="amenity-chip" title="Complimentary High-speed Wi-Fi">📶 Wi-Fi</span>}
        </div>
      </div>

      <div className="bus-card-footer">
        <div className="crowd-indicator">
          <div className="crowd-dot" style={{ backgroundColor: getCrowdColor(bus.crowd) }}></div>
          <span className="crowd-text" style={{ color: getCrowdColor(bus.crowd) }}>
            {getCrowdLabel(bus.crowd)}
          </span>
        </div>

        <div className="bus-stats">
          <span>⚡ {bus.speed} km/h</span>
        </div>
      </div>
    </div>
  );
}

export default BusCard;
