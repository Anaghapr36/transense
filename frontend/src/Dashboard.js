import React, { useState, useEffect, useMemo, useCallback } from "react";
import Map from "./components/Map";
import BottomPanel from "./components/BottomPanel";
import Search from "./components/Search";
import BusCard from "./components/BusCard";

import LocationModal from "./components/LocationModal";
import Header from "./components/Header";

import transitLogo from "./logo.svg";
// import { CITIES, CITY_STOPS, CITY_ROUTES, CITY_BUS_TEMPLATES, CITY_CENTERS, advanceBusLocation } from "./data/mockTransitData";
import { 
  CITY_STOPS, 
  CITY_ROUTES, 
  CITY_BUS_TEMPLATES, 
  CITY_CENTERS,
  advanceBusLocation 
} from "./data/mockTransitData";
import "./Dashboard.css";

function Dashboard({ user, logout }) {
  // Config state
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("selectedCity") || "Bangalore";
  });
  const [viewMode, setViewMode] = useState("desktop"); // "desktop", "mobile"
  const [speakingBusId, setSpeakingBusId] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Active City Datasets
  const activeCityRoutes = useMemo(() => CITY_ROUTES[selectedCity] || CITY_ROUTES["Bangalore"], [selectedCity]);
  const activeCityStops = useMemo(() => CITY_STOPS[selectedCity] || CITY_STOPS["Bangalore"], [selectedCity]);

  // Dynamic Weather & Atmospheric Advisory Integration
  const weatherAdvisory = useMemo(() => {
    const defaultWeather = {
      temp: "29°C",
      condition: "🌤️ Clear Sky",
      airQuality: "AQI: 48 (Good)",
      tip: "🌞 Ideal conditions for urban transit commute."
    };
    const weatherData = {
      "Bangalore": {
        temp: "27°C",
        condition: "⛅ Partially Cloudy",
        airQuality: "AQI: 42 (Excellent)",
        tip: "🍃 Comfort wind active! Great day for low-carbon travel on standard lines."
      },
      "Mysore": {
        temp: "31°C",
        condition: "☀️ High UV Sunny",
        airQuality: "AQI: 56 (Moderate)",
        tip: "🥵 Afternoon heat advisory. Vajra AC lines recommended for optimal cooling."
      },
      "Chennai": {
        temp: "33°C",
        condition: "🥵 Humid & Sunny",
        airQuality: "AQI: 65 (Moderate)",
        tip: "💦 High humidity alert. AC Deluxe lines recommended."
      },
      "Hubli": {
        temp: "30°C",
        condition: "☀️ Sunny",
        airQuality: "AQI: 52 (Moderate)",
        tip: "🧢 Wear a cap for outside waiting times at Unkal Lake."
      },
      "Coimbatore": {
        temp: "29°C",
        condition: "⛅ Breeze & Clouds",
        airQuality: "AQI: 38 (Excellent)",
        tip: "🍃 Very pleasant afternoon breeze for travel."
      },
      "Kochi": {
        temp: "31°C",
        condition: "🌧️ Light Showers",
        airQuality: "AQI: 30 (Excellent)",
        tip: "☔ Light monsoon rain. Stay inside direct bus shelters."
      },
      "Trivandrum": {
        temp: "30°C",
        condition: "🌤️ Warm",
        airQuality: "AQI: 35 (Excellent)",
        tip: "🌴 Clear skies. Perfect for boarding public coastal lines."
      }
    };
    return weatherData[selectedCity] || defaultWeather;
  }, [selectedCity]);

  // Live states
  const [buses, setBuses] = useState(() => {
    const initialCity = localStorage.getItem("selectedCity") || "Bangalore";
    const templates = CITY_BUS_TEMPLATES[initialCity] || CITY_BUS_TEMPLATES["Bangalore"];
    const routes = CITY_ROUTES[initialCity] || CITY_ROUTES["Bangalore"];
    return templates.map((bus) => {
      const route = routes[bus.routeNo];
      if (!route || !route.polyline || route.polyline.length === 0) return bus;
      const { currentIdx, progress } = bus;
      const startPt = route.polyline[currentIdx];
      const endPt = route.polyline[currentIdx + 1] || startPt;
      
      const lat = startPt[0] + (endPt[0] - startPt[0]) * progress;
      const lng = startPt[1] + (endPt[1] - startPt[1]) * progress;
      
      return {
        ...bus,
        lat,
        lng,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    });
  });

  const [userLocation, setUserLocation] = useState(null);
  
  // Interaction states
  const [sheetState, setSheetState] = useState("half"); // collapsed, half, full
  const [activeTab, setActiveTab] = useState("explore"); // explore, search
  const [selectedBus, setSelectedBus] = useState(null);
  const [sosStatus, setSosStatus] = useState(false);
  const [trafficLayer, setTrafficLayer] = useState(false);
  
  // Search states
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [activeRouteNo, setActiveRouteNo] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Screen size listener to auto-switch viewMode on mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setViewMode("mobile");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize and Reset coordinates helper for city switching
  const getInitialBuses = (city) => {
    const templates = CITY_BUS_TEMPLATES[city] || [];
    const routes = CITY_ROUTES[city] || {};
    return templates.map((bus) => {
      const route = routes[bus.routeNo];
      if (!route || !route.polyline || route.polyline.length === 0) return bus;
      const { currentIdx, progress } = bus;
      const startPt = route.polyline[currentIdx];
      const endPt = route.polyline[currentIdx + 1] || startPt;
      
      const lat = startPt[0] + (endPt[0] - startPt[0]) * progress;
      const lng = startPt[1] + (endPt[1] - startPt[1]) * progress;
      
      return {
        ...bus,
        lat,
        lng,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    });
  };

  // Reset city states whenever city changes
  useEffect(() => {
    setBuses(getInitialBuses(selectedCity));
    setSearchFrom("");
    setSearchTo("");
    setSearchTriggered(false);
    setActiveRouteNo(null);
    setSelectedBus(null);
    
    const center = CITY_CENTERS[selectedCity] || [12.9716, 77.6068];
    setUserLocation(center);
  }, [selectedCity]);

  // 1. Simulation Loop: Move buses along their route polylines
  useEffect(() => {
    const timer = setInterval(() => {
      setBuses((prevBuses) => prevBuses.map((bus) => advanceBusLocation(bus, activeCityRoutes)));
    }, 2500);

    return () => clearInterval(timer);
  }, [activeCityRoutes]);

  // 3. Reset to User Location
  const handleRecenterUser = () => {
    const center = CITY_CENTERS[selectedCity] || [12.9716, 77.6068];
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserLocation(center);
          alert("GPS access denied. Centered on active city center (Simulated).");
        }
      );
    } else {
      setUserLocation(center);
    }
  };

  // 4. Trigger simulated SOS
  const handleTriggerSos = () => {
    setSosStatus(true);
    setTimeout(() => {
      setSosStatus(false);
      alert("⚠️ EMERGENCY SOS SENT! Operations command center has received your coordinates. Security dispatch initiated.");
    }, 1500);
  };

  // 5. Custom detector for Search Location
  const handleDetectLocation = (callback) => {
    const center = CITY_CENTERS[selectedCity] || [12.9716, 77.6068];
    const defaultStop = Object.keys(activeCityStops)[0] || "City Center";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = [position.coords.latitude, position.coords.longitude];
          setUserLocation(latlng);
          callback(latlng, "Your Location");
        },
        () => {
          setUserLocation(center);
          callback(center, defaultStop);
        }
      );
    } else {
      setUserLocation(center);
      callback(center, defaultStop);
    }
  };

  // 6. Handle From -> To search submission
  const handleRouteSearch = (from, to) => {
    setSearchFrom(from);
    setSearchTo(to);
    setSearchTriggered(true);
    setSelectedBus(null);

    let foundRouteNo = null;
    const defaultFrom = Object.keys(activeCityStops)[0] || "City Center";
    Object.keys(activeCityRoutes).forEach((routeKey) => {
      const route = activeCityRoutes[routeKey];
      const fromIdx = route.stops.indexOf(from === "Your Location" ? defaultFrom : from);
      const toIdx = route.stops.indexOf(to);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
        foundRouteNo = routeKey;
      }
    });

    setActiveRouteNo(foundRouteNo);
    setSheetState("half");
  };

  // 7. Clear search and return to exploring
  const handleClearSearch = () => {
    setSearchFrom("");
    setSearchTo("");
    setSearchTriggered(false);
    setActiveRouteNo(null);
    setSelectedBus(null);
  };

  // 8. Dynamic ETA Calculation based on distance
  const getEtaToUser = useCallback((bus, fromStopName) => {
    const route = activeCityRoutes[bus.routeNo];
    if (!route) return 15;

    const defaultFrom = Object.keys(activeCityStops)[0] || "City Center";
    const stopName = (fromStopName === "Your Location" || !fromStopName) ? defaultFrom : fromStopName;
    const targetStopIdx = route.stops.indexOf(stopName);
    
    if (targetStopIdx === -1) return 15;

    const busIdx = bus.currentIdx;
    let stopsRemaining = 0;
    
    if (bus.direction > 0) {
      if (busIdx <= targetStopIdx) {
        stopsRemaining = targetStopIdx - busIdx - bus.progress;
      } else {
        stopsRemaining = (route.polyline.length - 1 - busIdx) + targetStopIdx;
      }
    } else {
      if (busIdx >= targetStopIdx) {
        stopsRemaining = busIdx - targetStopIdx + bus.progress;
      } else {
        stopsRemaining = busIdx + targetStopIdx;
      }
    }

    const calculatedEta = Math.max(2, Math.round(stopsRemaining * 6));
    return calculatedEta;
  }, [activeCityRoutes, activeCityStops]);

  // 9. Process active buses and ETAs
  const processedBuses = useMemo(() => {
    return buses.map((bus) => {
      const eta = getEtaToUser(bus, searchFrom);
      return {
        ...bus,
        calculatedEta: eta
      };
    });
  }, [buses, searchFrom, getEtaToUser]);

  // 10. Filtered list for search results or nearby
  const visibleBuses = useMemo(() => {
    if (activeRouteNo) {
      return processedBuses.filter((b) => b.routeNo === activeRouteNo);
    }
    return [...processedBuses].sort((a, b) => a.calculatedEta - b.calculatedEta);
  }, [processedBuses, activeRouteNo]);

  // 11. Smart Recommendation Engine
  const recommendation = useMemo(() => {
    if (visibleBuses.length === 0) return null;

    const fastest = [...visibleBuses].sort((a, b) => a.calculatedEta - b.calculatedEta)[0];
    const crowdPriority = { "Low": 1, "Medium": 2, "High": 3 };
    const leastCrowded = [...visibleBuses].sort((a, b) => crowdPriority[a.crowd] - crowdPriority[b.crowd])[0];

    let recommended = fastest;
    const lowCrowdBuses = visibleBuses.filter(b => b.crowd === "Low");
    if (lowCrowdBuses.length > 0) {
      const sortedLowCrowd = [...lowCrowdBuses].sort((a, b) => a.calculatedEta - b.calculatedEta);
      if (sortedLowCrowd[0].calculatedEta <= fastest.calculatedEta + 12) {
        recommended = sortedLowCrowd[0];
      }
    }

    return {
      fastestId: fastest.id,
      leastCrowdedId: leastCrowded.id,
      recommendedId: recommended.id
    };
  }, [visibleBuses]);

  // 12. Active visualizer details on map
  const activeRoutePolyline = useMemo(() => {
    if (selectedBus) {
      return activeCityRoutes[selectedBus.routeNo]?.polyline || null;
    }
    if (activeRouteNo) {
      return activeCityRoutes[activeRouteNo]?.polyline || null;
    }
    return null;
  }, [selectedBus, activeRouteNo, activeCityRoutes]);

  const activeRouteColor = useMemo(() => {
    if (selectedBus) {
      return activeCityRoutes[selectedBus.routeNo]?.color || null;
    }
    if (activeRouteNo) {
      return activeCityRoutes[activeRouteNo]?.color || null;
    }
    return null;
  }, [selectedBus, activeRouteNo, activeCityRoutes]);

  const activeStops = useMemo(() => {
    const routeKey = selectedBus?.routeNo || activeRouteNo;
    if (!routeKey || !activeCityRoutes[routeKey]) return null;

    return activeCityRoutes[routeKey].stops.map((stopName) => ({
      name: stopName,
      coordinates: activeCityStops[stopName]
    }));
  }, [selectedBus, activeRouteNo, activeCityRoutes, activeCityStops]);

  // 13. Stop-by-stop checklist for the details view
  const detailedStopsProgress = useMemo(() => {
    if (!selectedBus) return [];
    const route = activeCityRoutes[selectedBus.routeNo];
    if (!route) return [];

    const busIdx = selectedBus.currentIdx;
    
    return route.stops.map((stopName, idx) => {
      let status = "upcoming";
      if (idx < busIdx) {
        status = "passed";
      } else if (idx === busIdx) {
        status = "current";
      }
      
      return {
        name: stopName,
        status,
        eta: Math.max(0, (idx - busIdx) * 6)
      };
    });
  }, [selectedBus, activeCityRoutes]);

  // Voice stop announcer using SpeechSynthesis
  const handleVoiceAnnounce = (bus) => {
    if (!bus) return;
    if ('speechSynthesis' in window) {
      if (speakingBusId === bus.id) {
        window.speechSynthesis.cancel();
        setSpeakingBusId(null);
        return;
      }
      
      const route = activeCityRoutes[bus.routeNo];
      const currentStopName = detailedStopsProgress.find(s => s.status === "current")?.name || "its current route track";
      const nextStops = detailedStopsProgress.filter(s => s.status === "upcoming");
      const nextStopSpeech = nextStops.length > 0 ? `Next upcoming stop is ${nextStops[0].name}.` : "This bus is close to its terminal destination.";
      
      const text = `Live announcement. Route ${bus.routeNo} ${route?.type || "Standard"} towards ${route?.stops[route.stops.length - 1] || "destination"}. Arriving at stop in ${bus.calculatedEta} minutes. Current location is near ${currentStopName}. Live speed is ${bus.speed} kilometers per hour. Crowd level is ${bus.crowd.toLowerCase()} with safe spacing. ${nextStopSpeech}`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      
      utterance.onend = () => setSpeakingBusId(null);
      utterance.onerror = () => setSpeakingBusId(null);
      
      setSpeakingBusId(bus.id);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported on this browser.");
    }
  };

  // Cancel voice announce on bus selection change or component unmount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingBusId(null);
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedBus]);

  const handleSelectCity = (cityId) => {
    setSelectedCity(cityId);
    localStorage.setItem("selectedCity", cityId);
  };

  // RENDER PORTIONS
  const renderMobileLayout = () => {
    return (
      <div className="phone-screen">
        {/* PHONE STATUS BAR */}
        <div className="phone-status-bar">
          <span className="status-time">12:45</span>
          <div className="status-notch"></div>
          <div className="status-icons">
            <span className="status-icon">📶</span>
            <span className="status-icon">5G</span>
            <span className="status-icon">🔋 84%</span>
          </div>
        </div>

        {/* MAIN MAP INTERACTIVE AREA */}
        <div className="phone-content-canvas">
          <Map 
            buses={buses}
            routes={activeCityRoutes}
            userLocation={userLocation}
            selectedBus={selectedBus}
            activeRoutePolyline={activeRoutePolyline}
            activeRouteColor={activeRouteColor}
            activeStops={activeStops}
            onSelectBus={(bus) => {
              const enrichedBus = processedBuses.find(b => b.id === bus.id);
              setSelectedBus(enrichedBus);
              setSheetState("half");
            }}
          />

          {/* FLOATING HEADER PANEL */}
          <div className="floating-header-panel">
            <Header selectedCity={selectedCity} onLocationClick={() => setIsLocationModalOpen(true)} />
            {searchTriggered && (
              <div className="active-route-indicator-bar">
                <div className="active-route-detail">
                  <span className="route-circle">🎯</span>
                  <div className="route-endpoints-info">
                    <span>From: <strong>{searchFrom}</strong></span>
                    <span>To: <strong>{searchTo}</strong></span>
                  </div>
                </div>
                <button className="clear-search-btn" onClick={handleClearSearch} title="Reset Route">
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* FLOATING CONTROLS */}
          <div className="floating-map-controls">
            <button 
              className={`map-action-btn gps-btn ${userLocation ? "active" : ""}`} 
              onClick={handleRecenterUser}
              title="Recenter GPS"
            >
              🎯
            </button>
            <button 
              className={`map-action-btn layer-btn ${trafficLayer ? "active" : ""}`}
              onClick={() => setTrafficLayer(!trafficLayer)}
              title="Traffic Layer"
            >
              🌐
            </button>
            <button 
              className={`map-action-btn emergency-sos-btn ${sosStatus ? "active" : ""}`}
              onClick={handleTriggerSos}
              title="EMERGENCY SOS"
            >
              🚨
            </button>
          </div>

          {/* TRAFFIC LAYER ALERTS */}
          {trafficLayer && (
            <div className="simulated-traffic-overlay-alert">
              🚦 Traffic overlay active: 12-min delay on Ring Road due to construction.
            </div>
          )}

          {/* BOTTOM PANEL DRAWER */}
          <BottomPanel
            sheetState={sheetState}
            setSheetState={setSheetState}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedBus={selectedBus}
            onCloseDetails={() => setSelectedBus(null)}
          >
            {/* TAB 1: EXPLORE */}
            {!selectedBus && activeTab === "explore" && (
              <div className="tab-pane explore-pane">
                <div className="pane-intro">
                  <h3>Buses Nearby Your Location</h3>
                  <p>Showing simulated live arrivals near you</p>
                  
                  {/* Weather Advisory Card */}
                  <div className="weather-advisory-pill">
                    <div className="weather-main-row">
                      <span className="weather-condition">{weatherAdvisory.condition} • {weatherAdvisory.temp}</span>
                      <span className="weather-aqi">{weatherAdvisory.airQuality}</span>
                    </div>
                    <p className="weather-tip">{weatherAdvisory.tip}</p>
                  </div>
                  
                  {/* Dynamic simulated GPS locations based on active city's stop entries */}
                  <div className="simulated-location-selector">
                    <span className="sim-loc-label">Simulate GPS:</span>
                    <div className="sim-loc-buttons">
                      {Object.keys(activeCityStops).slice(0, 4).map((stopName) => {
                        const stopCoords = activeCityStops[stopName];
                        const isActive = userLocation && userLocation[0] === stopCoords[0] && userLocation[1] === stopCoords[1];
                        return (
                          <button 
                            key={stopName}
                            className={`sim-loc-btn ${isActive ? "active" : ""}`}
                            onClick={() => setUserLocation(stopCoords)}
                          >
                            {stopName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="bus-cards-list scrollable-y">
                  {processedBuses.length > 0 ? (
                    processedBuses.map((bus) => (
                      <BusCard
                        key={bus.id}
                        bus={bus}
                        route={activeCityRoutes[bus.routeNo]}
                        eta={bus.calculatedEta}
                        onClick={() => {
                          setSelectedBus(bus);
                          setSheetState("half");
                        }}
                        isSelected={selectedBus?.id === bus.id}
                      />
                    ))
                  ) : (
                    <div className="no-results-alert">
                      ℹ️ Active transit simulated networks are initializing for this location.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SEARCH */}
            {!selectedBus && activeTab === "search" && (
              <div className="tab-pane search-pane">
                <Search 
                  onSearch={handleRouteSearch}
                  initialFrom={searchFrom}
                  initialTo={searchTo}
                  onDetectLocation={handleDetectLocation}
                  stops={activeCityStops}
                />

                {searchTriggered && (
                  <div className="search-results-section">
                    <div className="results-header">
                      <h4>Available Options ({visibleBuses.length})</h4>
                      {activeRouteNo && (
                        <span className="results-subtitle">Route: {activeRouteNo}</span>
                      )}
                    </div>

                    {visibleBuses.length > 0 ? (
                      <div className="bus-cards-list">
                        {visibleBuses.map((bus) => {
                          const isRec = recommendation && bus.id === recommendation.recommendedId;
                          const isFast = recommendation && bus.id === recommendation.fastestId;
                          const isLeast = recommendation && bus.id === recommendation.leastCrowdedId;

                          return (
                            <BusCard
                              key={bus.id}
                              bus={bus}
                              route={activeCityRoutes[bus.routeNo]}
                              eta={bus.calculatedEta}
                              isRecommended={isRec}
                              isFastest={isFast}
                              isLeastCrowded={isLeast}
                              onClick={() => {
                                setSelectedBus(bus);
                                setSheetState("half");
                              }}
                              isSelected={selectedBus?.id === bus.id}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="no-results-alert">
                        ⚠️ No direct buses found from <strong>{searchFrom}</strong> to <strong>{searchTo}</strong>.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DETAILS */}
            {selectedBus && (
              <div className="tab-pane details-pane">
                <div className="details-bus-card-expanded">
                  <div className="route-details-row">
                    <div className="route-large-badge" style={{ backgroundColor: activeCityRoutes[selectedBus.routeNo]?.color }}>
                      {selectedBus.routeNo}
                    </div>
                    <div className="route-meta-expanded">
                      <h4>{activeCityRoutes[selectedBus.routeNo]?.type}</h4>
                      <p>{activeCityRoutes[selectedBus.routeNo]?.name}</p>
                    </div>
                  </div>

                  <div className="bus-dynamic-metrics-grid">
                    <div className="metric-box">
                      <span className="metric-icon">⏰</span>
                      <div className="metric-vals">
                        <strong>{selectedBus.calculatedEta} mins</strong>
                        <span>ETA to Stop</span>
                      </div>
                    </div>
                    <div className="metric-box">
                      <span className="metric-icon">👥</span>
                      <div className="metric-vals">
                        <strong className={`crowd-${selectedBus.crowd.toLowerCase()}`}>
                          {selectedBus.crowd}
                        </strong>
                        <span>Crowd Level</span>
                      </div>
                    </div>
                    <div className="metric-box">
                      <span className="metric-icon">⚡</span>
                      <div className="metric-vals">
                        <strong>{selectedBus.speed} km/h</strong>
                        <span>Live Speed</span>
                      </div>
                    </div>
                    <div className="metric-box">
                      <span className="metric-icon">🎫</span>
                      <div className="metric-vals">
                        <strong>{activeCityRoutes[selectedBus.routeNo]?.fare}</strong>
                        <span>Est. Fare</span>
                      </div>
                    </div>
                  </div>

                  {/* Gamified Eco Savings Banner */}
                  <div className="eco-points-banner">
                    <span className="eco-leaf">🌱</span>
                    <div className="eco-details">
                      <strong>Eco Savings: {((selectedBus.calculatedEta || 15) * 0.12).toFixed(1)} kg CO₂ Saved</strong>
                      <span>You earn +{Math.round((selectedBus.calculatedEta || 15) * 1.5)} Eco-Points on this trip!</span>
                    </div>
                    <span className="eco-badge-green">Sustainable</span>
                  </div>

                  {/* Commuter Voice Assistant Announcer */}
                  <div className="voice-announcer-panel">
                    <button 
                      className={`voice-announce-btn ${speakingBusId === selectedBus.id ? "speaking" : ""}`}
                      onClick={() => handleVoiceAnnounce(selectedBus)}
                    >
                      {speakingBusId === selectedBus.id ? (
                        <>
                          <span>🛑 Stop Voice Announcement</span>
                          <div className="audio-wave-visualizer">
                            <span className="wave-bar bar-1"></span>
                            <span className="wave-bar bar-2"></span>
                            <span className="wave-bar bar-3"></span>
                            <span className="wave-bar bar-4"></span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span>🔊 Voice Announce Stop Info</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="smart-advice-panel">
                    {selectedBus.crowd === "High" ? (
                      <div className="advice-badge alert-high">
                        🚨 <strong>High Crowd Level:</strong> Next bus in 15 mins is recommended.
                      </div>
                    ) : selectedBus.crowd === "Medium" ? (
                      <div className="advice-badge alert-medium">
                        ⚠️ <strong>Moderate Crowd:</strong> Seats are filling fast.
                      </div>
                    ) : (
                      <div className="advice-badge alert-low">
                        ✅ <strong>Comfortable Ride:</strong> Vacant seats available. Recommended!
                      </div>
                    )}
                  </div>

                  <div className="route-stepper-container">
                    <h4>🚏 Route Progress & Stop Checklist</h4>
                    <div className="stepper-timeline">
                      {detailedStopsProgress.map((stop, sIdx) => (
                        <div key={sIdx} className={`stepper-node ${stop.status}`}>
                          <div className="stepper-bullet">
                            {stop.status === "passed" && "✓"}
                            {stop.status === "current" && "🚌"}
                          </div>
                          <div className="stepper-info">
                            <span className="stepper-stop-name">{stop.name}</span>
                            <span className="stepper-stop-eta">
                              {stop.status === "passed" ? "Passed" : stop.status === "current" ? "Arrived" : `in ${stop.eta} mins`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </BottomPanel>
        </div>
      </div>
    );
  };

  const isRealMobile = window.innerWidth <= 768;

  if (viewMode === "mobile") {
    if (isRealMobile) {
      return (
        <div className="bmtc-app-portal mobile-view-direct">
          {renderMobileLayout()}
          <LocationModal 
            isOpen={isLocationModalOpen} 
            onClose={() => setIsLocationModalOpen(false)} 
            selectedCity={selectedCity} 
            onSelectCity={handleSelectCity} 
          />
        </div>
      );
    }

    return (
      <div className="bmtc-app-portal">
        <div className="ambient-background">
          <div className="mesh-gradient bg-1"></div>
          <div className="mesh-gradient bg-2"></div>
          <div className="grid-overlay"></div>
        </div>

        {/* Combined top nav bar for View Mode & BookMyShow Selector */}
        <div className="view-mode-toggle-bar">
          <div className="toggle-group">
            <button className={`view-mode-btn ${viewMode === "mobile" ? "active" : ""}`} onClick={() => setViewMode("mobile")}>
              📱 Mobile App
            </button>
            <button className={`view-mode-btn ${viewMode === "desktop" ? "active" : ""}`} onClick={() => setViewMode("desktop")}>
              🖥️ Widescreen
            </button>
          </div>
          <div className="toggle-divider"></div>
          <div className="toggle-group">

          </div>
        </div>

        <div className="smartphone-frame">
          {renderMobileLayout()}
        </div>

        <LocationModal 
          isOpen={isLocationModalOpen} 
          onClose={() => setIsLocationModalOpen(false)} 
          selectedCity={selectedCity} 
          onSelectCity={handleSelectCity} 
        />
      </div>
    );
  }

  // DESKTOP WEBSITE VIEW
  return (
    <div className="bmtc-app-portal desktop-layout-active">
      <div className="ambient-background">
        <div className="mesh-gradient bg-1"></div>
        <div className="mesh-gradient bg-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="desktop-dashboard-container">
        {/* HEADER */}
        <Header selectedCity={selectedCity} onLocationClick={() => setIsLocationModalOpen(true)} />

        {/* Combined top nav bar for View Mode & BookMyShow Selector */}
        <div className="view-mode-toggle-bar">
          <div className="toggle-group">
            <button className={`view-mode-btn ${viewMode === "mobile" ? "active" : ""}`} onClick={() => setViewMode("mobile")}>
              📱 Mobile App
            </button>
            <button className={`view-mode-btn ${viewMode === "desktop" ? "active" : ""}`} onClick={() => setViewMode("desktop")}>
              🖥️ Widescreen
            </button>
          </div>
          <div className="toggle-divider"></div>
          <div className="toggle-group">

          </div>
        </div>

        {/* SIDEBAR PANEL */}
        <div className="desktop-sidebar">
          <div className="desktop-sidebar-header">
            <div className="brand-logo-glow">
              <img src={transitLogo} alt="TransitSense" className="portal-logo" />
            </div>
            <div className="brand-title-wrap">
              <h2>TransitSense</h2>
              <p>Live Transit & Fleet Command</p>
            </div>
          </div>

          {/* User profile card inside sidebar */}
          <div className="desktop-user-card">
            <div className="user-info-row">
              <span className="user-icon">👤</span>
              <div className="user-text">
                <strong>{user?.name || "Passenger"}</strong>
                <p>Operations Command</p>
              </div>
            </div>
            <button className="portal-signout-btn" onClick={logout}>Sign Out</button>
          </div>

          {/* Active Network Trigger badge (links into Location Modal) */}
          <div className="desktop-city-selector">
            <label>🗺️ Active Transit Network</label>
            <button 
              type="button" 
              className="desktop-city-select-trigger" 
              onClick={() => setIsLocationModalOpen(true)}
            >
              📍 {selectedCity === "Bangalore" ? "Bengaluru (BMTC)" : selectedCity === "Mysore" ? "Mysuru (MCTS)" : `${selectedCity} Service`} ▾
            </button>
          </div>

          {/* TAB SWITCHER */}
          {!selectedBus && (
            <div className="desktop-tabs-header">
              <button 
                className={`desktop-tab-btn ${activeTab === "explore" ? "active" : ""}`}
                onClick={() => setActiveTab("explore")}
              >
                📍 Explore Nearby
              </button>
              <button 
                className={`desktop-tab-btn ${activeTab === "search" ? "active" : ""}`}
                onClick={() => setActiveTab("search")}
              >
                🔍 Plan Route
              </button>
            </div>
          )}

          {/* SIDEBAR DYNAMIC BODY */}
          <div className="desktop-sidebar-body scrollable-y">
            {selectedBus ? (
              <div className="desktop-details-wrapper">
                <button className="back-btn-desktop" onClick={() => setSelectedBus(null)}>
                  ← Back to Listings
                </button>
                
                <div className="details-bus-card-expanded">
                  <div className="route-details-row">
                    <div className="route-large-badge" style={{ backgroundColor: activeCityRoutes[selectedBus.routeNo]?.color }}>
                      {selectedBus.routeNo}
                    </div>
                    <div className="route-meta-expanded">
                      <h4>{activeCityRoutes[selectedBus.routeNo]?.type}</h4>
                      <p>{activeCityRoutes[selectedBus.routeNo]?.name}</p>
                    </div>
                  </div>

                  <div className="bus-dynamic-metrics-grid">
                    <div className="metric-box">
                      <span className="metric-icon">⏰</span>
                      <div className="metric-vals">
                        <strong>{selectedBus.calculatedEta} mins</strong>
                        <span>ETA to Stop</span>
                      </div>
                    </div>
                    <div className="metric-box">
                      <span className="metric-icon">👥</span>
                      <div className="metric-vals">
                        <strong className={`crowd-${selectedBus.crowd.toLowerCase()}`}>
                          {selectedBus.crowd}
                        </strong>
                        <span>Crowd Level</span>
                      </div>
                    </div>
                    <div className="metric-box">
                      <span className="metric-icon">⚡</span>
                      <div className="metric-vals">
                        <strong>{selectedBus.speed} km/h</strong>
                        <span>Live Speed</span>
                      </div>
                    </div>
                    <div className="metric-box">
                      <span className="metric-icon">🎫</span>
                      <div className="metric-vals">
                        <strong>{activeCityRoutes[selectedBus.routeNo]?.fare}</strong>
                        <span>Est. Fare</span>
                      </div>
                    </div>
                  </div>

                  {/* Gamified Eco Savings Banner */}
                  <div className="eco-points-banner">
                    <span className="eco-leaf">🌱</span>
                    <div className="eco-details">
                      <strong>Eco Savings: {((selectedBus.calculatedEta || 15) * 0.12).toFixed(1)} kg CO₂ Saved</strong>
                      <span>You earn +{Math.round((selectedBus.calculatedEta || 15) * 1.5)} Eco-Points on this trip!</span>
                    </div>
                    <span className="eco-badge-green">Sustainable</span>
                  </div>

                  {/* Commuter Voice Assistant Announcer */}
                  <div className="voice-announcer-panel">
                    <button 
                      className={`voice-announce-btn ${speakingBusId === selectedBus.id ? "speaking" : ""}`}
                      onClick={() => handleVoiceAnnounce(selectedBus)}
                    >
                      {speakingBusId === selectedBus.id ? (
                        <>
                          <span>🛑 Stop Voice Announcement</span>
                          <div className="audio-wave-visualizer">
                            <span className="wave-bar bar-1"></span>
                            <span className="wave-bar bar-2"></span>
                            <span className="wave-bar bar-3"></span>
                            <span className="wave-bar bar-4"></span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span>🔊 Voice Announce Stop Info</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="smart-advice-panel">
                    {selectedBus.crowd === "High" ? (
                      <div className="advice-badge alert-high">
                        🚨 <strong>High Crowd Level:</strong> Next bus in 15 mins is recommended.
                      </div>
                    ) : selectedBus.crowd === "Medium" ? (
                      <div className="advice-badge alert-medium">
                        ⚠️ <strong>Moderate Crowd:</strong> Seats are filling fast.
                      </div>
                    ) : (
                      <div className="advice-badge alert-low">
                        ✅ <strong>Comfortable Ride:</strong> Vacant seats available. Recommended!
                      </div>
                    )}
                  </div>

                  <div className="route-stepper-container">
                    <h4>🚏 Route Progress & Stop Checklist</h4>
                    <div className="stepper-timeline">
                      {detailedStopsProgress.map((stop, sIdx) => (
                        <div key={sIdx} className={`stepper-node ${stop.status}`}>
                          <div className="stepper-bullet">
                            {stop.status === "passed" && "✓"}
                            {stop.status === "current" && "🚌"}
                          </div>
                          <div className="stepper-info">
                            <span className="stepper-stop-name">{stop.name}</span>
                            <span className="stepper-stop-eta">
                              {stop.status === "passed" ? "Passed" : stop.status === "current" ? "Arrived" : `in ${stop.eta} mins`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === "explore" ? (
              <div className="desktop-explore-pane">
                <div className="pane-intro">
                  <h3>Buses Nearby Your Location</h3>
                  <p>Showing simulated live arrivals near you</p>
                  
                  {/* Weather Advisory Card */}
                  <div className="weather-advisory-pill">
                    <div className="weather-main-row">
                      <span className="weather-condition">{weatherAdvisory.condition} • {weatherAdvisory.temp}</span>
                      <span className="weather-aqi">{weatherAdvisory.airQuality}</span>
                    </div>
                    <p className="weather-tip">{weatherAdvisory.tip}</p>
                  </div>
                  
                  {/* Dynamic simulated GPS locations based on active city's stop entries */}
                  <div className="simulated-location-selector">
                    <span className="sim-loc-label">Simulate GPS:</span>
                    <div className="sim-loc-buttons">
                      {Object.keys(activeCityStops).slice(0, 4).map((stopName) => {
                        const stopCoords = activeCityStops[stopName];
                        const isActive = userLocation && userLocation[0] === stopCoords[0] && userLocation[1] === stopCoords[1];
                        return (
                          <button 
                            key={stopName}
                            className={`sim-loc-btn ${isActive ? "active" : ""}`}
                            onClick={() => setUserLocation(stopCoords)}
                          >
                            {stopName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bus-cards-list">
                  {processedBuses.length > 0 ? (
                    processedBuses.map((bus) => (
                      <BusCard
                        key={bus.id}
                        bus={bus}
                        route={activeCityRoutes[bus.routeNo]}
                        eta={bus.calculatedEta}
                        onClick={() => setSelectedBus(bus)}
                        isSelected={selectedBus?.id === bus.id}
                      />
                    ))
                  ) : (
                    <div className="no-results-alert">
                      ℹ️ Active transit simulated networks are initializing for this location.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="desktop-search-pane">
                <Search 
                  onSearch={handleRouteSearch}
                  initialFrom={searchFrom}
                  initialTo={searchTo}
                  onDetectLocation={handleDetectLocation}
                  stops={activeCityStops}
                />

                {searchTriggered && (
                  <div className="search-results-section">
                    <div className="results-header">
                      <h4>Available Options ({visibleBuses.length})</h4>
                      {activeRouteNo && (
                        <span className="results-subtitle">Route: {activeRouteNo}</span>
                      )}
                    </div>

                    {visibleBuses.length > 0 ? (
                      <div className="bus-cards-list">
                        {visibleBuses.map((bus) => {
                          const isRec = recommendation && bus.id === recommendation.recommendedId;
                          const isFast = recommendation && bus.id === recommendation.fastestId;
                          const isLeast = recommendation && bus.id === recommendation.leastCrowdedId;

                          return (
                            <BusCard
                              key={bus.id}
                              bus={bus}
                              route={activeCityRoutes[bus.routeNo]}
                              eta={bus.calculatedEta}
                              isRecommended={isRec}
                              isFastest={isFast}
                              isLeastCrowded={isLeast}
                              onClick={() => setSelectedBus(bus)}
                              isSelected={selectedBus?.id === bus.id}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="no-results-alert">
                        ⚠️ No direct buses found from <strong>{searchFrom}</strong> to <strong>{searchTo}</strong>.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STATS AT THE SIDEBAR BOTTOM */}
          <div className="desktop-sidebar-footer">
            <h3>📈 Operations Status ({selectedCity === "Bangalore" ? "Bengaluru" : selectedCity === "Mysore" ? "Mysuru" : selectedCity})</h3>
            <div className="footer-stat-row">
              <span>Simulated Buses</span>
              <strong>{buses.length} Active</strong>
            </div>
            <div className="footer-stat-row">
              <span>Lines Covered</span>
              <strong>{Object.keys(activeCityRoutes).length} Routes</strong>
            </div>
          </div>
        </div>

        {/* FULL SCREEN MAP CONTAINER */}
        <div className="desktop-map-container">
          <Map 
            buses={buses}
            routes={activeCityRoutes}
            userLocation={userLocation}
            selectedBus={selectedBus}
            activeRoutePolyline={activeRoutePolyline}
            activeRouteColor={activeRouteColor}
            activeStops={activeStops}
            onSelectBus={(bus) => {
              const enrichedBus = processedBuses.find(b => b.id === bus.id);
              setSelectedBus(enrichedBus);
            }}
          />

          {/* FLOATING HEADER FOR ROUTE INDICATOR IF SEARCHED */}
          {searchTriggered && (
            <div className="floating-header-panel-desktop">
              <div className="active-route-indicator-bar">
                <div className="active-route-detail">
                  <span className="route-circle">🎯</span>
                  <div className="route-endpoints-info">
                    <span>From: <strong>{searchFrom}</strong></span>
                    <span>To: <strong>{searchTo}</strong></span>
                  </div>
                </div>
                <button className="clear-search-btn" onClick={handleClearSearch} title="Reset Route">
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* FLOATING MAP CONTROLS OVER MAP */}
          <div className="floating-map-controls-desktop">
            <button 
              className={`map-action-btn gps-btn ${userLocation ? "active" : ""}`} 
              onClick={handleRecenterUser}
              title="Recenter GPS"
            >
              🎯 Recenter
            </button>
            <button 
              className={`map-action-btn layer-btn ${trafficLayer ? "active" : ""}`}
              onClick={() => setTrafficLayer(!trafficLayer)}
              title="Traffic Layer"
            >
              🌐 Traffic
            </button>
            <button 
              className={`map-action-btn emergency-sos-btn ${sosStatus ? "active" : ""}`}
              onClick={handleTriggerSos}
              title="EMERGENCY SOS"
            >
              🚨 EMERGENCY SOS
            </button>
          </div>

          {/* TRAFFIC ALERTS */}
          {trafficLayer && (
            <div className="simulated-traffic-overlay-alert-desktop">
              🚦 Traffic Alert: 12-min delay on Ring Road due to construction.
            </div>
          )}
        </div>
      </div>

      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        selectedCity={selectedCity} 
        onSelectCity={handleSelectCity} 
      />
    </div>
  );
}

export default Dashboard;