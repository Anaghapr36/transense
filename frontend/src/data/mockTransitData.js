export const CITIES = {
  BANGALORE: "Bangalore",
  MYSORE: "Mysore",
  HUBLI: "Hubli",
  CHENNAI: "Chennai",
  COIMBATORE: "Coimbatore",
  KOCHI: "Kochi",
  TRIVANDRUM: "Trivandrum"
};

export const STATE_CITIES = {
  "Karnataka": [
    { id: "Bangalore", name: "Bengaluru", code: "BANGALORE" },
    { id: "Mysore", name: "Mysuru", code: "MYSORE" },
    { id: "Hubli", name: "Hubballi-Dharwad", code: "HUBLI" }
  ],
  "Tamil Nadu": [
    { id: "Chennai", name: "Chennai", code: "CHENNAI" },
    { id: "Coimbatore", name: "Coimbatore", code: "COIMBATORE" }
  ],
  "Kerala": [
    { id: "Kochi", name: "Kochi", code: "KOCHI" },
    { id: "Trivandrum", name: "Thiruvananthapuram", code: "TRIVANDRUM" }
  ]
};

export const CITY_CENTERS = {
  [CITIES.BANGALORE]: [12.9716, 77.6068],
  [CITIES.MYSORE]: [12.3086, 76.6542],
  [CITIES.HUBLI]: [15.3647, 75.1240],
  [CITIES.CHENNAI]: [13.0827, 80.2707],
  [CITIES.COIMBATORE]: [11.0168, 76.9558],
  [CITIES.KOCHI]: [9.9312, 76.2673],
  [CITIES.TRIVANDRUM]: [8.5241, 76.9366]
};

export const CITY_STOPS = {
  [CITIES.BANGALORE]: {
    "Majestic": [12.9779, 77.5724],
    "Corporation": [12.9698, 77.5898],
    "Brigade Road": [12.9734, 77.6068],
    "Shanti Nagar": [12.9540, 77.5900],
    "Lalbagh": [12.9460, 77.5900],
    "Koramangala": [12.9352, 77.6244],
    "Domlur": [12.9610, 77.6387],
    "HAL Airport": [12.9562, 77.6682],
    "Marathahalli": [12.9592, 77.6974],
    "Kadugodi": [12.9986, 77.7610],
    "Hebbal": [13.0354, 77.5978],
    "Manyata Tech Park": [13.0450, 77.6200],
    "KR Puram": [13.0120, 77.7050],
    "Silk Board": [12.9176, 77.6244],
    "Sarjapur": [12.9110, 77.6800],
    "Indiranagar": [12.9719, 77.6412]
  },
  [CITIES.MYSORE]: {
    "City Bus Stand": [12.3086, 76.6542],
    "Mysore Palace": [12.3051, 76.6551],
    "Railway Station": [12.3162, 76.6433],
    "Chamundi Hill": [12.2748, 76.6706],
    "Infosys Campus": [12.3508, 76.6136],
    "Gokulam": [12.3275, 76.6272],
    "Bannimantap": [12.3370, 76.6520]
  },
  [CITIES.HUBLI]: {
    "Hubli Bus Stand": [15.3524, 75.1380],
    "Unkal Lake": [15.3850, 75.1180],
    "Dharwad CBS": [15.4589, 75.0078],
    "Railway Station": [15.3600, 75.1420]
  },
  [CITIES.CHENNAI]: {
    "Chennai Central": [13.0827, 80.2707],
    "Marina Beach": [13.0475, 80.2824],
    "T Nagar": [13.0405, 80.2337],
    "Adyar": [13.0012, 80.2565],
    "Koyambedu": [13.0732, 80.1912]
  },
  [CITIES.COIMBATORE]: {
    "Gandhipuram": [11.0180, 76.9650],
    "Singanallur": [10.9990, 77.0260],
    "Railway Station": [10.9960, 76.9680],
    "Ukkadam": [10.9850, 76.9600]
  },
  [CITIES.KOCHI]: {
    "Fort Kochi": [9.9660, 76.2420],
    "Marine Drive": [9.9790, 76.2760],
    "Edapally": [10.0245, 76.3080],
    "Vytila Hub": [9.9678, 76.3214],
    "Kakkanad": [10.0150, 76.3500]
  },
  [CITIES.TRIVANDRUM]: {
    "Thampanoor": [8.4870, 76.9520],
    "East Fort": [8.4820, 76.9450],
    "Lulu Mall": [8.5140, 76.9070],
    "Technopark": [8.5580, 76.8820],
    "Kovalam": [8.4020, 76.9780]
  }
};

export const CITY_ROUTES = {
  [CITIES.BANGALORE]: {
    "335-E": {
      routeNo: "335-E",
      name: "Majestic ↔ Kadugodi (Whitefield)",
      type: "AC Vajra",
      color: "#0052cc",
      fare: "₹45",
      duration: "65 mins",
      stops: ["Majestic", "Corporation", "Brigade Road", "Domlur", "HAL Airport", "Marathahalli", "Kadugodi"],
      polyline: [
        [12.9779, 77.5724], // Majestic
        [12.9720, 77.5800],
        [12.9698, 77.5898], // Corporation
        [12.9710, 77.5980],
        [12.9734, 77.6068], // Brigade Road
        [12.9710, 77.6200],
        [12.9610, 77.6387], // Domlur
        [12.9580, 77.6530],
        [12.9562, 77.6682], // HAL Airport
        [12.9575, 77.6820],
        [12.9592, 77.6974], // Marathahalli
        [12.9720, 77.7200],
        [12.9850, 77.7450],
        [12.9986, 77.7610]  // Kadugodi
      ]
    },
    "500-D": {
      routeNo: "500-D",
      name: "Hebbal ↔ Central Silk Board",
      type: "AC Vajra",
      color: "#00aa6c",
      fare: "₹50",
      duration: "55 mins",
      stops: ["Hebbal", "Manyata Tech Park", "KR Puram", "Marathahalli", "Silk Board"],
      polyline: [
        [13.0354, 77.5978], // Hebbal
        [13.0410, 77.6100],
        [13.0450, 77.6200], // Manyata Tech Park
        [13.0320, 77.6450],
        [13.0200, 77.6800],
        [13.0120, 77.7050], // KR Puram
        [12.9850, 77.7010],
        [12.9592, 77.6974], // Marathahalli
        [12.9400, 77.6880],
        [12.9250, 77.6600],
        [12.9176, 77.6244]  // Silk Board
      ]
    },
    "KBS-3A": {
      routeNo: "KBS-3A",
      name: "Majestic ↔ Koramangala",
      type: "Ordinary",
      color: "#e67e22",
      fare: "₹20",
      duration: "35 mins",
      stops: ["Majestic", "Corporation", "Shanti Nagar", "Lalbagh", "Koramangala"],
      polyline: [
        [12.9779, 77.5724], // Majestic
        [12.9730, 77.5810],
        [12.9698, 77.5898], // Corporation
        [12.9600, 77.5900],
        [12.9540, 77.5900], // Shanti Nagar
        [12.9460, 77.5900], // Lalbagh
        [12.9380, 77.6050],
        [12.9352, 77.6244]  // Koramangala
      ]
    },
    "G-3": {
      routeNo: "G-3",
      name: "Brigade Road ↔ Sarjapur",
      type: "Ordinary",
      color: "#8e44ad",
      fare: "₹25",
      duration: "45 mins",
      stops: ["Brigade Road", "Domlur", "Koramangala", "Silk Board", "Sarjapur"],
      polyline: [
        [12.9734, 77.6068], // Brigade Road
        [12.9660, 77.6200],
        [12.9610, 77.6387], // Domlur
        [12.9480, 77.6350],
        [12.9352, 77.6244], // Koramangala
        [12.9250, 77.6244],
        [12.9176, 77.6244], // Silk Board
        [12.9130, 77.6500],
        [12.9110, 77.6800]  // Sarjapur
      ]
    }
  },
  [CITIES.MYSORE]: {
    "201": {
      routeNo: "201",
      name: "CBS ↔ Chamundi Hill",
      type: "Ordinary",
      color: "#e74c3c",
      fare: "₹25",
      duration: "30 mins",
      stops: ["City Bus Stand", "Mysore Palace", "Chamundi Hill"],
      polyline: [
        [12.3086, 76.6542], // City Bus Stand
        [12.3051, 76.6551], // Palace
        [12.2960, 76.6600],
        [12.2850, 76.6650],
        [12.2748, 76.6706]  // Chamundi Hill
      ]
    },
    "119": {
      routeNo: "119",
      name: "CBS ↔ Infosys Campus (Hebbal)",
      type: "Airavata AC",
      color: "#9b59b6",
      fare: "₹35",
      duration: "35 mins",
      stops: ["City Bus Stand", "Railway Station", "Gokulam", "Infosys Campus"],
      polyline: [
        [12.3086, 76.6542], // CBS
        [12.3162, 76.6433], // Railway Station
        [12.3275, 76.6272], // Gokulam
        [12.3410, 76.6200],
        [12.3508, 76.6136]  // Infosys
      ]
    },
    "303": {
      routeNo: "303",
      name: "CBS ↔ Bannimantap",
      type: "Ordinary",
      color: "#3498db",
      fare: "₹18",
      duration: "15 mins",
      stops: ["City Bus Stand", "Railway Station", "Bannimantap"],
      polyline: [
        [12.3086, 76.6542], // CBS
        [12.3162, 76.6433], // Railway Station
        [12.3280, 76.6480],
        [12.3370, 76.6520]  // Bannimantap
      ]
    }
  },
  [CITIES.HUBLI]: {
    "H-1": {
      routeNo: "H-1",
      name: "Hubli Stand ↔ Dharwad CBS",
      type: "Ordinary",
      color: "#2ecc71",
      fare: "₹30",
      duration: "45 mins",
      stops: ["Hubli Bus Stand", "Unkal Lake", "Dharwad CBS"],
      polyline: [
        [15.3524, 75.1380], // Hubli Stand
        [15.3600, 75.1420], // Railway Station
        [15.3850, 75.1180], // Unkal Lake
        [15.4200, 75.0500],
        [15.4589, 75.0078]  // Dharwad CBS
      ]
    }
  },
  [CITIES.CHENNAI]: {
    "C-101": {
      routeNo: "C-101",
      name: "Chennai Central ↔ Marina Beach ↔ Adyar",
      type: "Ordinary",
      color: "#3498db",
      fare: "₹15",
      duration: "30 mins",
      stops: ["Chennai Central", "Marina Beach", "Adyar"],
      polyline: [
        [13.0827, 80.2707], // Central
        [13.0600, 80.2800],
        [13.0475, 80.2824], // Marina
        [13.0200, 80.2700],
        [13.0012, 80.2565]  // Adyar
      ]
    },
    "C-200": {
      routeNo: "C-200",
      name: "Koyambedu ↔ T Nagar ↔ Adyar",
      type: "AC Deluxe",
      color: "#e74c3c",
      fare: "₹35",
      duration: "40 mins",
      stops: ["Koyambedu", "T Nagar", "Adyar"],
      polyline: [
        [13.0732, 80.1912], // Koyambedu
        [13.0550, 80.2100],
        [13.0405, 80.2337], // T Nagar
        [13.0200, 80.2450],
        [13.0012, 80.2565]  // Adyar
      ]
    }
  },
  [CITIES.COIMBATORE]: {
    "CO-5": {
      routeNo: "CO-5",
      name: "Gandhipuram ↔ Ukkadam",
      type: "Ordinary",
      color: "#f1c40f",
      fare: "₹12",
      duration: "20 mins",
      stops: ["Gandhipuram", "Railway Station", "Ukkadam"],
      polyline: [
        [11.0180, 76.9650], // Gandhipuram
        [10.9960, 76.9680], // Railway Station
        [10.9850, 76.9600]  // Ukkadam
      ]
    }
  },
  [CITIES.KOCHI]: {
    "K-9": {
      routeNo: "K-9",
      name: "Fort Kochi ↔ Marine Drive ↔ Edapally",
      type: "Ordinary",
      color: "#16a085",
      fare: "₹20",
      duration: "40 mins",
      stops: ["Fort Kochi", "Marine Drive", "Edapally"],
      polyline: [
        [9.9660, 76.2420], // Fort Kochi
        [9.9700, 76.2600],
        [9.9790, 76.2760], // Marine Drive
        [10.0000, 76.2900],
        [10.0245, 76.3080]  // Edapally
      ]
    }
  },
  [CITIES.TRIVANDRUM]: {
    "T-15": {
      routeNo: "T-15",
      name: "Thampanoor ↔ Technopark",
      type: "Ananthavahini AC",
      color: "#d35400",
      fare: "₹40",
      duration: "35 mins",
      stops: ["Thampanoor", "East Fort", "Lulu Mall", "Technopark"],
      polyline: [
        [8.4870, 76.9520], // Thampanoor
        [8.4820, 76.9450], // East Fort
        [8.5000, 76.9200],
        [8.5140, 76.9070], // Lulu Mall
        [8.5400, 76.8900],
        [8.5580, 76.8820]  // Technopark
      ]
    }
  }
};

export const CITY_BUS_TEMPLATES = {
  [CITIES.BANGALORE]: [
    { id: 101, routeNo: "335-E", type: "AC Vajra", crowd: "Low", speed: 38, currentIdx: 0, direction: 1, progress: 0.1 },
    { id: 102, routeNo: "335-E", type: "AC Vajra", crowd: "Medium", speed: 28, currentIdx: 6, direction: -1, progress: 0.5 },
    { id: 201, routeNo: "500-D", type: "AC Vajra", crowd: "High", speed: 18, currentIdx: 2, direction: 1, progress: 0.8 },
    { id: 202, routeNo: "500-D", type: "AC Vajra", crowd: "Low", speed: 42, currentIdx: 7, direction: -1, progress: 0.3 },
    { id: 301, routeNo: "KBS-3A", type: "Ordinary", crowd: "Medium", speed: 32, currentIdx: 1, direction: 1, progress: 0.6 },
    { id: 302, routeNo: "KBS-3A", type: "Ordinary", crowd: "High", speed: 22, currentIdx: 5, direction: -1, progress: 0.2 },
    { id: 401, routeNo: "G-3", type: "Ordinary", crowd: "Low", speed: 35, currentIdx: 3, direction: 1, progress: 0.4 },
    { id: 402, routeNo: "G-3", type: "Ordinary", crowd: "Medium", speed: 30, currentIdx: 6, direction: -1, progress: 0.9 }
  ],
  [CITIES.MYSORE]: [
    { id: 501, routeNo: "201", type: "Ordinary", crowd: "Low", speed: 40, currentIdx: 0, direction: 1, progress: 0.15 },
    { id: 502, routeNo: "201", type: "Ordinary", crowd: "Medium", speed: 30, currentIdx: 3, direction: -1, progress: 0.4 },
    { id: 601, routeNo: "119", type: "Airavata AC", crowd: "High", speed: 25, currentIdx: 1, direction: 1, progress: 0.6 },
    { id: 602, routeNo: "119", type: "Airavata AC", crowd: "Low", speed: 45, currentIdx: 3, direction: -1, progress: 0.2 },
    { id: 701, routeNo: "303", type: "Ordinary", crowd: "Medium", speed: 35, currentIdx: 1, direction: 1, progress: 0.5 }
  ],
  [CITIES.HUBLI]: [
    { id: 801, routeNo: "H-1", type: "Ordinary", crowd: "Medium", speed: 32, currentIdx: 0, direction: 1, progress: 0.2 }
  ],
  [CITIES.CHENNAI]: [
    { id: 901, routeNo: "C-101", type: "Ordinary", crowd: "Low", speed: 30, currentIdx: 0, direction: 1, progress: 0.1 },
    { id: 902, routeNo: "C-200", type: "AC Deluxe", crowd: "High", speed: 20, currentIdx: 1, direction: 1, progress: 0.5 }
  ],
  [CITIES.COIMBATORE]: [
    { id: 1001, routeNo: "CO-5", type: "Ordinary", crowd: "Medium", speed: 28, currentIdx: 0, direction: 1, progress: 0.3 }
  ],
  [CITIES.KOCHI]: [
    { id: 1101, routeNo: "K-9", type: "Ordinary", crowd: "Low", speed: 35, currentIdx: 0, direction: 1, progress: 0.4 }
  ],
  [CITIES.TRIVANDRUM]: [
    { id: 1201, routeNo: "T-15", type: "Ananthavahini AC", crowd: "Medium", speed: 30, currentIdx: 0, direction: 1, progress: 0.15 }
  ]
};

// Default exports for backward compatibility
export const STOPS = CITY_STOPS[CITIES.BANGALORE];
export const ROUTES = CITY_ROUTES[CITIES.BANGALORE];
export const BUS_TEMPLATES = CITY_BUS_TEMPLATES[CITIES.BANGALORE];

// Helper function to advance a single bus along its polyline
export const advanceBusLocation = (bus, routes = ROUTES) => {
  const route = routes[bus.routeNo];
  if (!route) return bus;

  let { currentIdx, direction, progress, speed, crowd } = bus;
  
  // Progress increments based on speed (higher speed -> faster progress)
  const step = 0.05 + (speed / 1000); 
  progress += direction * step;

  if (progress >= 1) {
    progress = 0;
    currentIdx += 1;
    if (currentIdx >= route.polyline.length - 1) {
      currentIdx = route.polyline.length - 2;
      direction = -1; // Reverse direction
    }
  } else if (progress <= 0) {
    progress = 1;
    currentIdx -= 1;
    if (currentIdx < 0) {
      currentIdx = 0;
      direction = 1; // Reverse direction
    }
  }

  // Get current position interpolation
  const startPt = route.polyline[currentIdx];
  const endPt = route.polyline[currentIdx + 1] || startPt;
  
  const lat = startPt[0] + (endPt[0] - startPt[0]) * progress;
  const lng = startPt[1] + (endPt[1] - startPt[1]) * progress;

  // Slightly vary speed and crowd levels for realism
  const randomSpeed = Math.max(10, Math.min(55, speed + Math.floor(Math.random() * 7) - 3));
  const crowdLevels = ["Low", "Medium", "High"];
  let newCrowd = crowd;
  if (Math.random() < 0.1) {
    newCrowd = crowdLevels[Math.floor(Math.random() * crowdLevels.length)];
  }

  return {
    ...bus,
    lat,
    lng,
    currentIdx,
    direction,
    progress,
    speed: randomSpeed,
    crowd: newCrowd,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
};
