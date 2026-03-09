// ============================================================
// 5G NR Quiz — Logic
//
// Exact structural replica of the 4G LTE Quiz.
// Dual question bank architecture:
//   questionBank  — 90 questions, difficulty-stratified (30 easy/
//                   30 medium / 30 hard), each with explicit cat.
//   questionBank1 — 105 questions, category-stratified (15 per
//                   category × 7 categories), difficulty:"all".
// Total: 195 questions, all reachable via category + difficulty.
//
// Categories: nr | stack | core | slicing | mobility | vonr | security
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

let selectedCategory     = null;
let difficulty           = "easy";
let currentQuestionIndex = 0;
let score                = 0;
let selectedAnswer       = null;
let shuffledQuestions    = [];

// ── QUESTION BANKS ───────────────────────────────────────────

// questionBank — difficulty-stratified (30 easy, 30 medium, 30 hard).
// Each question has an explicit cat field for correct filtering.
const questionBank = {

/* ── EASY (30) ── */
easy: [
{ cat:"nr",       q:"5G NR stands for?",                              o:["New Radio","Next Radio","Network Radio","Novel Radio"], a:0 },
{ cat:"core",     q:"5G core network is called?",                     o:["5GC","EPC","MSC","BTS"], a:0 },
{ cat:"nr",       q:"5G NR downlink uses which multiple access?",     o:["OFDMA","SC-FDMA","CDMA","TDMA"], a:0 },
{ cat:"core",     q:"AMF handles?",                                   o:["Registration & mobility","Billing only","User data routing","RF scheduling"], a:0 },
{ cat:"core",     q:"SMF manages?",                                   o:["PDU sessions","Authentication","RF signals","Paging only"], a:0 },
{ cat:"nr",       q:"5G peak speed target?",                          o:["20 Gbps","100 Mbps","1 Gbps","500 Kbps"], a:0 },
{ cat:"nr",       q:"5G latency target?",                             o:["< 1 ms","30 ms","100 ms","10 ms"], a:0 },
{ cat:"core",     q:"UPF belongs to which plane?",                    o:["User plane","Control plane","Transport plane","Radio plane"], a:0 },
{ cat:"slicing",  q:"Network slicing creates?",                       o:["Virtual networks on shared infrastructure","Physical towers","New SIM cards","Extra frequencies"], a:0 },
{ cat:"core",     q:"NRF enables?",                                   o:["NF discovery & registration","Authentication","Billing","RF tuning"], a:0 },
{ cat:"nr",       q:"FR1 covers frequencies up to?",                  o:["7.125 GHz","100 GHz","1 GHz","24 GHz"], a:0 },
{ cat:"nr",       q:"FR2 is also known as?",                          o:["mmWave","Sub-6GHz","FR1 extended","Microwave"], a:0 },
{ cat:"security", q:"AUSF is responsible for?",                       o:["Authentication","Billing","Scheduling","IP routing"], a:0 },
{ cat:"core",     q:"PCF provides?",                                  o:["Policy rules","IP addresses","RF frequencies","Encryption keys"], a:0 },
{ cat:"core",     q:"UDM stores?",                                    o:["Subscriber data","Packets","RF signals","PRB schedules"], a:0 },
{ cat:"vonr",     q:"VoNR voice runs over?",                          o:["IMS over NR","Circuit switched","MSC only","GPRS"], a:0 },
{ cat:"slicing",  q:"NSSF selects?",                                  o:["Network slice for a UE","Frequency band","IP address","HARQ process"], a:0 },
{ cat:"core",     q:"N2 interface connects?",                         o:["gNB to AMF","UE to NRF","UPF to DN","SMF to UPF"], a:0 },
{ cat:"nr",       q:"Massive MIMO refers to?",                        o:["Large antenna arrays at gNB","Higher frequency only","More spectrum","Less latency"], a:0 },
{ cat:"core",     q:"5G core architecture is?",                       o:["Service-Based Architecture","Circuit-Switched","Analog","CDMA-based"], a:0 },
{ cat:"mobility", q:"Xn interface connects?",                         o:["gNB to gNB","UE to AMF","SMF to UPF","SIM to UDM"], a:0 },
{ cat:"security", q:"NAS security protects?",                         o:["Control plane signaling","User plane data","RF only","Billing"], a:0 },
{ cat:"nr",       q:"Beamforming improves?",                          o:["Coverage & capacity","Billing only","Security","Frequency allocation"], a:0 },
{ cat:"core",     q:"N6 connects UPF to?",                            o:["Data Network / Internet","AMF","SMF","gNB"], a:0 },
{ cat:"slicing",  q:"S-NSSAI identifies a?",                          o:["Network slice","Frequency band","IP subnet","gNB ID"], a:0 },
{ cat:"stack",    q:"RRC manages?",                                   o:["Radio resource configuration","Billing","IP routing","Authentication"], a:0 },
{ cat:"mobility", q:"5G UE connected mode is called?",                o:["CM-CONNECTED","RRC-Active","STANDBY","SLEEP"], a:0 },
{ cat:"core",     q:"NEF exposes?",                                   o:["Network capabilities to apps","RF signals","Subscriber SIMs","Frequencies"], a:0 },
{ cat:"nr",       q:"gNB in 5G is equivalent to?",                    o:["eNodeB in 4G","NodeB in 3G","BTS in 2G","MSC"], a:0 },
{ cat:"vonr",     q:"IMS in 5G is used for?",                         o:["Voice and multimedia services","Data routing","RF scheduling","Authentication"], a:0 }
],

/* ── MEDIUM (30) ── */
medium: [
{ cat:"core",     q:"PFCP is used between?",                          o:["SMF and UPF","AMF and UDM","NRF and PCF","gNB and AMF"], a:0 },
{ cat:"nr",       q:"SSB (Synchronization Signal Block) is used for?",o:["Cell search & synchronization","Data transfer","Handover","Billing"], a:0 },
{ cat:"core",     q:"N4 interface connects?",                         o:["SMF to UPF","gNB to AMF","AMF to UDM","PCF to UDR"], a:0 },
{ cat:"slicing",  q:"NSSAI contains?",                                o:["Slice selection assistance info","Frequency bands","IP addresses","Encryption keys"], a:0 },
{ cat:"mobility", q:"Xn handover avoids?",                            o:["Core network involvement","Radio involvement","Security checks","IP assignment"], a:0 },
{ cat:"core",     q:"HTTP/2 is used in 5GC for?",                     o:["Service-Based Interface communication","Radio scheduling","Authentication","Billing"], a:0 },
{ cat:"nr",       q:"Bandwidth Part (BWP) allows?",                   o:["Flexible UE bandwidth adaptation","Fixed spectrum only","Higher encryption","Lower latency always"], a:0 },
{ cat:"slicing",  q:"An end-to-end slice spans?",                     o:["RAN, Transport & Core","Core only","RAN only","Radio only"], a:0 },
{ cat:"core",     q:"UDR stores data for?",                           o:["UDM, PCF and NEF","AMF only","SMF only","gNB"], a:0 },
{ cat:"nr",       q:"CSI-RS is used for?",                            o:["Channel state measurement","Cell search","Handover signaling","Authentication"], a:0 },
{ cat:"security", q:"5G-AKA improves over EPS-AKA by?",              o:["Adding home network confirmation","Removing encryption","Simplifying authentication","Eliminating AUSF"], a:0 },
{ cat:"mobility", q:"Conditional handover improves?",                 o:["HO reliability in high speed","Security","Billing","Encryption"], a:0 },
{ cat:"nr",       q:"TDD in NR means?",                               o:["Uplink & downlink share same frequency at different times","Separate UL/DL frequencies","Only downlink","Analog duplexing"], a:0 },
{ cat:"slicing",  q:"PCF controls policy per?",                       o:["Slice and session","gNB only","UPF only","AMF only"], a:0 },
{ cat:"core",     q:"AMF to SMF interface is?",                       o:["N11","N4","N6","N2"], a:0 },
{ cat:"vonr",     q:"VoNR QoS flow uses which QFI?",                  o:["QFI 1","QFI 9","QFI 5","QFI 7"], a:0 },
{ cat:"core",     q:"SCP manages?",                                   o:["NF-to-NF indirect routing","Authentication","RF scheduling","Billing only"], a:0 },
{ cat:"nr",       q:"Numerology μ=1 gives subcarrier spacing of?",    o:["30 kHz","15 kHz","60 kHz","120 kHz"], a:0 },
{ cat:"mobility", q:"RRC Inactive state reduces?",                    o:["Signaling overhead & power consumption","Coverage","Security","Throughput"], a:0 },
{ cat:"core",     q:"SMF to PCF interface is?",                       o:["N7","N4","N11","N6"], a:0 },
{ cat:"nr",       q:"PUSCH carries?",                                 o:["Uplink shared channel data","Downlink control","System broadcast","Paging"], a:0 },
{ cat:"security", q:"SUCI conceals?",                                 o:["SUPI (subscriber identity)","APN","IP address","Slice ID"], a:0 },
{ cat:"slicing",  q:"URSP rules map?",                                o:["Application traffic to a slice","Frequencies to UEs","IPs to gNBs","Encryption to bearers"], a:0 },
{ cat:"nr",       q:"CORESET is used for?",                           o:["PDCCH scheduling region","Data transfer","Handover","PDCP reordering"], a:0 },
{ cat:"stack",    q:"SDAP layer in 5G maps?",                         o:["QoS flows to radio bearers","IP to MAC","RRC to PDCP","AMF to gNB"], a:0 },
{ cat:"vonr",     q:"Reflective QoS is applied at?",                  o:["UE uplink","gNB","SMF","UPF"], a:0 },
{ cat:"core",     q:"N9 interface connects?",                         o:["Two UPFs","gNB to AMF","SMF to PCF","UDM to AUSF"], a:0 },
{ cat:"stack",    q:"PDCP in 5G performs?",                           o:["Header compression, ciphering & reordering","Scheduling","RF modulation","Paging"], a:0 },
{ cat:"mobility", q:"RNA (RAN Notification Area) is used in?",        o:["RRC Inactive state","RRC Connected","CM-IDLE","Detach"], a:0 },
{ cat:"nr",       q:"FR2 mmWave has which coverage characteristic?",  o:["Short range, high capacity","Long range, low capacity","Same as FR1","No beamforming needed"], a:0 }
],

/* ── HARD (30) ── */
hard: [
{ cat:"security", q:"SUPI is protected in air interface by?",         o:["SUCI using ECIES encryption","GTP tunneling","NAS integrity","PDCP ciphering"], a:0 },
{ cat:"nr",       q:"Phase Tracking RS (PT-RS) compensates?",         o:["Phase noise in mmWave","Multipath fading","Inter-symbol interference","Timing advance"], a:0 },
{ cat:"core",     q:"NSSAAF provides?",                               o:["Slice-specific authentication & authorization","NF discovery","User plane anchoring","Billing"], a:0 },
{ cat:"mobility", q:"DAPS handover ensures?",                         o:["Data continuity by keeping source & target links","Core-less HO","Security re-keying","Paging avoidance"], a:0 },
{ cat:"security", q:"SEPP protects?",                                 o:["Roaming N32 interface between PLMNs","Radio link","Core SBI","UPF user plane"], a:0 },
{ cat:"nr",       q:"MU-MIMO allows?",                                o:["Multiple UEs on same time-frequency resource","Higher frequency only","Carrier aggregation","Lower modulation"], a:0 },
{ cat:"core",     q:"NWDAF provides?",                                o:["AI/ML-based network analytics","Authentication","Billing","RF scheduling"], a:0 },
{ cat:"slicing",  q:"RAN slicing is achieved through?",               o:["RB and scheduler partitioning","Core NF isolation","IP routing","Encryption separation"], a:0 },
{ cat:"nr",       q:"Rate matching in NR works around?",              o:["CORESET & punctured resources","All PRBs uniformly","HARQ retransmissions","RRC messages"], a:0 },
{ cat:"security", q:"Steering of Roaming (SoR) is protected by?",     o:["UDM in home network","SEPP","AMF","gNB"], a:0 },
{ cat:"core",     q:"UDSF stores?",                                   o:["Unstructured NF context data","Subscriber profiles","Policy rules","Authentication vectors"], a:0 },
{ cat:"mobility", q:"L1/L2 triggered mobility avoids?",               o:["RRC signaling delay","Core involvement","UPF reselection","Authentication"], a:0 },
{ cat:"nr",       q:"Front-loaded DMRS improves?",                    o:["Early channel estimation for decoding","Handover speed","Security","Scheduling delay"], a:0 },
{ cat:"slicing",  q:"Slice isolation is enforced by?",                o:["UPF + PCF + RAN scheduler","AMF only","gNB only","NRF"], a:0 },
{ cat:"security", q:"RES* differs from RES by?",                      o:["Additional hashing before sending to home network","Shorter length","No encryption","Removing AUTN"], a:0 },
{ cat:"nr",       q:"DCI format 0_1 is used for?",                    o:["PUSCH scheduling","PDSCH scheduling","Paging","SSB"], a:0 },
{ cat:"core",     q:"PCF to AF interface is?",                        o:["N5","N7","N4","N11"], a:0 },
{ cat:"mobility", q:"Early Measurement Reporting uses?",              o:["L1 measurements before RRC trigger","L3 measurements only","Core analytics","NRF data"], a:0 },
{ cat:"nr",       q:"LDPC codes are used for?",                       o:["Data channel (PDSCH/PUSCH) coding","Control channel coding","Paging channel","SSB"], a:0 },
{ cat:"security", q:"Security context in 5G is stored in?",           o:["AMF & UE","SGW only","UPF only","PCF"], a:0 },
{ cat:"slicing",  q:"SSC (Session & Service Continuity) mode 3 supports?", o:["Multi-homed PDU sessions","Single anchor only","No mobility","Slice isolation only"], a:0 },
{ cat:"nr",       q:"Polar codes in 5G NR are used for?",             o:["Control channel (PDCCH/PUCCH) coding","Data channels","SSB","Paging"], a:0 },
{ cat:"vonr",     q:"Emergency VoNR call gets priority via?",         o:["High QFI and DSCP markings","Default bearer","Paging only","TAU"], a:0 },
{ cat:"core",     q:"Indirect communication in 5GC uses?",            o:["SCP (Service Communication Proxy)","NRF only","UPF","AUSF"], a:0 },
{ cat:"mobility", q:"NG-RAN node types include?",                     o:["gNB and ng-eNB","gNB only","ng-eNB only","CU and DU only"], a:0 },
{ cat:"security", q:"Bidding-down attack in 5G is prevented by?",     o:["NAS security capability negotiation","PDCP ciphering","SEPP","UPF filtering"], a:0 },
{ cat:"nr",       q:"CSI report includes?",                           o:["CQI, RI and PMI","Only RSRP","Only SNR","Paging indicators"], a:0 },
{ cat:"core",     q:"N14 interface is between?",                      o:["AMF and AMF (for mobility)","SMF and UPF","PCF and UDR","NRF and SCP"], a:0 },
{ cat:"stack",    q:"RLC UM mode in 5G preferred for?",               o:["Low-latency services where retransmission delay is unacceptable","VoNR always","Broadcast only","Security"], a:0 },
{ cat:"slicing",  q:"Network slice subnet is managed by?",            o:["NSSMF (Network Slice Subnet Management Function)","AMF","PCF","NSSF"], a:0 }
]

}; // end questionBank


// questionBank1 — category-stratified, all difficulty levels (15 per category)
const questionBank1 = {

/* ── NR AIR INTERFACE ── */
nr: [
{ q:"What is the minimum subcarrier spacing in 5G NR?",                o:["15 kHz","7.5 kHz","30 kHz","60 kHz"], a:0, explanation:"Numerology μ=0 gives 15 kHz SCS, same as LTE baseline." },
{ q:"What determines the numerology in 5G NR?",                        o:["Subcarrier spacing (μ parameter)","IP routing policy","UE category","AMF selection"], a:0, explanation:"Numerology defines SCS as 15×2^μ kHz." },
{ q:"Which channel carries downlink scheduling grants?",                o:["PDCCH","PUSCH","PRACH","PBCH"], a:0, explanation:"PDCCH carries DCI for scheduling UEs." },
{ q:"What is the purpose of PRACH?",                                   o:["Random access procedure initiation","User data transfer","Handover signaling","Paging"], a:0, explanation:"PRACH is used by UE to initiate random access." },
{ q:"What does beamforming achieve in mmWave?",                        o:["Concentrates signal energy in a specific direction","Eliminates OFDMA","Reduces spectrum","Increases latency"], a:0, explanation:"Beamforming overcomes high path loss at mmWave frequencies." },
{ q:"What is the resource grid unit in NR?",                           o:["Resource Element (RE)","PRB","TTI","Slot"], a:0, explanation:"RE is one subcarrier × one OFDM symbol." },
{ q:"How many OFDM symbols are in a 5G NR slot?",                      o:["14","7","12","10"], a:0, explanation:"A 5G NR slot contains 14 OFDM symbols (normal CP)." },
{ q:"What does SSB (SS/PBCH block) contain?",                          o:["PSS, SSS and PBCH","PDCCH and PDSCH","PUSCH and PUCCH","RRC messages"], a:0, explanation:"SSB carries synchronization signals and broadcast channel." },
{ q:"Which signal is used for beam management?",                       o:["CSI-RS","DMRS","PRACH","PUCCH"], a:0, explanation:"CSI-RS enables channel measurement and beam management." },
{ q:"What does SINR primarily determine?",                             o:["Modulation and coding scheme (MCS)","Power only","IP routing","Paging area"], a:0, explanation:"Higher SINR allows higher MCS and better throughput." },
{ q:"What increases spectral efficiency in NR?",                       o:["Higher order modulation (up to 256-QAM)","Lower bandwidth","More paging","Higher DRX"], a:0, explanation:"256-QAM encodes 8 bits per symbol." },
{ q:"What is the purpose of cyclic prefix in NR?",                     o:["Guard against inter-symbol interference from multipath","Increase modulation order","Improve security","Enhance routing"], a:0, explanation:"CP absorbs multipath delay spread." },
{ q:"Which duplex modes are supported in 5G NR?",                      o:["FDD, TDD and SUL","Only FDD","Only TDD","Half Duplex only"], a:0, explanation:"NR also adds SUL (Supplementary Uplink) to FR1." },
{ q:"What is RSRP in 5G NR?",                                         o:["Reference Signal Received Power — signal strength indicator","Round-trip signal ratio","Resource scheduling reference","Radio service request priority"], a:0, explanation:"RSRP measures power of NR reference signals for cell selection." },
{ q:"Carrier aggregation in NR allows?",                              o:["Multiple component carriers for wider bandwidth","Single carrier only","Removing OFDMA","Analog fallback"], a:0, explanation:"CA can aggregate up to 16 carriers in NR." }
],

/* ── PROTOCOL STACK ── */
stack: [
{ q:"Which layer is added in 5G NR that was not in LTE?",             o:["SDAP","PDCP","RLC","MAC"], a:0, explanation:"SDAP (Service Data Adaptation Protocol) maps QoS flows to DRBs." },
{ q:"SDAP maps QoS flows to?",                                        o:["Data Radio Bearers (DRBs)","IP subnets","PDCP entities","Physical channels"], a:0, explanation:"SDAP is the top NR layer, handling QoS-to-bearer mapping." },
{ q:"What does PDCP integrity protection apply to?",                  o:["RRC messages and user data","Physical signals only","IP headers only","Billing"], a:0, explanation:"PDCP applies integrity to control plane and optionally user plane." },
{ q:"RLC AM mode provides?",                                          o:["Acknowledged retransmission","Header compression","Encryption","Beam selection"], a:0, explanation:"AM uses ARQ for reliable delivery." },
{ q:"What does the MAC layer scheduler do in 5G?",                    o:["Allocate PRBs to UEs each slot","Encrypt packets","Authenticate UE","Assign IP address"], a:0, explanation:"MAC scheduler assigns radio resources every slot." },
{ q:"HARQ in 5G operates at?",                                        o:["MAC layer","PDCP","RLC","SDAP"], a:0, explanation:"Hybrid ARQ retransmission is at MAC layer." },
{ q:"What does PDCP ROHC compress?",                                  o:["IP/UDP/RTP headers","Entire PDU","Security keys","Billing records"], a:0, explanation:"ROHC reduces overhead for voice and data headers." },
{ q:"Which layer reorders out-of-sequence packets in 5G?",            o:["PDCP","MAC","SDAP","PHY"], a:0, explanation:"PDCP reorders using sequence numbers after HARQ delivery." },
{ q:"RLC TM mode is used for?",                                       o:["Broadcast channels (BCCH)","VoNR","Authentication","GTP tunneling"], a:0, explanation:"Transparent Mode passes data without segmentation." },
{ q:"What triggers a PDCP re-establishment?",                         o:["Handover or RRC re-establishment","Paging","Billing update","IP change"], a:0, explanation:"PDCP is re-established to reset ciphering on handover." },
{ q:"Which layer handles beam failure recovery reporting?",            o:["MAC","PDCP","SDAP","RLC"], a:0, explanation:"MAC carries beam failure recovery request." },
{ q:"What is a DRB (Data Radio Bearer)?",                             o:["Radio path for user plane data per QoS flow","Control plane signaling channel","IP routing entry","Security context"], a:0, explanation:"DRBs carry user-plane data per QoS requirement." },
{ q:"HARQ soft combining improves?",                                  o:["Decoding reliability across retransmissions","IP routing","Security","Power consumption"], a:0, explanation:"Soft combining accumulates energy from retransmissions." },
{ q:"Which layer performs ciphering in 5G user plane?",               o:["PDCP","MAC","RLC","SDAP"], a:0, explanation:"PDCP applies confidentiality protection." },
{ q:"RLC segmentation is triggered when?",                            o:["PDU size exceeds available MAC opportunity","Paging","Handover only","Security re-keying"], a:0, explanation:"RLC segments PDCP PDUs to fit MAC transport blocks." }
],

/* ── 5G CORE ── */
core: [
{ q:"AMF communicates with UE via?",                                  o:["N1 (NAS signaling)","N2","N4","N6"], a:0, explanation:"N1 carries NAS messages between AMF and UE." },
{ q:"Which interface carries user plane data between gNB and UPF?",   o:["N3","N2","N4","N6"], a:0, explanation:"N3 carries GTP-U user plane traffic." },
{ q:"Which protocol is used on N4 between SMF and UPF?",              o:["PFCP","HTTP/2","GTP-U","SIP"], a:0, explanation:"Packet Forwarding Control Protocol controls UPF rules." },
{ q:"PCF retrieves policy data from?",                                o:["UDR","UDM","NRF","AUSF"], a:0, explanation:"PCF reads subscriber policies stored in UDR." },
{ q:"Which NF is responsible for IP address allocation?",             o:["SMF","AMF","UPF","NRF"], a:0, explanation:"SMF allocates UE IP address for the PDU session." },
{ q:"What type of API does 5GC SBI use?",                             o:["RESTful over HTTP/2","DIAMETER","GTP-C","SIP"], a:0, explanation:"5G SBI uses REST APIs with HTTP/2 and JSON." },
{ q:"UPF enforces rules received from?",                              o:["SMF via PFCP","AMF via N2","PCF via N7","NRF via N27"], a:0, explanation:"SMF programs UPF with Packet Detection Rules." },
{ q:"Which interface connects AMF to AUSF?",                          o:["N12","N11","N4","N6"], a:0, explanation:"N12 is between AMF and AUSF for authentication." },
{ q:"AUSF communicates with UDM via?",                                o:["N13","N12","N10","N8"], a:0, explanation:"N13 is used for authentication credential retrieval." },
{ q:"NEF is the successor to which 4G function?",                     o:["SCEF","PCRF","HSS","PGW"], a:0, explanation:"NEF replaces the 4G Service Capability Exposure Function." },
{ q:"Which NF provides load balancing between NF instances?",         o:["SCP","NRF","AMF","PCF"], a:0, explanation:"SCP can distribute load across multiple NF instances." },
{ q:"A PDU session is anchored at?",                                  o:["UPF (PDU Session Anchor)","AMF","SMF","gNB"], a:0, explanation:"PSA-UPF provides the connectivity point to the data network." },
{ q:"Which NF stores and manages unified subscriber data?",           o:["UDM","AMF","PCF","NEF"], a:0, explanation:"UDM manages subscriber identities and subscription data." },
{ q:"N32 interface is used for?",                                     o:["Roaming between PLMNs via SEPP","Local NF communication","UPF control","gNB handover"], a:0, explanation:"N32 connects SEPPs of different operators." },
{ q:"Which NF handles network analytics in 5G?",                      o:["NWDAF","PCF","AMF","NRF"], a:0, explanation:"NWDAF provides ML-based analytics to other NFs." }
],

/* ── SLICING & QoS ── */
slicing: [
{ q:"What does NSSAI stand for?",                                     o:["Network Slice Selection Assistance Information","Network Security Slice Access Index","Node Slice Scheduling Allocation Information","Network Service Subnet Assignment Identifier"], a:0, explanation:"NSSAI is the set of S-NSSAIs identifying requested slices." },
{ q:"What are the three main 5G use case categories?",                o:["eMBB, URLLC, mMTC","FDD, TDD, SUL","CP, UP, MP","NR, LTE, NB-IoT"], a:0, explanation:"eMBB, URLLC and mMTC are the three ITU-defined 5G use case families." },
{ q:"QoS in 5G is based on?",                                         o:["QoS Flows identified by QFI","Bearers only like LTE","Channels","IP precedence only"], a:0, explanation:"5G uses QoS flows mapped by SDAP, replacing bearer model." },
{ q:"GBR QoS flow guarantees?",                                       o:["Minimum bandwidth","Best effort","No latency bound","DSCP only"], a:0, explanation:"GBR flows reserve bandwidth for services like VoNR." },
{ q:"Non-GBR QoS flow is used for?",                                  o:["Best-effort traffic like browsing","VoNR","Emergency calls","mMTC always"], a:0, explanation:"Non-GBR flows share available resources without guarantee." },
{ q:"5QI is the 5G equivalent of LTE?",                               o:["QCI","PRB","SINR","HARQ"], a:0, explanation:"5G QoS Identifier (5QI) defines QoS characteristics per flow." },
{ q:"Which 5QI is standardized for VoNR conversational voice?",       o:["1","9","5","7"], a:0, explanation:"5QI 1 is the conversational voice profile." },
{ q:"Slice isolation ensures?",                                       o:["Issues in one slice do not affect others","All slices share the same QoS","Slices merge on congestion","No encryption needed"], a:0, explanation:"Isolation is key to network slicing reliability and security." },
{ q:"URSP (UE Route Selection Policy) determines?",                   o:["Which slice or PDU session to use for each app","Frequency selection","HARQ retransmission","PDCP reorder"], a:0, explanation:"URSP rules allow the UE to route traffic to the right slice." },
{ q:"ARP (Allocation & Retention Priority) determines?",              o:["QoS flow preemption & priority","Frequency band","Encryption level","Cell selection"], a:0, explanation:"ARP governs whether a flow can preempt another." },
{ q:"Which NF enforces QoS rules on user traffic?",                   o:["UPF","AMF","PCF","NRF"], a:0, explanation:"UPF enforces per-flow QoS using Packet Detection Rules." },
{ q:"Packet Delay Budget (PDB) is defined per?",                      o:["5QI","PRB","IP address","gNB"], a:0, explanation:"Each 5QI specifies a maximum end-to-end PDB." },
{ q:"Which function determines the allowed NSSAI for a UE?",          o:["NSSF with UDM input","AMF alone","gNB","UPF"], a:0, explanation:"NSSF selects the slice set based on subscription and policy." },
{ q:"Dynamic PCC (Policy & Charging Control) is provided by?",        o:["PCF to SMF","AMF to gNB","UPF to DN","NRF to SCP"], a:0, explanation:"PCF pushes PCC rules to SMF for enforcement at UPF." },
{ q:"Packet loss rate is defined per?",                               o:["5QI","PRB","DRX","NAS message"], a:0, explanation:"5QI specifies the acceptable packet error rate." }
],

/* ── MOBILITY ── */
mobility: [
{ q:"Xn handover in 5G avoids?",                                      o:["Core network involvement","Radio re-establishment","Security context","Encryption"], a:0, explanation:"Xn HO is handled directly between gNBs like X2 in LTE." },
{ q:"N2-based handover requires?",                                    o:["AMF involvement","UE only","PCF only","UPF only"], a:0, explanation:"N2 HO requires AMF coordination between source and target." },
{ q:"RRC Inactive state in 5G provides?",                             o:["Power saving with fast re-activation","Full radio activity","No connection","Same as idle"], a:0, explanation:"RRC Inactive maintains context at gNB for fast resumption." },
{ q:"What triggers a cell reselection in idle mode?",                 o:["Measured RSRP/RSRQ vs threshold","Billing cycle","Security re-keying","AMF decision"], a:0, explanation:"UE reselects based on signal measurement thresholds." },
{ q:"5G supports which inter-system HO?",                             o:["5G to LTE (EPS Fallback)","5G to 3G only","5G to 2G only","No inter-system"], a:0, explanation:"EPS fallback enables handover from NR to LTE for voice." },
{ q:"What is the purpose of measurement events in NR?",               o:["Trigger handover & beam management","Billing","IP assignment","Authentication"], a:0, explanation:"A3/A4/A5 events trigger measurement reports for HO decisions." },
{ q:"Beam failure detection uses?",                                   o:["L1 RSRP below threshold","L3 measurements","Core analytics","NRF reporting"], a:0, explanation:"PHY layer monitors beam quality and triggers beam failure." },
{ q:"Dual Active Protocol Stack (DAPS) HO allows?",                   o:["UE to receive from source & target simultaneously","Source disconnection before target","No protocol re-establishment","Core involvement only"], a:0, explanation:"DAPS minimizes interruption time during handover." },
{ q:"What does Tracking Area Update (TAU equivalent) do in 5G?",      o:["Registration Area Update notifies AMF of UE location","Updates IP only","Changes slice","Re-authenticates UE"], a:0, explanation:"5G uses Registration Area updates instead of TAU." },
{ q:"Multi-RAT Dual Connectivity (MR-DC) allows?",                   o:["Simultaneous LTE and NR connections","Single band only","Core-only diversity","No radio aggregation"], a:0, explanation:"MR-DC uses both LTE and NR radio for a UE simultaneously." },
{ q:"Conditional HO prepares?",                                       o:["Target cell before trigger condition is met","Immediate disconnection","Core path change only","Security refresh only"], a:0, explanation:"CHO pre-configures target to reduce interruption." },
{ q:"RAN-based paging is used in?",                                   o:["RRC Inactive to wake up UE","CM-IDLE","CM-CONNECTED","Detach only"], a:0, explanation:"gNB pages UE in RRC Inactive without involving core." },
{ q:"Which KPI measures handover success in 5G?",                     o:["HO Success Rate (HOSR)","BLER","PRB utilization","5QI index"], a:0, explanation:"HOSR is the key mobility performance indicator." },
{ q:"L1/L2 triggered mobility reduces?",                             o:["Handover latency by avoiding RRC re-configuration","Core signaling","Encryption overhead","IP re-assignment"], a:0, explanation:"L1/L2 mobility skips RRC for faster beam/cell switch." },
{ q:"Which interface is used for X2-equivalent signaling in 5G?",     o:["XnAP over Xn","S1-AP","N2-AP","GTP-U"], a:0, explanation:"XnAP (Xn Application Protocol) is used between gNBs." }
],

/* ── IMS & VoNR ── */
vonr: [
{ q:"VoNR uses which signaling protocol?",                            o:["SIP","GTP","PFCP","RLC"], a:0, explanation:"IMS uses SIP for call setup and teardown." },
{ q:"EPS fallback allows?",                                           o:["VoNR call to fall to LTE VoLTE when NR IMS unavailable","Carrier aggregation","Power saving","Security"], a:0, explanation:"EPS fallback maintains voice continuity if VoNR not ready." },
{ q:"VoNR requires which QoS flow type?",                             o:["GBR QoS flow","Non-GBR","Default only","mMTC bearer"], a:0, explanation:"VoNR requires guaranteed bitrate for voice quality." },
{ q:"IMS P-CSCF is responsible for?",                                 o:["First IMS contact point for UE","IP routing","Billing only","Authentication vector generation"], a:0, explanation:"P-CSCF is the SIP proxy the UE connects to first." },
{ q:"RTP carries?",                                                   o:["Real-time voice and video media","Signaling only","Paging","GTP-U"], a:0, explanation:"RTP transports media streams in IMS." },
{ q:"AMR-WB codec is used for?",                                      o:["HD voice over VoNR","Encryption","Data routing","Authentication"], a:0, explanation:"AMR-WB provides wideband audio quality for VoNR." },
{ q:"IMS registration must succeed before?",                          o:["Any VoNR call can be established","Data session","Attach","TAU"], a:0, explanation:"UE must register with IMS P-CSCF to use voice services." },
{ q:"One-way audio in VoNR typically indicates?",                     o:["User plane GTP-U path issue","SIP failure","Billing error","Authentication failure"], a:0, explanation:"Asymmetric routing or UPF misconfiguration causes one-way audio." },
{ q:"IMS authentication uses?",                                       o:["IMS-AKA / SIP Digest","GTP","RLC","HARQ"], a:0, explanation:"IMS-AKA provides mutual authentication in IMS." },
{ q:"Which interface connects IMS to the 5G data network?",           o:["N6 from UPF to IMS","N2","N4","Xn"], a:0, explanation:"IMS is reached via N6 interface from UPF." },
{ q:"VoNR call setup delay is mainly affected by?",                   o:["IMS registration & SIP round trips","PRB scheduling","Carrier aggregation","Billing"], a:0, explanation:"SIP signaling latency dominates call setup time." },
{ q:"Emergency call in VoNR uses?",                                   o:["High priority 5QI and special IMS routing","Default bearer","No QoS","Paging only"], a:0, explanation:"Emergency calls bypass normal authentication and use high QoS." },
{ q:"RTCP is used alongside RTP for?",                                o:["Quality monitoring and control","Data transfer","Authentication","IP routing"], a:0, explanation:"RTCP provides feedback on RTP stream quality." },
{ q:"Voice call continuity across NR and LTE is handled by?",         o:["SRVCC or EPS fallback","Carrier aggregation","Paging","DRX"], a:0, explanation:"SRVCC/EPS fallback maintains call continuity across RATs." },
{ q:"IMS S-CSCF performs?",                                           o:["SIP session control & service triggering","IP routing","Authentication vector storage","Billing aggregation"], a:0, explanation:"S-CSCF handles registration and session routing in IMS." }
],

/* ── SECURITY ── */
security: [
{ q:"5G-AKA authentication involves which home function?",             o:["AUSF & UDM","PCF & NRF","SMF & UPF","gNB & AMF"], a:0, explanation:"AUSF and UDM collaborate to authenticate the UE." },
{ q:"SUCI protects subscriber identity using?",                       o:["ECIES public key encryption","Symmetric AES","GTP tunneling","NAS ciphering"], a:0, explanation:"SUCI conceals SUPI using home network public key." },
{ q:"Which security layer protects the radio link?",                  o:["AS (Access Stratum) security","NAS security","Application security","SEPP"], a:0, explanation:"AS security encrypts and integrity-protects RRC and user plane." },
{ q:"NAS integrity protection prevents?",                             o:["Message tampering and replay on control plane","RF interference","IP routing errors","PRB misconfiguration"], a:0, explanation:"NAS integrity ensures signaling authenticity." },
{ q:"5G master key is derived as?",                                   o:["KAUSF then KAMF then sub-keys","KASME directly","KRRCint directly","GTP key"], a:0, explanation:"5G key hierarchy derives from KAUSF via KAMF at AMF." },
{ q:"Which 5G function protects roaming interfaces?",                 o:["SEPP (Security Edge Protection Proxy)","NRF","AMF","NSSF"], a:0, explanation:"SEPP filters and protects N32 inter-PLMN signaling." },
{ q:"User plane integrity protection in 5G is?",                      o:["Optional, activated by network policy","Mandatory always","Not supported","Only for eMBB"], a:0, explanation:"UP integrity is optional in 5G unlike NAS where mandatory." },
{ q:"Which attack does SUCI prevent?",                                o:["IMSI catching (identity tracking)","IP spoofing","GTP flooding","PRB exhaustion"], a:0, explanation:"SUCI prevents passive IMSI catchers from identifying subscribers." },
{ q:"KUPenc protects?",                                               o:["User plane data confidentiality","Control plane signaling","IMS SIP","Billing records"], a:0, explanation:"KUPenc is the user plane encryption key derived from KAMF." },
{ q:"KRRCint provides?",                                              o:["RRC message integrity protection","User plane encryption","IMS authentication","Handover security"], a:0, explanation:"KRRCint ensures integrity of RRC control messages." },
{ q:"Security context is transferred during handover via?",           o:["Key derivation using NH and NCC","GTP-U","N6","SIP"], a:0, explanation:"Next Hop (NH) chaining ensures forward security during HO." },
{ q:"Primary authentication result is?",                              o:["KAUSF derived at AUSF","KAMF directly","KRRCint immediately","User plane key"], a:0, explanation:"Primary authentication derives KAUSF at AUSF from UDM vectors." },
{ q:"Replay attacks in 5G are countered by?",                         o:["Sequence numbers in NAS & PDCP","Higher SINR","Carrier aggregation","IP filtering only"], a:0, explanation:"NAS and PDCP sequence numbers prevent replay of messages." },
{ q:"Which procedure refreshes security keys?",                       o:["Re-authentication or intra-AMF handover","Paging","TAU","Attach only"], a:0, explanation:"Key refresh happens on re-authentication or specific handover events." },
{ q:"Certificate-based authentication in 5G is used for?",            o:["Network functions (NF authentication in SBI)","UE authentication","gNB to gNB","Billing"], a:0, explanation:"NF authentication in SBA uses TLS certificates." }
]

}; // end questionBank1


// ── BUILD MASTER QUESTION BANK ───────────────────────────────
let masterQuestionBank = [];

// Difficulty-stratified bank: keep real category + difficulty level
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

// Category-stratified bank: mark difficulty "all" so they appear
// regardless of which difficulty level is selected
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
        if (i === correct)                btn.classList.add("correct");
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
        resultMessage.textContent = "Outstanding! 5G Expert 🚀";
    } else if (score >= shuffledQuestions.length / 2) {
        resultMessage.textContent = "Good knowledge 💡";
    } else {
        resultMessage.textContent = "Revise 5G NR & Core concepts 📘";
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
    let history = JSON.parse(localStorage.getItem("5gQuizAnalytics")) || [];
    history.push(attempt);
    localStorage.setItem("5gQuizAnalytics", JSON.stringify(history));
}

analyticsBtn.addEventListener("click", () => {
    showScreen("analytics-screen");
    generateAnalytics();
});

backHomeBtn.addEventListener("click", () => {
    showScreen("result-screen");
});

function generateAnalytics() {
    let history = JSON.parse(localStorage.getItem("5gQuizAnalytics")) || [];

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
