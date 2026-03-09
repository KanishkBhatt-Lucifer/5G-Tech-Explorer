// ============================================================
// 5G NR Case Quiz — Logic
//
// Exact structural replica of the 4G LTE Case Quiz.
// 15 real 5G troubleshooting & architecture scenarios covering:
// NR radio, 5G Core, PDU sessions, network slicing, VoNR,
// handover, beamforming, PFCP, security, and QoS flows.
// ============================================================

// ── DOM ELEMENTS ─────────────────────────────────────────────
const caseTitle      = document.getElementById("case-title");
const caseDescription= document.getElementById("case-description");
const optionButtons  = document.querySelectorAll(".option-btn");
const explanationBox = document.getElementById("explanation-box");
const caseNumber     = document.getElementById("case-number");
const scoreDisplay   = document.getElementById("score-display");
const scoreBar       = document.getElementById("score-bar");
const nextBtn        = document.getElementById("next-btn");
const explainBtn     = document.getElementById("explain-btn");
const caseScreen     = document.getElementById("case-screen");
const resultScreen   = document.getElementById("result-screen");
const finalScore     = document.getElementById("final-score");
const resultMessage  = document.getElementById("result-message");
const restartBtn     = document.getElementById("restart-btn");

let currentCaseIndex = 0;
let selectedAnswer   = null;
let shuffledCases    = [];
let score            = 0;

// ── SHUFFLE HELPERS ──────────────────────────────────────────
function shuffleArray(array) {
    let a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function shuffleOptions(caseObj) {
    let opts = caseObj.options.map((text, i) => ({ text, originalIndex: i }));
    opts = shuffleArray(opts);
    return {
        shuffledOptions: opts.map(o => o.text),
        correctIndex:    opts.findIndex(o => o.originalIndex === caseObj.answer)
    };
}

// ── CASE DATABASE (15 SCENARIOS) ─────────────────────────────
const cases = [

{
    title: "5G Registration Failure — AMF Unreachable",
    description:
`A batch of 5G UEs in a new deployment site cannot register.
The gNB is online and synchronized.
Logs show N2 setup succeeds but all registration requests timeout.
No alarms on the gNB side.`,
    options: [
        "Beam management failure at gNB",
        "AMF unreachable or N2 routing misconfiguration",
        "UDM subscription not provisioned",
        "NSSF slice selection error"
    ],
    answer: 1,
    explanation:
`N2 setup success confirms the gNB-to-AMF transport path is established.
Registration timeouts with no gNB alarms point to AMF processing failure or incorrect N2 SCTP routing.
Check AMF load, NGAP configuration, and SCTP association health.
If AMF is overloaded, NRF-based AMF re-selection can redirect traffic.`
},

{
    title: "PDU Session Establishment Fails for All UEs",
    description:
`After a 5G Core maintenance window, all UEs can register successfully.
However, PDU session establishment fails for every UE.
Signaling trace shows N4 session establishment is never reaching UPF.
N11 between AMF and SMF appears healthy.`,
    options: [
        "AUSF authentication failure",
        "PCF policy misconfiguration",
        "PFCP association between SMF and UPF is down",
        "gNB PDCP reorder failure"
    ],
    answer: 2,
    explanation:
`N4 uses PFCP (Packet Forwarding Control Protocol) between SMF and UPF.
If PFCP association is not established (or dropped after maintenance), SMF cannot program UPF with session rules.
PDU sessions will fail at N4 even though N11 (AMF↔SMF) is healthy.
Fix: restart PFCP on UPF or re-trigger association from SMF.`
},

{
    title: "mmWave Throughput Drops Indoors",
    description:
`A 5G mmWave (FR2) deployment achieves 2 Gbps throughput in open areas.
Inside the same building, throughput drops to under 50 Mbps.
RSRP drops from -65 dBm to -105 dBm indoors.
No NR sub-6 GHz coverage is available at this site.`,
    options: [
        "Incorrect NSSAI configuration",
        "High path loss and poor penetration of mmWave signals",
        "AMF overload",
        "PDCP header compression disabled"
    ],
    answer: 1,
    explanation:
`mmWave (26–28 GHz) has very high path loss and extremely poor building penetration.
The 40 dB RSRP drop from outdoor to indoor is characteristic of this limitation.
Solutions: deploy indoor small cells (picocells), use Integrated Access Backhaul (IAB), or add FR1 coverage for indoor fallback.
This is a fundamental RF planning issue, not a configuration fault.`
},

{
    title: "Beam Failure Recovery Causing Repeated Interruptions",
    description:
`UEs in an FR2 mmWave cell report frequent short interruptions (~50–200 ms).
Event logs show repeated Beam Failure Recovery (BFR) procedures.
RSRP is acceptable on average but fluctuates rapidly.`,
    options: [
        "Incorrect SSB periodicity configuration",
        "Rapid beam blockage causing frequent beam failure — BFR threshold too sensitive",
        "PFCP session rules not applied",
        "N2 SCTP association instability"
    ],
    answer: 1,
    explanation:
`mmWave beams are narrow and highly directional. Even slight obstructions (a hand, a person walking by) can cause beam blockage.
If BFR thresholds (beamFailureDetectionTimer, maxBeamFailureInstances) are set too sensitively, minor fluctuations trigger BFR unnecessarily.
Solutions: tune BFR thresholds, increase SSB beam count for faster candidate beam identification, or deploy more distributed antenna sites to reduce blockage impact.`
},

{
    title: "Slice Unavailable for Enterprise UE",
    description:
`An enterprise UE requests a dedicated URLLC network slice (S-NSSAI = 2).
The UE receives a Registration Accept but the requested slice is rejected.
The Allowed NSSAI in the response only contains the eMBB slice.`,
    options: [
        "NSSF returns slice as unavailable in the UE's current area",
        "UPF PFCP association failure",
        "AMF NAS security error",
        "gNB beam management failure"
    ],
    answer: 0,
    explanation:
`NSSF selects allowed slices based on UE subscription (from UDM), operator policy, and slice availability in the current TA.
If the URLLC slice is not instantiated in that tracking area, NSSF will exclude it from the Allowed NSSAI.
Check: UDM subscription for S-NSSAI 2, NSSF configuration for the TA, and whether the URLLC slice SMF/UPF are deployed in the area.`
},

{
    title: "VoNR Call Setup Fails — IMS Registration Succeeds",
    description:
`UEs successfully register with IMS (SIP 200 OK to REGISTER observed).
However, outgoing VoNR calls fail at the SIP INVITE step.
Data services work normally. EPS fallback is not configured.`,
    options: [
        "NAS security context mismatch",
        "GBR QoS flow for VoNR not being established by PCF/SMF",
        "gNB handover failure",
        "PFCP association down"
    ],
    answer: 1,
    explanation:
`VoNR requires a dedicated GBR QoS flow (5QI=1) to be established via the IMS APN/DNN.
When a call is initiated, P-CSCF signals to PCF which triggers SMF to create the GBR QoS flow.
If PCF policy rules are missing, or the SMF-to-PCF N7 interface has an issue, the GBR flow is never established and the call fails at media negotiation.
Check: PCF policy rules for VoNR, N7 interface health, and SMF QoS flow logs.`
},

{
    title: "One-Way Audio on VoNR Calls",
    description:
`VoNR calls connect successfully and SIP signaling is clean.
One party can hear the other but cannot be heard.
RTP streams are visible in both directions in the IMS core.
The issue affects only UEs on one specific gNB.`,
    options: [
        "GTP-U tunnel misconfiguration on N3 at the affected gNB",
        "AUSF authentication failure",
        "NSSF slice unavailable",
        "PDCP reorder timer expired"
    ],
    answer: 0,
    explanation:
`RTP visible in IMS but absent at the UE indicates a user-plane transport issue between UPF and gNB.
The N3 interface carries GTP-U encapsulated user data. If the GTP-U TEID or endpoint IP is misconfigured on a specific gNB, uplink packets from UE cannot reach UPF.
Since SIP works (control plane is fine) but media doesn't, this is a classic N3 user plane fault.
Check gNB N3 IP configuration, UPF PDR rules, and GTP-U TEID allocation for that gNB.`
},

{
    title: "High Handover Failure Rate on NR–NR Xn Handovers",
    description:
`A cluster of gNBs shows Xn handover failure rate above 20%.
N2-based handovers to the same target cells succeed normally.
Transport between gNBs is confirmed healthy.`,
    options: [
        "XnAP interface misconfiguration between gNBs",
        "AMF overload causing N2 delays",
        "UPF PFCP session not released",
        "NSSF slice mismatch"
    ],
    answer: 0,
    explanation:
`Xn handover success while N2 HO fails would point to AMF. Here it's the reverse — Xn fails but N2 succeeds.
This isolates the fault to the XnAP direct interface between gNBs.
Common causes: missing or incorrect Xn neighbor configuration, mismatched PLMN IDs in XnAP setup, or incorrect gNB IP in the Xn interface table.
Fix: verify XnAP setup messages, re-configure neighbor relations, and check PLMN/gNB-ID parameters.`
},

{
    title: "UE Stuck in RRC Inactive State",
    description:
`UEs in a suburban area frequently get stuck in RRC Inactive state.
They cannot resume without a full RRC re-establishment.
The RAN Notification Area (RNA) spans 12 cells.`,
    options: [
        "RNA configured too large — UE moves out of RNA silently before gNB detects",
        "AMF authentication failure on resume",
        "PFCP association timed out",
        "NSSF unable to find slice for resumed session"
    ],
    answer: 0,
    explanation:
`In RRC Inactive, the UE moves within its RNA without informing the network.
If the RNA is too large, UEs frequently leave it before the gNB triggers an RNA update, causing the context to be stale.
When the UE eventually resumes, the anchor gNB cannot find valid context, forcing re-establishment.
Fix: reduce RNA size to match UE mobility patterns, or tune the RRC Inactive timer.`
},

{
    title: "N26 Interface Missing — EPS Fallback Failing",
    description:
`VoNR-capable UEs fail to fall back to LTE for voice when NR signal degrades.
EPS fallback was expected to redirect calls to LTE VoLTE.
5G Core and LTE EPC are both present.`,
    options: [
        "N26 interface between AMF and MME is not configured",
        "AUSF failure during handover",
        "UPF user plane anchor not released",
        "gNB beam configuration mismatch"
    ],
    answer: 0,
    explanation:
`EPS fallback requires the N26 interface to allow AMF (5GC) and MME (EPC) to exchange UE context during the handover.
Without N26, the 5GC cannot transfer the session to LTE seamlessly.
When a UE needs to fall back to LTE for VoLTE, AMF uses N26 to send the UE context to MME.
Fix: configure and activate the N26 interface between AMF and MME, and enable EPS fallback in gNB RRC configuration.`
},

{
    title: "SUCI Decryption Failure at UDM",
    description:
`A new batch of SIMs is issued to subscribers.
These UEs cannot register — authentication fails at UDM.
Older SIMs on the same network register normally.
Logs show SUCI decryption error at UDM.`,
    options: [
        "New SIMs use a different Home Network Public Key ID not configured in UDM",
        "AMF NAS security algorithm mismatch",
        "gNB PDCP ciphering disabled",
        "PCF missing policy rules for new subscribers"
    ],
    answer: 0,
    explanation:
`5G UEs conceal their SUPI as SUCI using the home network's public key (ECIES).
The public key is identified by a Home Network Public Key ID stored on the SIM.
UDM decrypts SUCI using the corresponding private key, looked up by Key ID.
If new SIMs use a new Key ID that is not provisioned in UDM, decryption fails and authentication cannot proceed.
Fix: provision the new Home Network Public Key and its ID in UDM.`
},

{
    title: "UPF Dropping Packets — No QoS Flow Match",
    description:
`Data sessions establish successfully for a new enterprise slice.
However, application traffic for a specific IoT service is being dropped at UPF.
Other traffic on the same PDU session passes normally.`,
    options: [
        "UPF Packet Detection Rules (PDRs) not matching IoT application traffic",
        "AUSF re-authentication failure",
        "Xn handover failure dropping sessions",
        "gNB SDAP mapping error"
    ],
    answer: 0,
    explanation:
`UPF enforces traffic rules programmed by SMF via PFCP. Each traffic type is identified by a Packet Detection Rule (PDR) containing Service Data Flow (SDF) templates.
If the IoT application uses an IP/port combination not covered by existing PDRs, UPF drops the packets as unmatched.
Fix: update PDRs in SMF to add SDF templates matching the IoT service IP ranges and ports, then push updated rules to UPF via PFCP.`
},

{
    title: "NF Discovery Failing After Core Upgrade",
    description:
`After a 5G Core software upgrade, SMF cannot reach PCF.
Other NF-to-NF calls are working.
Logs show NRF returning empty results for PCF service discovery.`,
    options: [
        "PCF failed to re-register with NRF after upgrade",
        "PFCP association between SMF and UPF reset",
        "AMF lost NAS security context",
        "gNB N2 connection reset"
    ],
    answer: 0,
    explanation:
`In 5G Service-Based Architecture, NFs register their profiles and services with NRF on startup.
After an upgrade, if PCF's NF registration process fails or its NF profile is not renewed, NRF removes it from the registry.
SMF queries NRF for available PCF instances and gets empty results.
Fix: check PCF startup logs for registration errors, manually trigger NRF registration from PCF, or restart the PCF NF registration module.`
},

{
    title: "MR-DC Session Instability",
    description:
`UEs in a Multi-RAT Dual Connectivity (EN-DC) deployment frequently drop the NR secondary cell.
LTE anchor remains stable.
The NR SCG (Secondary Cell Group) is repeatedly added and released within seconds.`,
    options: [
        "NR SCG threshold too aggressive — UEs added to NR before signal is strong enough",
        "AMF NAS timer misconfiguration",
        "UPF N9 interface failure",
        "NSSF slice configuration mismatch"
    ],
    answer: 0,
    explanation:
`In EN-DC, the LTE eNodeB (Master Node) adds an NR gNB as Secondary Node based on A4/B1 measurement events.
If the A4 threshold for NR SCG addition is set too low (adding NR when RSRP is marginal), UEs are added to NR in poor radio conditions.
The weak NR signal then triggers immediate SCG release, creating a rapid add/release loop.
Fix: raise the NR SCG addition threshold to only add NR when signal is reliably strong, and increase the SCG release hysteresis.`
},

{
    title: "Network Slice SLA Breach Under Load",
    description:
`An operator provides an eMBB slice (Slice A) and a URLLC slice (Slice B).
During peak hours, URLLC latency degrades significantly.
Investigation shows eMBB traffic is consuming RAN resources shared with URLLC.`,
    options: [
        "RAN slice isolation not enforced — scheduler treating both slices with equal priority",
        "NSSF assigning UEs to wrong slice",
        "PCF applying eMBB QoS policy to URLLC flows",
        "UPF PFCP session count exceeded"
    ],
    answer: 0,
    explanation:
`Network slicing requires isolation not just in the core but also in the RAN scheduler.
Without RAN slicing configuration (dedicated PRB pools or priority weights per slice), the gNB MAC scheduler treats both slices equally.
Under load, eMBB traffic (which is high volume) consumes resources that URLLC needs for its strict latency requirements.
Fix: configure gNB scheduler with guaranteed PRB allocation or weighted priority for URLLC slice, ensuring resource isolation even under peak eMBB load.`
}

];

// ── INITIALIZATION ───────────────────────────────────────────
shuffledCases = shuffleArray(cases);
loadCase();

// ── LOAD CASE ────────────────────────────────────────────────
function loadCase() {
    selectedAnswer               = null;
    explanationBox.style.display = "none";
    explanationBox.innerHTML     = "";

    const current = shuffledCases[currentCaseIndex];

    caseTitle.textContent       = current.title;
    caseDescription.textContent = current.description;
    caseNumber.textContent      = `Scenario ${currentCaseIndex + 1} of ${shuffledCases.length}`;
    scoreDisplay.textContent    = `Score: ${score}`;

    const shuffled = shuffleOptions(current);

    optionButtons.forEach((btn, i) => {
        btn.textContent = shuffled.shuffledOptions[i];
        btn.classList.remove("correct", "wrong");
        btn.disabled    = false;
        btn.onclick     = () => selectAnswer(i, shuffled.correctIndex);
    });
}

// ── SELECT ANSWER ────────────────────────────────────────────
function selectAnswer(index, correctIndex) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;

    if (index === correctIndex) {
        score++;
        updateScoreBar();
    }

    scoreDisplay.textContent = `Score: ${score}`;

    optionButtons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correctIndex)                btn.classList.add("correct");
        if (i === index && i !== correctIndex) btn.classList.add("wrong");
    });
}

// ── SCORE BAR ────────────────────────────────────────────────
function updateScoreBar() {
    const pct = (score / shuffledCases.length) * 100;
    scoreBar.style.width = pct + "%";
}

// ── SHOW EXPLANATION ─────────────────────────────────────────
explainBtn.addEventListener("click", () => {
    explanationBox.style.display = "block";
    explanationBox.innerHTML =
        "<strong>Detailed Explanation:</strong><br><br>" +
        shuffledCases[currentCaseIndex].explanation;
});

// ── NEXT SCENARIO ────────────────────────────────────────────
nextBtn.addEventListener("click", () => {
    if (selectedAnswer === null) {
        alert("Please select an answer before proceeding.");
        return;
    }

    currentCaseIndex++;

    if (currentCaseIndex >= shuffledCases.length) {
        showResults();
    } else {
        loadCase();
    }
});

// ── RESULTS ──────────────────────────────────────────────────
function showResults() {
    caseScreen.style.display   = "none";
    resultScreen.style.display = "block";

    finalScore.textContent = `Score: ${score} / ${shuffledCases.length}`;

    const pct = (score / shuffledCases.length) * 100;
    if (pct === 100) {
        resultMessage.textContent = "Perfect score — you're a 5G expert! 🚀";
    } else if (pct >= 80) {
        resultMessage.textContent = "Excellent 5G troubleshooting skills! 💡";
    } else if (pct >= 60) {
        resultMessage.textContent = "Good effort — review the missed scenarios. 📘";
    } else {
        resultMessage.textContent = "Keep studying — 5G troubleshooting takes practice. 📡";
    }
}

// ── RESTART ──────────────────────────────────────────────────
restartBtn.addEventListener("click", () => {
    score            = 0;
    currentCaseIndex = 0;
    shuffledCases    = shuffleArray(cases);
    scoreBar.style.width = "0%";

    resultScreen.style.display = "none";
    caseScreen.style.display   = "block";

    loadCase();
});
