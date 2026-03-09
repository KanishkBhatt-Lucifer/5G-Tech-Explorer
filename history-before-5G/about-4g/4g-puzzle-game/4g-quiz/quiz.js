// ============================================================
// 4G LTE Quiz — Logic
//
// BUG FIXED: The 90 easy/medium/hard questions in questionBank
// were all tagged category:"general" in the merge loop, but there
// is NO "general" button in the UI. This made all 90 questions
// permanently unreachable — only the 105 questionBank1 questions
// (tagged with real categories but difficulty:"all") ever appeared.
//
// FIX: questionBank (easy/medium/hard) questions are now tagged
// with the correct category for each question using a lookup table,
// AND keep their difficulty level. Difficulty now acts as a real
// cross-category filter: selecting "EPC Core + Easy" gives the
// easy-level EPC questions, "EPC Core + Hard" gives harder ones.
// ============================================================

// ── VARIABLES ───────────────────────────────────────────────
const screens        = document.querySelectorAll(".screen");
const startBtn       = document.getElementById("start-btn");
const nextBtn        = document.getElementById("next-btn");
const restartBtn     = document.getElementById("restart-btn");
const questionText   = document.getElementById("question-text");
const optionButtons  = document.querySelectorAll(".option-btn");
const questionNumber = document.getElementById("question-number");
const scoreDisplay   = document.getElementById("score-display");
const finalScore     = document.getElementById("final-score");
const resultMessage  = document.getElementById("result-message");
const scoreBar       = document.getElementById("score-bar");
const explanationBox = document.getElementById("explanation-box");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const categoryBtns   = document.querySelectorAll(".category-btn");
const analyticsBtn   = document.getElementById("analytics-btn");
const backHomeBtn    = document.getElementById("back-home-btn");
const overallStats   = document.getElementById("overall-stats");
const categoryStats  = document.getElementById("category-stats");
const difficultyStats= document.getElementById("difficulty-stats");
const weakArea       = document.getElementById("weak-area");

let selectedCategory = null;
let difficulty       = "easy";   // matches the pre-selected Easy button
let currentQuestionIndex = 0;
let score            = 0;
let selectedAnswer   = null;
let shuffledQuestions= [];

// ── QUESTION BANKS ───────────────────────────────────────────

// questionBank — difficulty-stratified (30 easy, 30 medium, 30 hard).
// BUG FIX: previously merged with category:"general" — no UI button exists
// for "general", so these were 100% unreachable.
// Each question now has an explicit category so difficulty filtering works.
const questionBank = {

/* ── EASY (30) ── */
easy: [
{ cat:"epc",      q:"LTE stands for?",                          o:["Long Term Evolution","Logical Transfer Engine","Low Transmission Exchange","Layered Telecom Engine"], a:0 },
{ cat:"epc",      q:"4G core network is called?",               o:["EPC","MSC","SGSN","BTS"], a:0 },
{ cat:"phy",      q:"LTE downlink multiple access?",            o:["CDMA","TDMA","OFDMA","FDMA"], a:2 },
{ cat:"phy",      q:"LTE uplink uses?",                         o:["OFDMA","SC-FDMA","CDMA","TDMA"], a:1 },
{ cat:"epc",      q:"eNodeB connects to EPC via?",              o:["S1","X2","N2","A1"], a:0 },
{ cat:"epc",      q:"MME belongs to which plane?",              o:["User","Control","Transport","Radio"], a:1 },
{ cat:"mobility", q:"SGW handles mainly?",                      o:["Mobility anchor","Authentication","Policy","Billing only"], a:0 },
{ cat:"epc",      q:"PGW connects to?",                         o:["Internet","UE","SIM","MSC"], a:0 },
{ cat:"ims",      q:"VoLTE is based on?",                       o:["IMS","MSC","BSC","GPRS"], a:0 },
{ cat:"phy",      q:"LTE bandwidth options include?",           o:["1.4–20 MHz","Only 5 MHz","100 MHz fixed","Unlimited"], a:0 },
{ cat:"epc",      q:"Typical LTE peak speed approx?",           o:["100 Mbps","2 Mbps","5 Gbps","50 Kbps"], a:0 },
{ cat:"epc",      q:"LTE is primarily?",                        o:["All-IP","Circuit Switched","Analog","Satellite"], a:0 },
{ cat:"phy",      q:"MIMO improves?",                           o:["Capacity","Battery only","Security","Frequency"], a:0 },
{ cat:"phy",      q:"LTE duplex modes?",                        o:["FDD & TDD","Only FDD","Only TDD","Analog"], a:0 },
{ cat:"qos",      q:"Bearer in LTE represents?",                o:["QoS path","SIM card","IP address","Frequency band"], a:0 },
{ cat:"epc",      q:"HSS stores?",                              o:["User subscription","Packets","Radio signals","Scheduling"], a:0 },
{ cat:"epc",      q:"X2 interface connects?",                   o:["eNodeB-eNodeB","UE-MME","PGW-SGW","SIM-HSS"], a:0 },
{ cat:"mac",      q:"HARQ improves?",                           o:["Reliability","Security","Battery","Encryption"], a:0 },
{ cat:"qos",      q:"QCI defines?",                             o:["QoS parameters","Frequency","Encryption key","Power"], a:0 },
{ cat:"epc",      q:"Attach procedure registers UE to?",        o:["EPC","MSC","IMS","WiFi"], a:0 },
{ cat:"epc",      q:"RRC stands for?",                          o:["Radio Resource Control","Routing Resource Code","Random Radio Channel","Radio Rate Class"], a:0 },
{ cat:"epc",      q:"LTE is standardized by?",                  o:["3GPP","IEEE","ITU-T","ETSI only"], a:0 },
{ cat:"ims",      q:"IMS mainly handles?",                      o:["Multimedia services","Routing","Paging","Power control"], a:0 },
{ cat:"qos",      q:"Default bearer is established during?",    o:["Attach","Detach","Paging","DRX"], a:0 },
{ cat:"epc",      q:"LTE latency approx?",                      o:["10–30 ms","500 ms","2 sec","100 ms exact"], a:0 },
{ cat:"phy",      q:"SC-FDMA reduces?",                         o:["PAPR","Latency","Security","Encryption"], a:0 },
{ cat:"phy",      q:"LTE uses which modulation?",               o:["QPSK/16QAM/64QAM","Only BPSK","Only FSK","AM"], a:0 },
{ cat:"epc",      q:"eNodeB performs?",                         o:["Scheduling","Authentication only","Billing","SIM storage"], a:0 },
{ cat:"mobility", q:"Paging is initiated by?",                  o:["MME","UE","PGW","SGW"], a:0 },
{ cat:"phy",      q:"LTE-Advanced introduced?",                 o:["Carrier Aggregation","2G fallback","Analog support","CDMA"], a:0 }
],

/* ── MEDIUM (30) ── */
medium: [
{ cat:"epc",      q:"S1 interface has two parts?",              o:["S1-MME & S1-U","S1-X2","S1-NAS","S1-RRC"], a:0 },
{ cat:"epc",      q:"GTP-U carries?",                           o:["User plane data","Control signaling","Encryption keys","Paging"], a:0 },
{ cat:"mobility", q:"S-GW acts as?",                            o:["Mobility anchor","Policy server","Authentication center","IMS server"], a:0 },
{ cat:"epc",      q:"P-GW allocates?",                          o:["IP address","SIM","Frequency","HARQ process"], a:0 },
{ cat:"qos",      q:"QCI defines?",                             o:["Priority, delay, packet loss","Frequency","Security","Power level"], a:0 },
{ cat:"mac",      q:"PDCP handles?",                            o:["Header compression","Scheduling","HARQ","RF modulation"], a:0 },
{ cat:"mac",      q:"RLC modes include?",                       o:["AM, UM, TM","Only AM","Only UM","Only TM"], a:0 },
{ cat:"mac",      q:"MAC layer handles?",                       o:["Scheduling & HARQ","Encryption","IP routing","Billing"], a:0 },
{ cat:"epc",      q:"Attach procedure starts with?",            o:["NAS request","RLC request","PDCP message","X2 message"], a:0 },
{ cat:"mobility", q:"TAU stands for?",                          o:["Tracking Area Update","Time Access Unit","Transmission Allocation Unit","Traffic Allocation Update"], a:0 },
{ cat:"mobility", q:"Handover without EPC involvement?",        o:["X2 HO","S1 HO","Inter-RAT HO","CS fallback"], a:0 },
{ cat:"phy",      q:"Carrier Aggregation increases?",           o:["Bandwidth","Latency","Power","Security"], a:0 },
{ cat:"ims",      q:"SRVCC enables?",                           o:["VoLTE to 3G handover","Carrier aggregation","Power saving","Encryption"], a:0 },
{ cat:"phy",      q:"eICIC reduces?",                           o:["Inter-cell interference","Latency","Encryption","Power"], a:0 },
{ cat:"epc",      q:"Control plane signaling uses?",            o:["NAS","GTP-U","HTTP","SIP only"], a:0 },
{ cat:"epc",      q:"MME communicates with HSS via?",           o:["S6a","S1","X2","N2"], a:0 },
{ cat:"qos",      q:"PCRF provides?",                           o:["Policy & charging rules","IP routing","RF scheduling","Paging"], a:0 },
{ cat:"epc",      q:"RRC states include?",                      o:["Idle & Connected","Only Idle","Active & Sleep","Dormant only"], a:0 },
{ cat:"epc",      q:"LTE scheduling is done in?",               o:["eNodeB","MME","SGW","PGW"], a:0 },
{ cat:"mobility", q:"Inter-RAT HO involves?",                   o:["LTE to 3G","eNodeB-eNodeB","Carrier aggregation","IMS registration"], a:0 },
{ cat:"ims",      q:"IMS registration uses?",                   o:["SIP","GTP","RLC","MAC"], a:0 },
{ cat:"qos",      q:"Default bearer has?",                      o:["Non-GBR","GBR always","No QoS","Circuit switching"], a:0 },
{ cat:"qos",      q:"GBR bearer is used for?",                  o:["VoLTE","Browsing","Email only","Idle mode"], a:0 },
{ cat:"phy",      q:"Downlink control channel?",                o:["PDCCH","PUCCH","PRACH","PHICH"], a:0 },
{ cat:"phy",      q:"Uplink control channel?",                  o:["PUCCH","PDSCH","PHICH","PBCH"], a:0 },
{ cat:"phy",      q:"PBCH carries?",                            o:["System info","User data","VoLTE","IP routing"], a:0 },
{ cat:"phy",      q:"Latency in LTE mainly due to?",            o:["TTI scheduling","Encryption only","Frequency reuse","SIM"], a:0 },
{ cat:"epc",      q:"DRX improves?",                            o:["Battery life","Throughput","Security","Frequency"], a:0 },
{ cat:"mobility", q:"Load balancing is managed by?",            o:["eNodeB & MME","UE only","SIM","PCRF only"], a:0 },
{ cat:"qos",      q:"Attach leads to creation of?",             o:["Default bearer","Dedicated bearer only","No bearer","IMS only"], a:0 }
],

/* ── HARD (30) ── */
hard: [
{ cat:"security", q:"KASME is derived during?",                 o:["Authentication","Paging","Carrier aggregation","DRX"], a:0 },
{ cat:"security", q:"NAS security protects?",                   o:["Control plane","User plane","RF only","Power control"], a:0 },
{ cat:"security", q:"AS security protects?",                    o:["Radio link","Core network","IMS","Billing"], a:0 },
{ cat:"mobility", q:"X2 HO avoids?",                           o:["Core signaling","Encryption","Paging","Attach"], a:0 },
{ cat:"mobility", q:"S1 HO requires involvement of?",           o:["MME","UE only","SIM","IMS"], a:0 },
{ cat:"qos",      q:"EPS bearer consists of?",                  o:["Radio + Core bearer","Only radio","Only core","Only IMS"], a:0 },
{ cat:"epc",      q:"GTP-U tunnel is between?",                 o:["eNodeB & SGW","UE & MME","HSS & PCRF","IMS & PGW"], a:0 },
{ cat:"epc",      q:"Control signaling between eNodeB & MME uses?", o:["S1-AP","GTP-U","SIP","HTTP"], a:0 },
{ cat:"phy",      q:"Carrier Aggregation types include?",       o:["Intra & Inter band","Only Intra","Only Inter","Analog"], a:0 },
{ cat:"phy",      q:"CoMP improves?",                           o:["Cell edge throughput","Battery","Encryption","Latency only"], a:0 },
{ cat:"phy",      q:"256-QAM increases?",                       o:["Spectral efficiency","Latency","Power","Security"], a:0 },
{ cat:"epc",      q:"MTU mismatch causes?",                     o:["Fragmentation","Encryption error","Paging failure","Carrier drop"], a:0 },
{ cat:"epc",      q:"P-GW connects to PCRF via?",               o:["Gx","S1","X2","S6a"], a:0 },
{ cat:"epc",      q:"APN determines?",                          o:["Network access","Frequency band","QoS class","HARQ"], a:0 },
{ cat:"phy",      q:"Interference coordination improves?",      o:["SINR","Battery","Security","Encryption"], a:0 },
{ cat:"phy",      q:"Uplink power control ensures?",            o:["Optimal SINR","Max battery drain","Higher latency","IMS registration"], a:0 },
{ cat:"mobility", q:"RRC reconfiguration used for?",            o:["Handover","Billing","SIM activation","PCRF"], a:0 },
{ cat:"mobility", q:"Paging is broadcast in?",                  o:["Tracking Area","Whole network","Single UE","SIM only"], a:0 },
{ cat:"qos",      q:"Dedicated bearer created via?",            o:["Bearer setup signaling","Attach only","Paging","DRX"], a:0 },
{ cat:"mac",      q:"TTI duration in LTE?",                     o:["1 ms","10 ms","100 ms","5 ms"], a:0 },
{ cat:"mac",      q:"LTE scheduler operates per?",              o:["TTI","Second","Minute","Hour"], a:0 },
{ cat:"phy",      q:"SINR affects?",                            o:["Modulation selection","Paging","Attach","Security"], a:0 },
{ cat:"epc",      q:"MME redundancy ensures?",                  o:["High availability","Battery","Security","RF tuning"], a:0 },
{ cat:"ims",      q:"IMS uses which transport?",                o:["IP","Circuit","Analog","Satellite"], a:0 },
{ cat:"qos",      q:"Dedicated bearer supports?",               o:["Specific QoS","All traffic same","No QoS","Paging only"], a:0 },
{ cat:"epc",      q:"LTE supports which IP version?",           o:["IPv4 & IPv6","IPv4 only","IPv6 only","None"], a:0 },
{ cat:"epc",      q:"S6a interface uses?",                      o:["Diameter","GTP","SIP","RLC"], a:0 },
{ cat:"mac",      q:"HARQ operates at?",                        o:["MAC layer","PDCP","RRC","IMS"], a:0 },
{ cat:"phy",      q:"Inter-cell interference high at?",         o:["Cell edge","Cell center","Core","IMS"], a:0 },
{ cat:"ims",      q:"CS fallback used when?",                   o:["VoLTE unavailable","Carrier aggregation","Paging","DRX"], a:0 }
]

}; // end questionBank


// questionBank1 — category-stratified, all difficulty levels
const questionBank1 = {

/* ── PHY LAYER ── */
phy: [
{ q:"Why does LTE uplink use SC-FDMA instead of OFDMA?",       o:["Lower PAPR","Higher latency","Better encryption","Improves routing"], a:0, explanation:"SC-FDMA reduces Peak-to-Average Power Ratio, improving UE battery efficiency." },
{ q:"What parameter primarily determines modulation scheme selection?", o:["SINR","Battery level","APN","Tracking Area"], a:0, explanation:"Higher SINR allows higher modulation such as 64QAM or 256QAM." },
{ q:"What is the LTE TTI duration?",                           o:["1 ms","10 ms","5 ms","100 ms"], a:0, explanation:"LTE scheduling operates every 1 ms Transmission Time Interval." },
{ q:"What is the main advantage of MIMO?",                     o:["Improved capacity","Reduced encryption","Lower IP routing","Better billing"], a:0, explanation:"MIMO increases spectral efficiency by spatial multiplexing." },
{ q:"Which channel carries system broadcast information?",     o:["PBCH","PDCCH","PUCCH","PUSCH"], a:0, explanation:"PBCH carries MIB and essential system information." },
{ q:"What does SINR impact directly?",                         o:["Modulation & coding","Core routing","Paging cycle","APN selection"], a:0, explanation:"Higher SINR allows higher coding rate and modulation." },
{ q:"What is PRB in LTE?",                                     o:["Physical Resource Block","Packet Routing Block","Paging Radio Band","Power Routing Base"], a:0, explanation:"PRB is the smallest schedulable radio resource unit." },
{ q:"What increases spectral efficiency?",                     o:["Higher order modulation","Lower bandwidth","More paging","Higher DRX"], a:0, explanation:"Higher order modulation like 256-QAM improves bits per symbol." },
{ q:"Which duplex modes are supported in LTE?",                o:["FDD & TDD","Only FDD","Only TDD","Half Duplex only"], a:0, explanation:"LTE supports both Frequency and Time Division Duplex." },
{ q:"Cell edge users typically suffer from?",                  o:["Low SINR","High throughput","Low latency","Core overload"], a:0, explanation:"Cell edge users face interference and weak signal strength." },
{ q:"What determines the number of PRBs in LTE?",             o:["System bandwidth","SINR","MME load","QCI value"], a:0, explanation:"Number of PRBs depends on configured system bandwidth (e.g., 20 MHz = 100 PRBs)." },
{ q:"What is the purpose of cyclic prefix in LTE?",           o:["Reduce inter-symbol interference","Increase modulation","Improve encryption","Enhance routing"], a:0, explanation:"Cyclic prefix mitigates multipath delay spread and prevents ISI." },
{ q:"Which modulation is most robust in poor radio conditions?", o:["QPSK","256-QAM","64-QAM","16-QAM"], a:0, explanation:"QPSK is most robust but provides lower data rate." },
{ q:"What parameter indicates signal strength?",               o:["RSRP","SINR","BLER","QCI"], a:0, explanation:"RSRP measures received signal power from cell reference signals." },
{ q:"What does BLER represent?",                               o:["Block Error Rate","Bearer Load Efficiency","Bandwidth Loss Estimation","Base Link Error"], a:0, explanation:"BLER measures percentage of incorrectly received transport blocks." }
],

/* ── MAC / RLC / PDCP ── */
mac: [
{ q:"HARQ operates at which layer?",                           o:["MAC","RLC","PDCP","RRC"], a:0, explanation:"Hybrid ARQ is implemented at MAC layer." },
{ q:"RLC AM mode provides?",                                   o:["Retransmission","Header compression","Encryption","Routing"], a:0, explanation:"Acknowledged Mode supports retransmission." },
{ q:"PDCP handles?",                                           o:["Header compression","Scheduling","RF tuning","Power control"], a:0, explanation:"PDCP performs header compression and ciphering." },
{ q:"Which layer performs scheduling?",                        o:["MAC","RLC","PDCP","IMS"], a:0, explanation:"MAC layer manages resource allocation per TTI." },
{ q:"RLC UM mode is used when?",                               o:["Low latency preferred","High reliability required","Encryption needed","IMS failure"], a:0, explanation:"Unacknowledged Mode reduces delay." },
{ q:"Ciphering in LTE user plane happens at?",                 o:["PDCP","MAC","RLC","RRC"], a:0, explanation:"User plane ciphering occurs at PDCP layer." },
{ q:"What prevents duplicate packets?",                        o:["PDCP sequence number","MAC HARQ","RLC UM","DRX"], a:0, explanation:"PDCP sequence numbering avoids duplication." },
{ q:"What improves reliability at MAC?",                       o:["HARQ","SIP","Diameter","Paging"], a:0, explanation:"HARQ allows fast retransmissions." },
{ q:"RLC segmentation is needed when?",                        o:["Packet size exceeds PDU","Paging","Carrier aggregation","Attach"], a:0, explanation:"RLC segments large PDUs into smaller blocks." },
{ q:"What layer interfaces directly with PHY?",                o:["MAC","PDCP","IMS","MME"], a:0, explanation:"MAC interacts directly with physical layer." },
{ q:"What is the function of MAC scheduler?",                  o:["Allocate radio resources","Encrypt packets","Authenticate UE","Assign IP"], a:0, explanation:"MAC scheduler assigns PRBs every TTI." },
{ q:"RLC TM mode is typically used for?",                      o:["Broadcast channels","VoLTE","Authentication","GTP tunneling"], a:0, explanation:"Transparent Mode is used for broadcast system information." },
{ q:"What does PDCP ROHC perform?",                            o:["Header compression","Encryption","Retransmission","Paging"], a:0, explanation:"ROHC compresses IP headers to reduce overhead." },
{ q:"Which layer reorders out-of-sequence packets?",           o:["PDCP","MAC","PHY","IMS"], a:0, explanation:"PDCP reorders packets based on sequence numbers." },
{ q:"HARQ combines retransmissions using?",                    o:["Soft combining","SIP","GTP","Diameter"], a:0, explanation:"HARQ uses soft combining for better decoding." }
],

/* ── EPC CORE ── */
epc: [
{ q:"MME belongs to which plane?",                             o:["Control","User","Transport","Radio"], a:0, explanation:"MME handles control-plane signaling." },
{ q:"SGW acts as?",                                            o:["Mobility anchor","Policy engine","Authentication server","IMS proxy"], a:0, explanation:"SGW anchors user plane during mobility." },
{ q:"PGW allocates?",                                          o:["IP address","SIM","Tracking area","PRB"], a:0, explanation:"PGW assigns IP address to UE." },
{ q:"HSS communicates with MME via?",                          o:["S6a","S1","X2","Gx"], a:0, explanation:"S6a interface uses Diameter protocol." },
{ q:"GTP-U carries?",                                          o:["User data","Control signaling","Encryption key","Paging"], a:0, explanation:"GTP-U transports user-plane packets." },
{ q:"Which protocol is used on S6a?",                          o:["Diameter","GTP","SIP","HTTP"], a:0, explanation:"Diameter is used between MME and HSS." },
{ q:"Default bearer is created during?",                       o:["Attach","Detach","Paging","HO"], a:0, explanation:"Default bearer established during attach." },
{ q:"PCRF provides?",                                          o:["Policy rules","IP routing","RF tuning","Paging"], a:0, explanation:"PCRF defines QoS and charging policies." },
{ q:"S1-AP is used between?",                                  o:["eNodeB and MME","SGW and PGW","UE and IMS","HSS and PCRF"], a:0, explanation:"S1-AP handles control signaling." },
{ q:"Which interface carries user plane from eNodeB?",         o:["S1-U","S1-MME","S6a","Gx"], a:0, explanation:"S1-U carries GTP-U traffic." },
{ q:"Which node anchors inter-RAT mobility?",                  o:["SGW","PGW","MME","HSS"], a:0, explanation:"SGW acts as mobility anchor for inter-RAT handover." },
{ q:"Which interface connects PGW to external networks?",      o:["SGi","S1","X2","Gx"], a:0, explanation:"SGi connects PGW to internet or external packet networks." },
{ q:"Which protocol encapsulates user data in LTE core?",      o:["GTP-U","SIP","RRC","RLC"], a:0, explanation:"GTP-U tunnels user plane data between nodes." },
{ q:"MME selection during attach is based on?",                o:["Tracking Area","PRB","SINR","QCI"], a:0, explanation:"MME selection depends on configured tracking area." },
{ q:"Which interface exists between SGW and PGW?",             o:["S5/S8","S1","S6a","Gx"], a:0, explanation:"S5/S8 connects SGW and PGW." }
],

/* ── QoS & BEARERS ── */
qos: [
{ q:"What differentiates GBR bearer?",                         o:["Guaranteed bandwidth","Higher encryption","More modulation","Lower PRB"], a:0, explanation:"GBR reserves fixed bandwidth." },
{ q:"Non-GBR bearer is used for?",                             o:["Best effort traffic","VoLTE","Emergency calls","Security"], a:0, explanation:"Non-GBR supports browsing and data." },
{ q:"QCI defines?",                                            o:["Priority & delay","Frequency band","Security level","Carrier aggregation"], a:0, explanation:"QCI defines latency and packet loss characteristics." },
{ q:"Dedicated bearer is created for?",                        o:["Specific QoS flow","Attach only","Paging","DRX"], a:0, explanation:"Dedicated bearer supports GBR traffic like VoLTE." },
{ q:"Which QCI is typical for VoLTE?",                         o:["1","9","5","7"], a:0, explanation:"QCI 1 used for conversational voice." },
{ q:"Bearer consists of?",                                     o:["Radio + Core path","Only radio","Only core","Only IMS"], a:0, explanation:"EPS bearer spans RAN and EPC." },
{ q:"What ensures traffic prioritization?",                    o:["QCI","SINR","PRB","DRX"], a:0, explanation:"QCI controls priority handling." },
{ q:"What triggers dedicated bearer setup?",                   o:["PCRF decision","Attach","Paging","DRX"], a:0, explanation:"PCRF instructs PGW to establish GBR bearer." },
{ q:"VoLTE requires which bearer?",                            o:["GBR","Non-GBR","No bearer","Default only"], a:0, explanation:"VoLTE needs guaranteed bandwidth." },
{ q:"Bearer setup signaling uses?",                            o:["NAS","SIP","RLC","MAC"], a:0, explanation:"NAS messages create EPS bearer." },
{ q:"Which parameter defines packet delay budget?",            o:["QCI","SINR","PRB","MTU"], a:0, explanation:"Each QCI defines a packet delay budget." },
{ q:"What is ARP in LTE QoS?",                                 o:["Allocation & Retention Priority","Access Radio Protocol","Attach Routing Path","Authentication Response Parameter"], a:0, explanation:"ARP determines bearer establishment priority." },
{ q:"Which bearer exists by default?",                         o:["Default bearer","Dedicated bearer","IMS bearer","GBR bearer"], a:0, explanation:"Default bearer created during attach." },
{ q:"QoS enforcement is applied at?",                          o:["PGW","HSS","RLC","PDCP"], a:0, explanation:"PGW enforces QoS policies." },
{ q:"Packet loss rate is defined in?",                         o:["QCI","DRX","PRB","RRC"], a:0, explanation:"Each QCI specifies acceptable packet loss." }
],

/* ── MOBILITY ── */
mobility: [
{ q:"X2 handover avoids?",                                     o:["Core involvement","Radio link","IMS","Attach"], a:0, explanation:"X2 HO handled directly between eNodeBs." },
{ q:"S1 HO involves?",                                         o:["MME","UE only","PCRF","HSS"], a:0, explanation:"S1 HO needs MME participation." },
{ q:"TAU stands for?",                                         o:["Tracking Area Update","Time Allocation Unit","Traffic Access Unit","Transmission Area Unit"], a:0, explanation:"TAU updates UE location." },
{ q:"Inter-RAT HO is between?",                                o:["LTE and 3G","eNodeB-eNodeB","Core-core","IMS-IMS"], a:0, explanation:"Inter-RAT enables LTE to 3G handover." },
{ q:"Paging is triggered by?",                                 o:["MME","UE","SGW","PGW"], a:0, explanation:"MME initiates paging." },
{ q:"SRVCC ensures?",                                          o:["VoLTE fallback","Carrier aggregation","Paging","Security"], a:0, explanation:"SRVCC maintains call continuity." },
{ q:"Mobility anchor in LTE is?",                              o:["SGW","PGW","MME","HSS"], a:0, explanation:"SGW anchors user plane during mobility." },
{ q:"Handover failure often due to?",                          o:["Neighbor misconfig","SIM","IMS","DRX"], a:0, explanation:"Incorrect neighbor list causes HO failure." },
{ q:"RRC re-establishment indicates?",                         o:["Radio failure","Core issue","Billing","APN"], a:0, explanation:"RRC re-establishment occurs after radio link failure." },
{ q:"What impacts HO success rate?",                           o:["Signal strength","SIM card","Diameter","PCRF"], a:0, explanation:"Weak RF conditions reduce HO success." },
{ q:"Which message initiates handover?",                       o:["RRC Reconfiguration","Paging","Attach","TAU"], a:0, explanation:"Handover initiated via RRC reconfiguration." },
{ q:"What is the purpose of Tracking Area?",                   o:["Paging optimization","Encryption","Modulation","Carrier aggregation"], a:0, explanation:"Tracking Areas reduce paging overhead." },
{ q:"Which KPI measures handover success?",                    o:["HO Success Rate","BLER","PRB usage","QCI index"], a:0, explanation:"HO success rate indicates mobility performance." },
{ q:"Which event triggers measurement reporting?",             o:["Event A3","Attach","TAU","DRX"], a:0, explanation:"Event A3 triggers HO measurement when neighbor becomes better." },
{ q:"Ping-pong handover occurs due to?",                       o:["Improper HO thresholds","High encryption","Low DRX","High QCI"], a:0, explanation:"Incorrect threshold configuration causes frequent back-and-forth HO." }
],

/* ── IMS & VOLTE ── */
ims: [
{ q:"IMS uses which protocol?",                                o:["SIP","GTP","Diameter","RLC"], a:0, explanation:"IMS signaling is SIP-based." },
{ q:"VoLTE bearer is?",                                        o:["GBR","Non-GBR","None","Default only"], a:0, explanation:"VoLTE requires GBR bearer." },
{ q:"One-way audio often due to?",                             o:["GTP issue","Paging","Attach","TAU"], a:0, explanation:"User plane tunnel issue causes one-way audio." },
{ q:"IMS registration failure affects?",                       o:["VoLTE","Browsing","SMS only","Attach"], a:0, explanation:"Without IMS registration VoLTE cannot function." },
{ q:"PCRF communicates with PGW via?",                         o:["Gx","S1","S6a","X2"], a:0, explanation:"Gx interface controls policy enforcement." },
{ q:"VoLTE fallback is handled by?",                           o:["SRVCC","DRX","Carrier aggregation","HARQ"], a:0, explanation:"SRVCC moves call to 3G." },
{ q:"SIP operates at which layer?",                            o:["Application","MAC","RLC","PHY"], a:0, explanation:"SIP is application layer protocol." },
{ q:"Emergency call priority handled by?",                     o:["High QCI","DRX","Carrier aggregation","HARQ"], a:0, explanation:"Emergency calls use high priority QCI." },
{ q:"IMS runs over?",                                          o:["IP","Circuit","Analog","Satellite"], a:0, explanation:"IMS is IP-based multimedia system." },
{ q:"VoLTE call setup requires?",                              o:["IMS registration","TAU","Paging only","PRB"], a:0, explanation:"UE must register with IMS before call." },
{ q:"IMS authentication uses?",                                o:["SIP Digest","GTP","RLC","HARQ"], a:0, explanation:"IMS uses SIP-based authentication." },
{ q:"Which interface connects IMS to LTE core?",               o:["SGi","X2","S1","S6a"], a:0, explanation:"IMS connects via SGi interface." },
{ q:"VoLTE call quality depends on?",                          o:["Low latency & GBR","Carrier aggregation","PRB only","TAU"], a:0, explanation:"VoLTE requires low delay and guaranteed bitrate." },
{ q:"AMR codec is used for?",                                  o:["Voice compression","Encryption","Routing","Paging"], a:0, explanation:"Adaptive Multi-Rate codec compresses voice." },
{ q:"Which failure affects VoLTE setup?",                      o:["IMS registration failure","Carrier aggregation","RLC segmentation","MTU mismatch"], a:0, explanation:"IMS registration is mandatory for VoLTE." }
],

/* ── SECURITY ── */
security: [
{ q:"KASME is derived during?",                                o:["Authentication","Paging","Attach complete","DRX"], a:0, explanation:"KASME derived during EPS authentication." },
{ q:"NAS security protects?",                                  o:["Control plane","User plane","Radio only","IMS"], a:0, explanation:"NAS secures control signaling." },
{ q:"AS security protects?",                                   o:["Radio link","Core","IMS","Billing"], a:0, explanation:"AS protects RRC and user plane." },
{ q:"Ciphering occurs at?",                                    o:["PDCP","MAC","RLC","MME"], a:0, explanation:"Ciphering is performed at PDCP." },
{ q:"Integrity protection ensures?",                           o:["Message authenticity","Higher throughput","Better SINR","Lower PRB"], a:0, explanation:"Integrity ensures message not altered." },
{ q:"Which protocol handles authentication?",                  o:["EPS-AKA","SIP","GTP","RLC"], a:0, explanation:"EPS-AKA authenticates UE." },
{ q:"HSS stores?",                                             o:["Authentication vectors","PRB","Carrier aggregation","DRX"], a:0, explanation:"HSS stores authentication data." },
{ q:"Which layer handles ciphering key?",                      o:["PDCP","MAC","RLC","IMS"], a:0, explanation:"PDCP uses derived ciphering key." },
{ q:"Replay attack prevented by?",                             o:["Sequence numbers","Carrier aggregation","Paging","TAU"], a:0, explanation:"Sequence numbers prevent replay." },
{ q:"Security context stored in?",                             o:["MME & UE","SGW only","PGW only","PCRF"], a:0, explanation:"Security context maintained at UE and MME." },
{ q:"Which key protects RRC messages?",                        o:["KRRCint","KASME","GTP key","SIP key"], a:0, explanation:"KRRCint ensures integrity of RRC signaling." },
{ q:"User plane encryption key is?",                           o:["KUPenc","KRRCint","KASME","SIP key"], a:0, explanation:"KUPenc encrypts user-plane data." },
{ q:"Which attack is prevented by integrity protection?",      o:["Message tampering","Carrier drop","Paging","TAU"], a:0, explanation:"Integrity ensures signaling not modified." },
{ q:"Authentication vector is generated in?",                  o:["HSS","MME","SGW","PCRF"], a:0, explanation:"HSS generates authentication vectors." },
{ q:"Security context is refreshed during?",                   o:["Re-authentication","Paging","Carrier aggregation","HO only"], a:0, explanation:"Security keys refreshed during re-authentication." }
]

}; // end questionBank1


// ── BUILD MASTER QUESTION BANK ───────────────────────────────
// BUG FIX: original merge loop tagged ALL questionBank items as
// category:"general" — a category with no UI button, making all
// 90 questions permanently unreachable. Now each item uses its
// explicit cat field as the category.

let masterQuestionBank = [];

// difficulty-stratified bank: keep real category + difficulty level
Object.keys(questionBank).forEach(diff => {
    questionBank[diff].forEach(q => {
        masterQuestionBank.push({
            category:    q.cat,
            difficulty:  diff,
            q:           q.q,
            o:           q.o,
            a:           q.a,
            explanation: q.explanation || "No explanation provided."
        });
    });
});

// category-stratified bank: keep real category, mark difficulty "all"
// (these questions are shown regardless of which difficulty is selected)
Object.keys(questionBank1).forEach(cat => {
    questionBank1[cat].forEach(q => {
        masterQuestionBank.push({
            category:    cat,
            difficulty:  "all",
            q:           q.q,
            o:           q.o,
            a:           q.a,
            explanation: q.explanation || "No explanation provided."
        });
    });
});


// ── DIFFICULTY SELECT ────────────────────────────────────────
difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        difficultyBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        difficulty = btn.dataset.level;
    });
});

// ── CATEGORY SELECT ──────────────────────────────────────────
categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        categoryBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedCategory = btn.dataset.category;
    });
});


// ── START QUIZ ───────────────────────────────────────────────
startBtn.addEventListener("click", () => {

    if (!selectedCategory) { alert("Select a category first!"); return; }
    if (!difficulty)       { alert("Select difficulty!");        return; }

    // Filter: category match AND (difficulty match OR difficulty is "all")
    let filtered = masterQuestionBank.filter(q => {
        let catMatch  = q.category === selectedCategory;
        let diffMatch = q.difficulty === difficulty || q.difficulty === "all";
        return catMatch && diffMatch;
    });

    if (filtered.length === 0) {
        alert("No questions available for this selection.");
        return;
    }

    shuffledQuestions    = shuffleArray(filtered);
    currentQuestionIndex = 0;
    score                = 0;
    selectedAnswer       = null;

    showScreen("quiz-screen");
    loadQuestion();
});


// ── LOAD QUESTION ────────────────────────────────────────────
function loadQuestion() {
    resetOptions();

    const current = shuffledQuestions[currentQuestionIndex];

    questionText.textContent   = current.q;
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
    scoreDisplay.textContent   = `Score: ${score}`;

    // Shuffle options while tracking which original index is correct
    let optionsWithIndex = current.o.map((text, i) => ({ text, originalIndex: i }));
    optionsWithIndex     = shuffleArray(optionsWithIndex);

    optionButtons.forEach((btn, i) => {
        btn.textContent = optionsWithIndex[i].text;
        btn.onclick     = () => selectAnswer(i);
    });

    current.shuffledCorrectIndex = optionsWithIndex.findIndex(
        opt => opt.originalIndex === current.a
    );
}


// ── SELECT ANSWER ────────────────────────────────────────────
function selectAnswer(index) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;

    const current = shuffledQuestions[currentQuestionIndex];
    const correct = current.shuffledCorrectIndex;

    optionButtons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct)           btn.classList.add("correct");
        if (i === index && i !== correct) btn.classList.add("wrong");
    });

    if (index === correct) {
        score++;
        updateScoreBar();
    }

    explanationBox.style.display = "block";
    explanationBox.innerHTML     = "<strong>Explanation:</strong><br><br>" + current.explanation;
}


// ── NEXT ─────────────────────────────────────────────────────
nextBtn.addEventListener("click", () => {
    if (selectedAnswer === null) { alert("Select an answer first!"); return; }

    currentQuestionIndex++;
    selectedAnswer = null;

    if (currentQuestionIndex < shuffledQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});


// ── RESULTS & ANALYTICS ──────────────────────────────────────
function showResults() {
    saveAnalytics();
    showScreen("result-screen");
    finalScore.textContent = `Score: ${score} / ${shuffledQuestions.length}`;

    if (score === shuffledQuestions.length) {
        resultMessage.textContent = "Outstanding! LTE Master 🚀";
    } else if (score >= shuffledQuestions.length / 2) {
        resultMessage.textContent = "Good knowledge 💡";
    } else {
        resultMessage.textContent = "Revise EPC & LTE concepts 📘";
    }
}

function saveAnalytics() {
    const attempt = {
        category:   selectedCategory,
        difficulty: difficulty,
        total:      shuffledQuestions.length,
        score:      score,
        date:       new Date().toISOString()
    };
    let history = JSON.parse(localStorage.getItem("lteQuizAnalytics")) || [];
    history.push(attempt);
    localStorage.setItem("lteQuizAnalytics", JSON.stringify(history));
}

analyticsBtn.addEventListener("click", () => {
    showScreen("analytics-screen");
    generateAnalytics();
});

backHomeBtn.addEventListener("click", () => {
    showScreen("result-screen");
});

function generateAnalytics() {
    let history = JSON.parse(localStorage.getItem("lteQuizAnalytics")) || [];

    if (history.length === 0) {
        overallStats.innerHTML = "No attempts yet.";
        categoryStats.innerHTML = difficultyStats.innerHTML = weakArea.innerHTML = "";
        return;
    }

    let filteredHistory = history.filter(a => a.category === selectedCategory);

    if (filteredHistory.length === 0) {
        overallStats.innerHTML  = "No attempts yet for this category.";
        categoryStats.innerHTML = difficultyStats.innerHTML = weakArea.innerHTML = "";
        return;
    }

    let totalQ = 0, totalC = 0;
    let diffMap = {};

    filteredHistory.forEach(a => {
        totalQ += a.total;
        totalC += a.score;
        if (!diffMap[a.difficulty]) diffMap[a.difficulty] = { total: 0, correct: 0 };
        diffMap[a.difficulty].total   += a.total;
        diffMap[a.difficulty].correct += a.score;
    });

    overallStats.innerHTML =
        `<strong>${selectedCategory.toUpperCase()} Accuracy:</strong> ` +
        `${((totalC / totalQ) * 100).toFixed(1)}% (${totalC}/${totalQ})`;

    difficultyStats.innerHTML = "<h3>Difficulty-wise Performance</h3>";
    let weakest = null, lowest = 101;

    Object.keys(diffMap).forEach(diff => {
        let pct = ((diffMap[diff].correct / diffMap[diff].total) * 100).toFixed(1);
        difficultyStats.innerHTML += `<p>${diff.toUpperCase()}: ${pct}%</p>`;
        if (parseFloat(pct) < lowest) { lowest = parseFloat(pct); weakest = diff; }
    });

    weakArea.innerHTML =
        `<h3>Weakest Difficulty:</h3><p>${weakest ? weakest.toUpperCase() : "N/A"}</p>`;
}


// ── RESTART ──────────────────────────────────────────────────
restartBtn.addEventListener("click", () => {
    scoreBar.style.width = "0%";
    showScreen("start-screen");
});


// ── HELPERS ──────────────────────────────────────────────────
function showScreen(id) {
    screens.forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function resetOptions() {
    optionButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("correct", "wrong");
        explanationBox.style.display = "none";
    });
}

function shuffleArray(arr) {
    let a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function updateScoreBar() {
    scoreBar.style.width = ((score / shuffledQuestions.length) * 100) + "%";
}
