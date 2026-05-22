import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icons using Leaflet DivIcon
const createBusIcon = (bus, routeColor, crowdColor) => {
  return L.divIcon({
    className: "custom-bus-marker-container",
    html: `
      <div class="custom-bus-marker-bubble" style="background-color: ${routeColor}; border: 3px solid ${crowdColor}">
        <span class="bus-number">${bus.routeNo}</span>
        <div class="bus-direction-arrow ${bus.direction > 0 ? 'dir-forward' : 'dir-backward'}">➔</div>
      </div>
      <div class="custom-bus-marker-shadow"></div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -20]
  });
};

const createUserIcon = () => {
  return L.divIcon({
    className: "custom-user-marker-container",
    html: `
      <div class="user-pulse-dot">
        <div class="pulse-wave"></div>
        <div class="core-dot"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const createStopIcon = (routeColor) => {
  return L.divIcon({
    className: "custom-stop-marker-container",
    html: `
      <div class="stop-node" style="border: 2px solid ${routeColor}"></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

// Map controller to adjust view when path or center changes
function MapController({ center, zoom, bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (center) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [map, center, zoom, bounds]);

  return null;
}

function Map({ 
  buses, 
  routes, 
  userLocation, 
  selectedBus, 
  activeRoutePolyline, 
  activeRouteColor,
  activeStops,
  onSelectBus 
}) {
  
  const getCrowdColor = (crowd) => {
    switch (crowd) {
      case "Low":
        return "#10b981"; // Emerald green
      case "Medium":
        return "#f59e0b"; // Amber yellow
      case "High":
        return "#ef4444"; // Rose red
      default:
        return "#6b7280";
    }
  };

  // Determine map center and bounds
  const defaultCenter = [12.9716, 77.5946]; // Central Bangalore
  const mapCenter = userLocation || defaultCenter;
  
  // Calculate bounds if route polyline exists
  const mapBounds = activeRoutePolyline && activeRoutePolyline.length > 0
    ? L.latLngBounds(activeRoutePolyline)
    : null;

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        zoomControl={false} // Disable default top-left control to place custom top-right
        className="leaflet-map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Modern elegant light map style
        />

        {/* Map View Controller */}
        <MapController center={mapCenter} zoom={13} bounds={mapBounds} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserIcon()}>
            <Popup className="premium-popup">
              <div className="popup-content user-popup">
                <strong>📍 You are here</strong>
                <p>Bengaluru, Karnataka</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Active Route Polyline */}
        {activeRoutePolyline && (
          <Polyline 
            positions={activeRoutePolyline} 
            color={activeRouteColor || "#3b82f6"} 
            weight={6} 
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Route Stops Nodes */}
        {activeStops && activeStops.map((stop, index) => (
          <Marker 
            key={`stop-${index}`} 
            position={stop.coordinates} 
            icon={createStopIcon(activeRouteColor || "#3b82f6")}
          >
            <Popup className="premium-popup">
              <div className="popup-content stop-popup">
                <span className="stop-index">Stop {index + 1}</span>
                <strong>🚏 {stop.name}</strong>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Moving Buses Markers */}
        {buses.map((bus) => {
          const route = routes[bus.routeNo];
          if (!route) return null;
          const routeColor = route.color || "#3b82f6";
          const crowdColor = getCrowdColor(bus.crowd);
          const isSelected = selectedBus && selectedBus.id === bus.id;

          return (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={createBusIcon(bus, routeColor, isSelected ? "#ffffff" : crowdColor)}
              eventHandlers={{
                click: () => onSelectBus(bus),
              }}
            >
              <Popup className="premium-popup">
                <div className="popup-content bus-popup">
                  <div className="popup-header" style={{ borderBottom: `2px solid ${routeColor}` }}>
                    <span className="popup-route-pill" style={{ backgroundColor: routeColor }}>
                      {bus.routeNo}
                    </span>
                    <strong className="popup-title">{route.type}</strong>
                  </div>
                  <div className="popup-body">
                    <p>🌐 Direction: {bus.direction > 0 ? "Outgoing" : "Incoming"}</p>
                    <p>⚡ Speed: <strong>{bus.speed} km/h</strong></p>
                    <p>👥 Crowd Level: <strong style={{ color: crowdColor }}>{bus.crowd}</strong></p>
                    <p className="popup-time">Last update: {bus.lastUpdated || "Live"}</p>
                  </div>
                  <button 
                    className="popup-select-btn"
                    style={{ backgroundColor: routeColor }}
                    onClick={() => onSelectBus(bus)}
                  >
                    Track BMTC Bus
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default Map;
