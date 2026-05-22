import React from "react";

function BottomPanel({ 
  sheetState, 
  setSheetState, 
  activeTab, 
  setActiveTab,
  selectedBus,
  onCloseDetails,
  children
}) {
  
  // Toggle heights: Collapsed (80px), Half (40%), Full (85%)
  const cycleState = () => {
    if (sheetState === "collapsed") {
      setSheetState("half");
    } else if (sheetState === "half") {
      setSheetState("full");
    } else {
      setSheetState("collapsed");
    }
  };

  const setFull = () => setSheetState("full");
  const setHalf = () => setSheetState("half");
  const setCollapsed = () => setSheetState("collapsed");

  return (
    <div className={`bottom-sheet ${sheetState}`}>
      {/* DRAG HANDLE BAR */}
      <div className="sheet-handle-container" onClick={cycleState}>
        <div className="sheet-handle"></div>
      </div>

      {/* HEADER SECTION */}
      <div className="sheet-header">
        {!selectedBus ? (
          <div className="tab-menu">
            <button 
              className={`tab-btn ${activeTab === "explore" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("explore");
                if (sheetState === "collapsed") setHalf();
              }}
            >
              📍 Nearby Buses
            </button>
            <button 
              className={`tab-btn ${activeTab === "search" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("search");
                if (sheetState === "collapsed") setHalf();
              }}
            >
              🔍 Plan Route
            </button>
          </div>
        ) : (
          <div className="details-header">
            <button className="back-btn" onClick={onCloseDetails}>
              ← Back to List
            </button>
            <div className="details-header-title">
              <span className="selected-route-pill">Route {selectedBus.routeNo}</span>
              <span className="live-pulse-dot"></span> Live Tracking
            </div>
          </div>
        )}
      </div>

      {/* BODY CONTENT - SCROLLABLE */}
      <div className="sheet-body">
        {children}
      </div>

      {/* SHEET CONTROL FLOATING ACTIONS ON SCREEN (e.g. Expand/Collapse arrows inside sheet footer) */}
      <div className="sheet-footer-controls">
        {sheetState !== "full" && (
          <button className="sheet-control-btn" onClick={setFull} title="Expand Full">
            ▲
          </button>
        )}
        {sheetState !== "collapsed" && (
          <button className="sheet-control-btn" onClick={setCollapsed} title="Collapse">
            ▼
          </button>
        )}
      </div>
    </div>
  );
}

export default BottomPanel;
