const container = document.getElementById("layer-container");
const popup = document.getElementById("popup");
const backdrop = document.getElementById("popup-backdrop");


/* ================= DATA VARIABLES ================= */
let evolutionData = [];
let architectureData = {};
let technologyData = []; // loaded from data/technology.json


let usecaseData = [];    // loaded from data/usecase.json
let why5gData   = {};    // loaded from data/why5g.json
let protocolData = {};   // loaded from data/protocols.json
let responsibilitiesData = {}; // loaded from data/responsibilities.json


/* ================= LOAD DATA FROM JSON FILES ================= */
async function loadData() {
  try {
    console.log("Loading data from JSON files...");

    // Fetch all 4 data files in parallel for faster load
    const [evolutionRes, architectureRes, technologyRes, usecaseRes, why5gRes, protocolRes, responsibilitiesRes] = await Promise.all([
      fetch('data/evolution.json'),
      fetch('data/architecture.json'),
      fetch('data/technology.json'),
      fetch('data/usecase.json'),
      fetch('data/why5g.json'),
      fetch('data/protocols.json'),
      fetch('data/responsibilities.json')
    ]);

    if (!evolutionRes.ok)    throw new Error('Failed to load evolution.json');
    if (!architectureRes.ok) throw new Error('Failed to load architecture.json');
    if (!technologyRes.ok)   throw new Error('Failed to load technology.json');
    if (!usecaseRes.ok)      throw new Error('Failed to load usecase.json');
    if (!why5gRes.ok)        throw new Error('Failed to load why5g.json');
    if (!protocolRes.ok)     throw new Error('Failed to load protocols.json');
    if (!responsibilitiesRes.ok) throw new Error('Failed to load responsibilities.json');

    [evolutionData, architectureData, technologyData, usecaseData, why5gData, protocolData, responsibilitiesData] = await Promise.all([
      evolutionRes.json(),
      architectureRes.json(),
      technologyRes.json(),
      usecaseRes.json(),
      why5gRes.json(),
      protocolRes.json(),
      responsibilitiesRes.json()
    ]);

    console.log("Evolution data loaded:",    evolutionData.length,   "items");
    console.log("Architecture data loaded");
    console.log("Technology data loaded:",   technologyData.length,  "items");
    console.log("Use case data loaded:",     usecaseData.length,     "items");
    console.log("Why 5G data loaded ✓");
    console.log("Protocol data loaded:",     Object.keys(protocolData).length, "protocols");
    console.log("Responsibilities data loaded:", Object.keys(responsibilitiesData).length, "components");

    initializeApp();

  } catch (error) {
    console.error("Error loading JSON files:", error);
    console.log("Using fallback data...");
    loadFallbackData();
  }
}


/* ================= FALLBACK DATA (if JSON files fail) ================= */
function loadFallbackData() {


  
  evolutionData = []; // fallback: JSON failed to load
  
  architectureData = {}; // fallback: JSON failed to load;
  
  initializeApp();
}

/* ================= HELPER FUNCTIONS ================= */
function getSectionIcon(section) {
  const icons = {
    "Evolution": "📱",
    "Why 5G": "⚡",
    "Architecture": "🏗️",
    "Technologies": "🔬",
    "Protocols": "📡",
    "Use Cases": "🚀"
  };
  return icons[section] || "🔍";
}

function getSectionDescription(section) {
  const descriptions = {
    "Why 5G": "5G offers unprecedented speeds, ultra-low latency, and massive device connectivity. It enables technologies like autonomous vehicles, smart cities, and remote surgery.",
    "Technologies": "Key 5G technologies include Massive MIMO, mmWave, Beamforming, Network Slicing, and Edge Computing.",
    "Protocols": "5G protocols include NR (New Radio), HTTP/2, gRPC, and enhanced security protocols for improved performance and reliability.",
    "Use Cases": "5G use cases refer to the different types of services and applications that 5G networks are designed to support, each with specific performance requirements. The International Telecommunication Union (ITU) broadly categorizes 5G use cases into three main groups: eMBB, URLLC, mMTC"
  };
  return descriptions[section] || "Detailed content will be added soon.";
}

/* ================= INITIALIZE THE APP ================= */
function initializeApp() {
  /* ================= MAIN SECTIONS ================= */
  const sections = [
    "Evolution",
    "Why 5G",
    "Architecture",
    "Technologies",
    "Protocols",
    "Use Cases"
  ];

  // Create menu cards
  sections.forEach(section => {
    const div = document.createElement("div");
    div.className = "layer";
    div.innerHTML = `
      <div class="layer-icon">${getSectionIcon(section)}</div>
      <div class="layer-text">${section}</div>
    `;
    div.onclick = () => openSection(section);
    container.appendChild(div);
  });
  
  // ADD EVENT LISTENERS HERE (after elements exist)
  backdrop.addEventListener("click", closePopup);
  popup.addEventListener("click", function(event) {
    event.stopPropagation();
  });
  
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !popup.classList.contains("hidden")) {
      closePopup();
    }
  });
  
  console.log("App initialized successfully!");
}

// Start loading data when page loads
document.addEventListener('DOMContentLoaded', loadData);

/* ================= OPEN SECTION ================= */

/* ================= RENDER WHY 5G (data from why5g.json) ================= */
function renderWhy5G(d) {
  // Feature cards
  const featureCardsHTML = d.featureCards.map(card => `
    <div class="feature-card">
      <div class="feature-icon">${card.icon}</div>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
      <div class="feature-stats">
        ${card.stats.map(s => `
          <div class="stat">
            <div class="stat-value">${s.value}</div>
            <div class="stat-label">${s.label}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');

  // Applications grid
  const applicationsHTML = d.applications.map(app => `
    <div class="app-card">
      <div class="app-icon">${app.icon}</div>
      <h4>${app.title}</h4>
      <p>${app.description}</p>
    </div>`).join('');

  // Comparison table rows
  const tableRowsHTML = d.comparisonTable.rows.map(row => `
    <div class="table-row">
      ${row.cells.map((cell, i) => `
        <div class="table-cell${i === row.cells.length - 1 ? ' highlight' : ''}">${cell}</div>`
      ).join('')}
    </div>`).join('');

  const tableHeadersHTML = d.comparisonTable.headers.map(h =>
    `<div class="table-cell">${h}</div>`).join('');

  // Spectrum card stats
  const spectrumStatsHTML = d.spectrumCard.stats.map(s => `
    <div class="stat">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');

  // Additional topics (PaaS, NEP, Ultra Lean Design)
  const additionalHTML = d.additionalTopics.map(topic => `
    <h3>${topic.title}</h3>
    <p class="paratext" style="text-align: left;">${topic.content}</p>`).join('<h3> </h3>');

  popup.innerHTML = `
    <u><h2>Why 5G Matters</h2></u>
    <p class="subtitle" style="text-align: left;"><br>${d.subtitle}</p>
    <p></p>
    <div class="why5g-content">
      ${featureCardsHTML}
      <div class="applications-grid">
        <h3 class="section-title">Key Applications</h3>
        ${applicationsHTML}
      </div>
      <div class="comparison-section">
        <h3 class="section-title">5G vs Previous Generations</h3>
        <div class="comparison-table">
          <div class="table-row header">${tableHeadersHTML}</div>
          ${tableRowsHTML}
        </div>
      </div>
    </div>

    <div class="why5g-content">
      <div class="feature-card">
        <div class="feature-icon">${d.spectrumCard.icon}</div>
        <h3>${d.spectrumCard.title}</h3>
        <p>${d.spectrumCard.description}</p>
        <div class="feature-stats">${spectrumStatsHTML}</div>
      </div>
      <div class="why5g-content">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          ${additionalHTML}
        </div>
      </div>
    </div>

    <div class="buttons">
      <button onclick="closePopup()">Close</button>
    </div>
  `;
}

function openSection(section) {
  // Show backdrop and popup
  backdrop.classList.remove("hidden");
  popup.classList.remove("hidden");
  
  // Prevent body scrolling
  document.body.style.overflow = "hidden";
  
  if (section === "Evolution") {
    // Evolution section
    popup.innerHTML = `
      <h2>Evolution of Mobile Communication</h2>
      <h2></h2>
      <p>Explore the journey from 1G to 5G. Click on any generation card for details.</p>
      <p>  <div class="bus-timeline" id="busTimeline">
          <div class="signal"></div>
        </div></p>
      <div class="buttons">
        <button onclick="closePopup()">Close</button>
      </div>
    `;
    const bus = document.getElementById("busTimeline");

    // Create timeline nodes
    evolutionData.forEach((gen, index) => {
      const node = document.createElement("div");
      node.className = "bus-node";
      
      const card = document.createElement("div");
      card.className = `evo-card ${index % 2 === 0 ? "down" : "up"}`;
      card.style.animationDelay = `${index * 0.3}s`;
      card.innerHTML = `
        <h3 id="GenGen">${gen.gen}</h3>
        <h3>${gen.type}</h3>
        <h3>${gen.year}</h3>
      `;
      card.onclick = (e) => {
        e.stopPropagation();
        showGenDetails(gen);
      };
      
      node.appendChild(card);
      bus.appendChild(node);
    });
  } else if (section === "Architecture") {
    // Show 5G Architecture
    showArchitecture();
  } 



  else if (section === "Technologies") {
  popup.innerHTML = `
    <h2>5G Technologies</h2>
    <p>Click on any technology card to explore more details.</p>
    
    <div class="tech-grid" id="techGrid"></div>
    

    <div class="buttons">
      <button onclick="closePopup()">Close</button>
    </div>
  `;

  const techGrid = document.getElementById("techGrid");

  technologyData.forEach(tech => {
    const card = document.createElement("div");
    card.className = "tech-card";
    card.innerHTML = `
    <img src="${tech.image}" alt="${tech.name}" class="tech-img">
    <h3>${tech.name}</h3>
    
    

`;
    
    card.onclick = () => showTechnologyDetails(tech);

    techGrid.appendChild(card);
  });
}



  else if (section === "Why 5G") {
    renderWhy5G(why5gData);
  }
  
  else if (section === "Use Cases") {
  popup.innerHTML = `
    <h2>5G Use Cases</h2>
    <p>5G use cases refer to the different types of services and applications that 5G networks are designed to support, each with specific performance requirements. The International Telecommunication Union (ITU) broadly categorizes 5G use cases into three main groups: eMBB, URLLC, mMTC</p>
    <div class="usecase-grid" id="usecaseGrid"></div>
    

    <div class="buttons">
      <button onclick="closePopup()">Close</button>
    </div>
  `;

  const usecaseGrid = document.getElementById("usecaseGrid");

  usecaseData.forEach(usecase => {
    const card = document.createElement("div");
    card.className = "usecase-card";
    card.innerHTML = `
    <img src="${usecase.image}" alt="${usecase.name}" class="usecase-img">
    <h3>${usecase.name}</h3>
    
    

`;
    
    card.onclick = () => showusecaseDetails(usecase);

    usecaseGrid.appendChild(card);
  });
}

else if (section === "Protocols") {
  showProtocols();
}

  else {
      // Other sections
      popup.innerHTML = `
        <h2>${section}</h2>
        <p>${getSectionDescription(section)}</p>
        <div class="buttons">
          <button onclick="closePopup()">Close</button>
        </div>
      `;
    }
}

/* ================= SHOW 5G ARCHITECTURE ================= */
function showArchitecture() {

  popup.innerHTML = `
  <h2>5G Core Network Architecture</h2>

  <div class="architecture-container">

    <p class="architecture-intro">
      Click on any network function to see detailed information.
      The 5G architecture follows a Service-Based Architecture (SBA)
      with clear separation of Control Plane and User Plane.
    </p>

    <!-- ================= CONTROL PLANE ================= -->
    <div class="architecture-section control-plane">

      <div class="section-title">Control Plane</div>

      <div class="control-plane-timeline">
        <div class="cp-line"></div>
        <div class="cp-nodes" id="controlPlane"></div>
      </div>

    </div>


    <!-- ================= ACCESS + USER PLANE ================= -->

    <div class="userplane-access-container">

      <!-- ACCESS NETWORK -->
      <div class="access-left-side">

        <div class="access-network-section">

          <div class="section-title">Access Network</div>

          <div class="access-network-cards">

            <!-- UE -->
            <div class="access-card ue-card"
                 onclick="showComponentDetails('ue')">

              <div class="access-card-header"
                   style="background-color:#06D6A0">

                <div class="access-card-name">UE</div>
                <div class="access-card-fullname">User Equipment</div>

              </div>

              <div class="access-card-details">

                <div class="access-detail">
                  <span class="detail-label">Interface:</span>
                  <span class="detail-value">N1, Uu</span>
                </div>

                <div class="access-detail">
                  <span class="detail-label">Type:</span>
                  <span class="detail-value">End Device</span>
                </div>

                <div class="access-detail">
                  <span class="detail-label">Examples:</span>
                  <span class="detail-value">Smartphone, IoT</span>
                </div>

              </div>
            </div>


            <!-- RAN -->
            <div class="access-card ran-card"
                 onclick="showComponentDetails('ran')">

              <div class="access-card-header"
                   style="background-color:#FFD166">

                <div class="access-card-name">RAN</div>
                <div class="access-card-fullname">Radio Access Network</div>

              </div>

              <div class="access-card-details">

                <div class="access-detail">
                  <span class="detail-label">Interfaces:</span>
                  <span class="detail-value">Uu, N2, N3</span>
                </div>

                <div class="access-detail">
                  <span class="detail-label">Component:</span>
                  <span class="detail-value">gNodeB</span>
                </div>

                <div class="access-detail">
                  <span class="detail-label">Function:</span>
                  <span class="detail-value">Wireless Access</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      <!-- CONNECTOR RAN → UPF -->
      <div class="ran-upf-connector">

        <div class="connector-line"></div>
        <div class="connector-box">N3</div>
        <div class="connector-line"></div>

      </div>


      <!-- CONNECTOR SMF → UPF -->
      <div class="upf-smf-connector">

        <div class="connector-line-smfupf"></div>
        <div class="connector-box-smfupf">N4</div>
        <div class="connector-line-smfupf"></div>

      </div>


      <!-- CONNECTOR UE → RAN -->
      <div class="ran-ue-connector">

        <div class="connector-line-ue"></div>
        <div class="connector-box-ue">AIR</div>
        <div class="connector-line-ue"></div>

      </div>


      <!-- CONNECTOR upf → dn -->
      <div class="upf-dn-connector">

        <div class="connector-line-uedn"></div>
        <div class="connector-box-ue">N6</div>
        <div class="connector-line-uedn"></div>

      </div>
      


      <!-- CONNECTOR RAN → AMF -->
      <div class="ran-amf-connector">

        <div class="connector-line-vertical"></div>
        <div class="connector-box-vertical">N2</div>
        <div class="connector-line-vertical"></div>

      </div>


      <!-- USER PLANE -->
      <div class="userplane-right-side">

        <div class="architecture-section user-plane">

          <div class="section-title">User Plane</div>

          <div class="functions-grid" id="userPlane"></div>

        </div>

      </div>

    </div>


    <!-- ================= DATA NETWORK ================= -->

    <div class="data-network-section">

      <div class="section-title">Data Network</div>

      <div class="access-card dn-card"
           onclick="showComponentDetails('dn')">

        <div class="access-card-header"
             style="background-color:#FF6B6B">

          <div class="access-card-name">DN</div>
          <div class="access-card-fullname">Data Network</div>

        </div>

        <div class="access-card-details">

          <div class="access-detail">
            <span class="detail-label">Interface:</span>
            <span class="detail-value">N6</span>
          </div>

          <div class="access-detail">
            <span class="detail-label">Type:</span>
            <span class="detail-value">External Network</span>
          </div>

          <div class="access-detail">
            <span class="detail-label">Examples:</span>
            <span class="detail-value">Internet, IMS</span>
          </div>

        </div>

      </div>

    </div>


    <!-- CLOSE BUTTON -->

    <div class="buttons">
      <button onclick="closePopup()">Close</button>
    </div>

  </div>
  `;
  
  // Populate Control Plane functions
  const controlPlane = document.getElementById("controlPlane");
  architectureData.controlPlane.forEach(func => {
    const funcElement = document.createElement("div");
    funcElement.className = "cp-function";
    funcElement.style.backgroundColor = func.color;
    funcElement.innerHTML = `
      <div class="func-name">${func.name}</div>
      
    `;
    funcElement.onclick = (e) => {
      e.stopPropagation();
      showComponentDetails(func.id);
    };
    controlPlane.appendChild(funcElement);
  });
  
  // Populate User Plane functions
  const userPlane = document.getElementById("userPlane");
  architectureData.userPlane.forEach(func => {
    const funcElement = document.createElement("div");
    funcElement.className = "network-function";
    funcElement.style.backgroundColor = func.color;
    funcElement.innerHTML = `
      <div class="func-name">${func.name}</div>
      <div class="func-interfaces">N3, N4, N6, N9</div>
    `;
    funcElement.onclick = (e) => {
      e.stopPropagation();
      showComponentDetails(func.id);
    };
    userPlane.appendChild(funcElement);
  });
}

function showProtocols() {
  popup.innerHTML = `
    <h2>5G Protocol Intelligence Panel</h2>
    <p>Explore layered protocol interaction inside 5G networks.</p>

    <div class="protocol-main-layout">

      <!-- LEFT SIDE - OSI -->
      <div class="protocol-left">
        <h3>OSI Model</h3>
        <div class="osi-vertical">
          ${createOSILayer(7, "Application")}
          ${createOSILayer(6, "Presentation")}
          ${createOSILayer(5, "Session")}
          ${createOSILayer(4, "Transport")}
          ${createOSILayer(3, "Network")}
          ${createOSILayer(2, "Data Link")}
          ${createOSILayer(1, "Physical")}
        </div>
      </div>

      <!-- CENTER - PROTOCOL CONTENT -->
      <div class="protocol-center">

        <div class="protocol-info-grid">
          ${createProtocolCard("dns", "DNS")}
          ${createProtocolCard("mdns", "mDNS")}
          ${createProtocolCard("icmp", "ICMP")}
          ${createProtocolCard("ntp", "NTP")}
          ${createProtocolCard("quic", "QUIC")}
          ${createProtocolCard("tls", "SSL/TLS")}
          ${createProtocolCard("tcp", "TCP")}
          ${createProtocolCard("udp", "UDP")}
          ${createProtocolCard("sip", "SIP")}
          ${createProtocolCard("pfcp", "PFCP")}
          ${createProtocolCard("gtpu", "GTP-U")}
          ${createProtocolCard("http2", "HTTP/2")}
          ${createProtocolCard("rtp", "RTP")}
          ${createProtocolCard("nas", "NAS")}
          ${createProtocolCard("ngap", "NGAP")}
          ${createProtocolCard("sctp", "SCTP")}
          ${createProtocolCard("rrc", "RRC")}
          ${createProtocolCard("bgp", "BGP")}
          ${createProtocolCard("diameter", "DIAMETER")}
          ${createProtocolCard("ospf", "OSPF")}
          ${createProtocolCard("arp", "ARP")}
          ${createProtocolCard("dhcp", "DHCP")}
          ${createProtocolCard("ipsec", "IPSEC")}
          ${createProtocolCard("mpls", "MPLS")}
        </div>

        <div id="protocol-details" class="protocol-details hidden"></div>

      </div>

      <!-- RIGHT SIDE - DEPENDENCY GRAPH -->
      <div class="dependency-vertical">

        <div class="dep-box" id="dep-app">Application Layer</div>
        <div class="dep-arrow">↓</div>

        <div class="dep-box" id="dep-transport">TCP / UDP</div>
        <div class="dep-arrow">↓</div>

        <div class="dep-box" id="dep-ip">IP</div>
        <div class="dep-arrow">↓</div>

        <div class="dep-box" id="dep-gtp">GTP-U</div>
        <div class="dep-arrow">↓</div>

        <div class="dep-box" id="dep-tunnel">5G Tunnel</div>

      </div>

    </div>

    <hr style="margin:40px 0; border:1px solid rgba(0,191,255,0.2);">

    <h3 style="text-align:center;">Procedure Flow Simulation</h3>

    <div class="protocol-controls">
      <button onclick="startProcedure('registration')">Registration</button>
      <button onclick="startProcedure('pdu')">PDU Session</button>
      <button onclick="startProcedure('ims')">IMS / VoNR</button>
    </div>

    <div class="protocol-pipeline">
      <div class="protocol-node">UE</div>
      <div class="protocol-pipe" id="pipe1"></div>
      <div class="protocol-node">gNB</div>
      <div class="protocol-pipe" id="pipe2"></div>
      <div class="protocol-node">5G Core</div>
      <div class="protocol-pipe" id="pipe3"></div>
      <div class="protocol-node">IMS / DN</div>
    </div>

    <div class="buttons">
      <button onclick="closePopup()">Close</button>
    </div>
  `;
}
function createOSILayer(num, name) {
  return `<div class="osi-layer" id="osi-${num}">${num} - ${name}</div>`;
}
function highlightOSI(layerNumber) {

  // Reset all
  document.querySelectorAll(".osi-layer").forEach(el => {
    el.classList.remove("osi-active");
  });

  const active = document.getElementById("osi-" + layerNumber);
  if (active) active.classList.add("osi-active");
}
function resetDependencyGraph() {
  document.querySelectorAll(".dep-box").forEach(box => {
    box.classList.remove("dep-active");
  });
}

function highlightDependency(stack) {

  resetDependencyGraph();

  stack.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("dep-active");
  });

}
function createProtocolCard(id, name) {
  return `
    <div class="protocol-card" onclick="showProtocolDetails('${id}')">
      ${name}
    </div>
  `;
}
let activeProtocol = null;

function showProtocolDetails(type) {

  const details = document.getElementById("protocol-details");

  // If same protocol clicked again → hide
  if (activeProtocol === type) {
    details.classList.add("hidden");
    activeProtocol = null;
    return;
  }

  activeProtocol = type;

  const data = protocolData; // loaded from data/protocols.json

  details.innerHTML = `
    <h3>${data[type].title}</h3>
    <p1>${data[type].content}</p1>
  `;

  details.classList.remove("hidden");

  // Reset OSI
document.querySelectorAll(".osi-layer").forEach(el => {
  el.classList.remove("osi-active");
});

// Highlight all required OSI layers
data[type].layers.forEach(layer => {
  const el = document.getElementById("osi-" + layer);
  if (el) el.classList.add("osi-active");
});

// Highlight dependency graph
highlightDependency(data[type].stack);
}


/* ================= SHOW COMPONENT DETAILS ================= */
function showComponentDetails(componentId) {
  // Find component in all categories
  let component = null;
  let category = "";
  
  // Search in all categories
  for (const [cat, components] of Object.entries(architectureData)) {
    const found = components.find(comp => comp.id === componentId);
    if (found) {
      component = found;
      category = cat;
      break;
    }
  }
  
  if (!component) return;
  
  popup.innerHTML = `
    <h2>${component.name} - ${component.fullName}</h2>
    
    <div class="component-details">
      <div class="component-header" style="background-color: ${component.color}">
        <div class="component-name">${component.name}</div>
        <div class="component-fullname">${component.fullName}</div>
      </div>
      
      <div class="component-info">
        <h3>📋 Description</h3>
        <p style= "text-align: Left;" >${component.description}</p>
        
        
        ${component.interfaces.length > 0 ? `
          <p></P>
          <h3>🔌 Interfaces</h3>
          <div class="interfaces-list">
            ${component.interfaces.map(intf => `<span class="interface-tag">${intf}</span>`).join('')}
          </div>
        ` : ''}
        
        <h3>🏷️ Category</h3>
        <p class="category-tag">${getCategoryName(category)}</p>
        
        ${getAdditionalInfo(component.id)}
      </div>
    </div>
    
    <div class="buttons">
      <button onclick="showArchitecture()">← Back to Architecture</button>
    </div>
  `;
}

function getCategoryName(category) {
  const names = {
    "controlPlane": "Control Plane Function",
    "userPlane": "User Plane Function",
    "accessNetwork": "Access Network Entity",
    "dataNetwork": "Data Network"
  };
  return names[category] || category;
}
function animateProtocol(pipeId, label, color) {
  const pipe = document.getElementById(pipeId);
  const packet = document.createElement("div");

  packet.className = "protocol-packet";
  packet.innerText = label;
  packet.style.background = color;

  pipe.appendChild(packet);

  setTimeout(() => {
    packet.remove();
  }, 4000);
}

function startProcedure(type) {

  if (type === "registration") {

    animateProtocol("pipe1", "RRC Setup", "#ff9800");
    animateProtocol("pipe1", "NAS Registration", "#e91e63");

    setTimeout(() => {
      animateProtocol("pipe2", "NGAP Initial UE Message", "#9c27b0");
    }, 800);

    setTimeout(() => {
      animateProtocol("pipe2", "HTTP/2 (SBI)", "#4caf50");
    }, 1500);

  }

  if (type === "pdu") {

    animateProtocol("pipe1", "NAS PDU Session Req", "#e91e63");

    setTimeout(() => {
      animateProtocol("pipe2", "NGAP PDU Session", "#9c27b0");
    }, 800);

    setTimeout(() => {
      animateProtocol("pipe2", "PFCP (N4)", "#3f51b5");
    }, 1500);

    setTimeout(() => {
      animateProtocol("pipe2", "GTP-U (N3)", "#00bcd4");
    }, 2200);

  }

  if (type === "ims") {

    animateProtocol("pipe1", "SIP INVITE", "#ff5722");

    setTimeout(() => {
      animateProtocol("pipe2", "GTP-U Voice Bearer", "#00bcd4");
    }, 1000);

    setTimeout(() => {
      animateProtocol("pipe3", "RTP Media Flow", "#4caf50");
    }, 2000);

  }
}


function getAdditionalInfo(componentId) {
  return responsibilitiesData[componentId] || "";
}

/* ================= SHOW GENERATION DETAILS ================= */
function showGenDetails(gen) {
  popup.innerHTML = `
    <h2>${gen.gen} Details</h2>
    
    <div class="gen-info">
      <p><strong>📅 Era:</strong> ${gen.year} <br>🎯Type:</strong> ${gen.type}<br>📶 Bandwidth:</strong> ${gen.bandwidth}<br>⏱ Latency:</strong> ${gen.latency}</p>
      
      
      <h3>✨ Key Features</h3>
      <ul>${gen.key.map(k => `<li>${k}</li>`).join("")}</ul>
      
      <h3>🔧 Technologies Used</h3>
      <ul>${gen.tech.map(t => `<li>${t}</li>`).join("")}</ul>
      
      ${gen.whyNext !== "—" ? `
        <h3>🚀 Why move beyond ${gen.gen}?</h3>
        <p>${gen.whyNext}</p>
      ` : `
        <h3>🌟 The Future is Here</h3>
        <p>5G represents the current pinnacle of mobile communication technology, enabling innovations we're just beginning to explore.</p>
      `}
    </div>
    
    <div class="buttons">
      <button onclick="openSection('Evolution')">← Back to Timeline</button>
      
    </div>
  `;

}
function showTechnologyDetails(tech) {
  popup.innerHTML = `
    <h2>${tech.name}</h2>

    <div class="gen-info">
      <img src="${tech.image}" alt="${tech.name}" class="tech-detail-img">
      <p>${tech.description}</p>

      <h3>Key Points</h3>
      <ul>
        ${tech.details.map(d => `<li>${d}</li>`).join("")}
      </ul>
      
    </div>

    <div class="buttons">
      <button onclick="openSection('Technologies')">← Back</button>
    </div>
  `;
}
function showusecaseDetails(usecase) {
  popup.innerHTML = `
    <h2>${usecase.name}</h2>

    <div class="gen-info">
      <img src="${usecase.image}" alt="${usecase.name}" class="usecase-detail-img">
      <p>${usecase.description}</p>

      <h3>Key Points</h3>
      <ul>
        ${usecase.details.map(d => `<li>${d}</li>`).join("")}
      </ul>
      
    </div>

    <div class="buttons">
      <button onclick="openSection('Use Cases')">← Back</button>
    </div>
  `;
}



/* ================= CLOSE POPUP ================= */
function closePopup() {
  try {
    const popupEl = document.getElementById("popup");
    const backdropEl = document.getElementById("popup-backdrop");
    
    if (popupEl && backdropEl) {
      popupEl.classList.add("hidden");
      backdropEl.classList.add("hidden");
      document.body.style.overflow = "auto";
      console.log("Popup closed successfully");
    } else {
      console.error("Popup elements not found");
    }
  } catch (error) {
    console.error("Error closing popup:", error);
  }
}

// Make functions globally accessible
window.closePopup = closePopup;
window.openSection = openSection;
window.showComponentDetails = showComponentDetails;
window.showArchitecture = showArchitecture;
window.showGenDetails = showGenDetails;