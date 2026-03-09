// ============================================================
// 4G LTE Case Quiz — Logic
//
// BUGS FIXED:
// 1. No score tracking at all — score variable, increment, and
//    live display added.
// 2. No completion screen — alert("completed") replaced with a
//    proper result screen showing score + performance message.
// 3. nextBtn had no answer guard — you could skip all 15 scenarios
//    without ever selecting an option. Guard added.
// 4. Inline code inside <script src=""> tag (in HTML) was silently
//    ignored by browsers — removed from HTML entirely.
// ============================================================

// ── DOM ELEMENTS ─────────────────────────────────────────────
const caseTitle      = document.getElementById("case-title");
const caseDescription= document.getElementById("case-description");
const optionButtons  = document.querySelectorAll(".option-btn");
const explanationBox = document.getElementById("explanation-box");
const caseNumber     = document.getElementById("case-number");
const scoreDisplay   = document.getElementById("score-display");   // BUG FIX: new
const scoreBar       = document.getElementById("score-bar");       // BUG FIX: new
const nextBtn        = document.getElementById("next-btn");
const explainBtn     = document.getElementById("explain-btn");
const caseScreen     = document.getElementById("case-screen");
const resultScreen   = document.getElementById("result-screen");   // BUG FIX: new
const finalScore     = document.getElementById("final-score");     // BUG FIX: new
const resultMessage  = document.getElementById("result-message");  // BUG FIX: new
const restartBtn     = document.getElementById("restart-btn");     // BUG FIX: new

let currentCaseIndex = 0;
let selectedAnswer   = null;
let shuffledCases    = [];
let score            = 0;   // BUG FIX: was completely absent

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
    title: "High Call Drop at Cell Edge",
    description:
`VoLTE users near the cell edge report frequent call drops.
KPI shows SINR < 0 dB and BLER > 15%.
What is the most probable cause?`,
    options: [
        "Improper Carrier Aggregation config",
        "High inter-cell interference",
        "MME overload",
        "HSS database failure"
    ],
    answer: 1,
    explanation:
`At cell edge, users experience weak signal and interference from neighboring cells.
Low SINR and high BLER indicate interference, not core issues.
Solution: eICIC, power tuning, tilt adjustment, or CoMP.`
},

{
    title: "Attach Failure with S6a Timeout",
    description:
`UEs fail during LTE attach.
Logs show repeated S6a timeout between MME and HSS.`,
    options: [
        "Radio failure",
        "HSS unreachable or Diameter issue",
        "Carrier aggregation misconfiguration",
        "SIM battery failure"
    ],
    answer: 1,
    explanation:
`During attach, MME authenticates UE via HSS using Diameter over S6a.
Timeout indicates HSS unreachable or Diameter routing issue.
Radio layer is not yet involved at this stage.`
},

{
    title: "Good RSRP but Low Throughput",
    description:
`Users report low download speed.
RSRP = -75 dBm (good), SINR = 20 dB (good).
Scheduler utilization 100%.`,
    options: [
        "Core network failure",
        "eNodeB congestion",
        "IMS issue",
        "Security key mismatch"
    ],
    answer: 1,
    explanation:
`Strong RSRP and SINR rule out radio issues.
100% scheduler utilization indicates cell congestion.
Solution: load balancing, adding small cells, or capacity expansion.`
},

{
    title: "VoLTE Falls Back to 3G",
    description:
`During a VoLTE call, the UE hands over to 3G network.
What mechanism is responsible?`,
    options: [
        "SRVCC triggered",
        "Carrier aggregation activated",
        "Paging failure",
        "DRX misconfigured"
    ],
    answer: 0,
    explanation:
`SRVCC (Single Radio Voice Call Continuity) ensures seamless fallback from LTE to 3G when LTE coverage degrades.
This is expected behavior when LTE signal weakens during a VoLTE call.`
},

{
    title: "High Latency Despite Good Radio KPIs",
    description:
`Ping latency ~150 ms.
Radio KPIs normal — RSRP, SINR, and BLER all acceptable.
Where is the bottleneck?`,
    options: [
        "Core routing delay",
        "HARQ failure",
        "Low SINR",
        "DRX cycle too long"
    ],
    answer: 0,
    explanation:
`When radio KPIs are healthy, latency originates from the core or transport path.
Check PGW routing, internet peering points, or backhaul congestion.`
},

{
    title: "Frequent TAU Requests",
    description:
`A UE sends frequent Tracking Area Updates.
No radio issues observed.
What is the likely cause?`,
    options: [
        "Poor RF coverage between TA borders",
        "IMS misconfiguration",
        "Carrier aggregation issue",
        "PCRF error"
    ],
    answer: 0,
    explanation:
`Frequent movement across Tracking Area boundaries triggers repeated TAU signaling.
Optimization may require TA boundary re-planning to reduce overlap.`
},

{
    title: "VoLTE One-Way Audio",
    description:
`A VoLTE call connects successfully.
One party can hear the other but cannot be heard.
What should you check first?`,
    options: [
        "GTP-U tunnel issue",
        "Paging issue",
        "SIM card failure",
        "Carrier aggregation issue"
    ],
    answer: 0,
    explanation:
`One-way audio indicates a user-plane fault, not a signaling fault.
Check GTP-U tunnel continuity between eNodeB and SGW/PGW.
Also verify NAT traversal and media gateway configuration.`
},

{
    title: "High RRC Re-establishment Rate",
    description:
`KPI dashboard shows a spike in RRC re-establishment events.
Core network alarms are normal.`,
    options: [
        "Radio link failure",
        "IMS timeout",
        "Diameter failure",
        "APN misconfiguration"
    ],
    answer: 0,
    explanation:
`RRC re-establishment is triggered by radio link failure.
Likely causes: poor RF coverage, high interference, or coverage gaps in the handover zone.`
},

{
    title: "Packet Fragmentation Observed",
    description:
`TCP sessions show fragmentation.
Some large packets are split unexpectedly.`,
    options: [
        "MTU mismatch",
        "MME overload",
        "RLC AM mode issue",
        "IMS timeout"
    ],
    answer: 0,
    explanation:
`MTU mismatch between PGW and the external network causes large packets to be fragmented.
Fix: align MTU settings at PGW and core routing interfaces.`
},

{
    title: "Poor Uplink Throughput",
    description:
`Uplink throughput is low but downlink is normal.
UE is near the centre of the cell.`,
    options: [
        "Uplink power control issue",
        "Carrier aggregation failure",
        "IMS overload",
        "Paging misconfiguration"
    ],
    answer: 0,
    explanation:
`Uplink degradation with normal downlink often points to UE transmit power control misconfiguration or uplink interference.
Check uplink SINR, power headroom, and PUSCH scheduling.`
},

{
    title: "IMS Registration Failure",
    description:
`VoLTE is not working for a group of users.
Core attach and data services work normally.`,
    options: [
        "SIP signaling issue",
        "HARQ failure",
        "Carrier aggregation issue",
        "RLC retransmission storm"
    ],
    answer: 0,
    explanation:
`IMS registration uses SIP over the IMS APN.
Failure here while data works normally points to SIP signaling or IMS core (P-CSCF/S-CSCF) misconfiguration.`
},

{
    title: "High PRB Utilization",
    description:
`PRB utilization is consistently near 95% during peak hours.
User experience is degraded.`,
    options: [
        "Cell congestion",
        "Diameter failure",
        "TAU signaling storm",
        "HSS overload"
    ],
    answer: 0,
    explanation:
`Near-100% PRB utilization means the radio resource blocks are saturated.
Solutions: add capacity (new carrier), sector split, or deploy small cells.`
},

{
    title: "Dedicated Bearer Not Created",
    description:
`VoLTE call is active.
Signaling shows call setup completed, but no GBR bearer is established.`,
    options: [
        "PCRF policy issue",
        "Carrier aggregation failure",
        "Paging failure",
        "MME restart"
    ],
    answer: 0,
    explanation:
`Dedicated GBR bearers for VoLTE are triggered by PCRF policy via the Gx interface to PGW.
If no dedicated bearer appears, check PCRF reachability and policy rules.`
},

{
    title: "Frequent Handover Failures",
    description:
`HO success rate has dropped below 85% in a cluster of cells.
Network capacity is normal.`,
    options: [
        "Incorrect neighbor list",
        "IMS overload",
        "MTU mismatch",
        "SIM provisioning error"
    ],
    answer: 0,
    explanation:
`Handover execution requires a correctly configured neighbor cell list (ANR).
Missing or outdated neighbors prevent the UE from finding a valid target cell, causing HO failure.`
},

{
    title: "Battery Drain Complaint",
    description:
`Users in a specific area report faster than usual battery drain.
Network KPIs are normal.`,
    options: [
        "DRX misconfiguration",
        "GTP tunnel issue",
        "Carrier aggregation overhead",
        "IMS routing loops"
    ],
    answer: 0,
    explanation:
`DRX (Discontinuous Reception) lets the UE sleep between paging cycles to save power.
Misconfigured DRX parameters reduce sleep time, increasing UE power consumption.`
}

];

// ── INITIALIZATION ───────────────────────────────────────────
shuffledCases = shuffleArray(cases);
loadCase();

// ── LOAD CASE ────────────────────────────────────────────────
function loadCase() {
    selectedAnswer           = null;
    explanationBox.style.display = "none";
    explanationBox.innerHTML = "";

    const current = shuffledCases[currentCaseIndex];

    caseTitle.textContent       = current.title;
    caseDescription.textContent = current.description;
    caseNumber.textContent      = `Scenario ${currentCaseIndex + 1} of ${shuffledCases.length}`;
    scoreDisplay.textContent    = `Score: ${score}`;  // BUG FIX: live score display

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

    // BUG FIX: score increment — was never done
    if (index === correctIndex) {
        score++;
        updateScoreBar();
    }

    scoreDisplay.textContent = `Score: ${score}`;

    optionButtons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correctIndex)           btn.classList.add("correct");
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
// BUG FIX: nextBtn previously had no guard — you could skip all
// scenarios without ever picking an answer.
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
// BUG FIX: was alert("You have completed all 15 scenarios.")
// Replaced with a proper result screen.
function showResults() {
    caseScreen.style.display   = "none";
    resultScreen.style.display = "block";

    finalScore.textContent = `Score: ${score} / ${shuffledCases.length}`;

    const pct = (score / shuffledCases.length) * 100;
    if (pct === 100) {
        resultMessage.textContent = "Perfect score — you're an LTE expert! 🚀";
    } else if (pct >= 80) {
        resultMessage.textContent = "Excellent telecom troubleshooting skills! 💡";
    } else if (pct >= 60) {
        resultMessage.textContent = "Good effort — review the missed scenarios. 📘";
    } else {
        resultMessage.textContent = "Keep studying — LTE troubleshooting takes practice. 📡";
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
