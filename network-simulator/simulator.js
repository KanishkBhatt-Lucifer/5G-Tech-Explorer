// ============================================================
// 5G Network Simulators — Engine
//
// Loads all simulation data from simulator-data.json.
// Node colour keys (e.g. "ue", "ran") stored in JSON are
// resolved to colour objects via the C palette below.
// ============================================================

const STAGE_H = 320;
const NODE_H  = 70;
const NODE_Y  = (STAGE_H - NODE_H) / 2;   // 125px — vertically centred
const LINE_Y  = NODE_Y + NODE_H / 2;       // 160px — line through node centre

/* ── NODE COLOUR PALETTE ────────────────────────────────────
   Keys match the "col" string values in simulator-data.json  */
const C = {
    ue:   { bg: "rgba(100,30,180,0.28)",  bd: "#a050ff" },
    ran:  { bg: "rgba(0,90,170,0.28)",    bd: "#00bfff" },
    core: { bg: "rgba(10,70,150,0.22)",   bd: "#1e90ff" },
    upf:  { bg: "rgba(0,110,100,0.28)",   bd: "#00d4aa" },
    ims:  { bg: "rgba(160,20,90,0.28)",   bd: "#e84393" },
    dn:   { bg: "rgba(15,80,220,0.28)",   bd: "#4488ff" }
};

/* ── STATE ─────────────────────────────────────────────────── */
let SIMS           = null;   // populated after JSON fetch
let currentSimKey  = null;
let currentStepIdx = -1;
let animating      = false;
let autoRunning    = false;
let animGen        = 0;      // incremented on reset to cancel in-flight animations

/* ── BOOTSTRAP — fetch data then wire up ───────────────────── */
fetch('simulator-data.json')
    .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(data => {
        // Resolve colour key strings → colour objects on every node
        Object.values(data).forEach(sim => {
            sim.nodes.forEach(node => {
                node.col = C[node.col] || C.core;
            });
        });
        SIMS = data;
    })
    .catch(err => {
        console.error('Failed to load simulator-data.json:', err);
        document.getElementById('placeholder').textContent =
            '⚠ Could not load simulator-data.json — make sure all four files are in the same folder.';
    });

/* ── LOAD SIMULATION ────────────────────────────────────────── */
function loadSim(key) {
    if (!SIMS) return;
    if (animating) { animGen++; animating = false; }
    autoRunning    = false;
    currentSimKey  = key;
    currentStepIdx = -1;

    // Tab highlight
    document.querySelectorAll('.sim-tab').forEach(b =>
        b.classList.toggle('active', b.dataset.sim === key));

    const sim   = SIMS[key];
    const stage = document.getElementById('stage');
    const svg   = document.getElementById('connSvg');

    // Clear previous nodes
    stage.querySelectorAll('.sim-node').forEach(el => el.remove());

    // Clear SVG children except <defs>
    Array.from(svg.children).forEach(c => { if (c.tagName !== 'defs') c.remove(); });

    document.getElementById('placeholder').style.display = 'none';

    // ── Render nodes ──────────────────────────────────────────
    sim.nodes.forEach((n, i) => {
        const el = document.createElement('div');
        el.className = 'sim-node';
        el.id = 'nd-' + n.id;
        Object.assign(el.style, {
            left:      sim.xPos[i] + 'px',
            top:       NODE_Y + 'px',
            width:     sim.nodeW + 'px',
            background: n.col.bg,
            border:    '2px solid ' + n.col.bd,
            boxShadow: '0 0 10px ' + n.col.bd + '44',
            color:     'white'
        });
        el.innerHTML = n.label + (n.sub ? `<div class="node-sub">${n.sub}</div>` : '');
        stage.appendChild(el);
    });

    // ── Render connector lines & interface labels ─────────────
    sim.lineMap.forEach(([fi, ti], li) => {
        const x1 = sim.xPos[fi] + sim.nodeW;
        const x2 = sim.xPos[ti];
        const y  = LINE_Y;

        const line = document.createElementNS(svg.namespaceURI, 'line');
        line.setAttribute('id',         'sl-' + li);
        line.setAttribute('x1', x1);    line.setAttribute('y1', y);
        line.setAttribute('x2', x2);    line.setAttribute('y2', y);
        line.setAttribute('class',      'conn');
        line.setAttribute('marker-end', 'url(#arrBlue)');
        svg.appendChild(line);

        // Interface label centred above the line
        const midX = (x1 + x2) / 2;
        const txt = document.createElementNS(svg.namespaceURI, 'text');
        txt.setAttribute('x',            midX);
        txt.setAttribute('y',            LINE_Y - 9);
        txt.setAttribute('class',        'iface-txt');
        txt.setAttribute('text-anchor',  'middle');
        txt.textContent = sim.ifaceNames[li] || '';
        svg.appendChild(txt);
    });

    // ── Description panel ─────────────────────────────────────
    setDesc(sim.name, null, sim.intro, -1, sim.steps.length);
    buildDots(sim.steps.length);

    document.getElementById('btnPlay').disabled = false;
    document.getElementById('btnStep').disabled = false;
}

/* ── DESCRIPTION HELPERS ────────────────────────────────────── */
function setDesc(title, iface, text, stepIdx, total) {
    document.getElementById('descTitle').textContent = title;

    const ifEl = document.getElementById('descIface');
    if (iface) {
        ifEl.textContent    = iface;
        ifEl.style.display  = 'inline-block';
    } else {
        ifEl.style.display  = 'none';
    }

    document.getElementById('descText').textContent = text;
    updateDots(stepIdx, total);
}

function buildDots(total) {
    const c = document.getElementById('descCounter');
    c.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const d = document.createElement('div');
        d.className = 'step-dot';
        d.id        = 'dot-' + i;
        c.appendChild(d);
    }
}

function updateDots(stepIdx, total) {
    for (let i = 0; i < total; i++) {
        const d = document.getElementById('dot-' + i);
        if (!d) continue;
        d.className = 'step-dot'
            + (i < stepIdx   ? ' done'    : '')
            + (i === stepIdx ? ' current' : '');
    }
}

/* ── PACKET ANIMATION ───────────────────────────────────────── */
function animatePacket(step, sim, gen, onDone) {
    const svg  = document.getElementById('connSvg');
    const line = document.getElementById('sl-' + step.li);
    if (!line) { animating = false; if (onDone) onDone(); return; }

    const length = line.getTotalLength();

    // Packet circle
    const pkt = document.createElementNS(svg.namespaceURI, 'circle');
    pkt.setAttribute('r',    7);
    pkt.setAttribute('fill', step.color);
    pkt.style.filter = `drop-shadow(0 0 7px ${step.color})`;
    svg.appendChild(pkt);

    // Floating label above packet
    const lbl = document.createElementNS(svg.namespaceURI, 'text');
    lbl.setAttribute('class', 'pkt-label');
    lbl.textContent = step.pkt;
    svg.appendChild(lbl);

    // Source / destination node elements
    const pair  = sim.lineMap[step.li];
    const srcId = sim.nodes[pair[step.rev ? 1 : 0]].id;
    const dstId = sim.nodes[pair[step.rev ? 0 : 1]].id;
    const srcEl = document.getElementById('nd-' + srcId);
    const dstEl = document.getElementById('nd-' + dstId);
    if (srcEl) srcEl.classList.add('node-active');

    let progress = 0;
    const speed  = 0.5;

    function move() {
        if (gen !== animGen) {
            // Cancelled by reset — clean up immediately
            pkt.remove(); lbl.remove();
            if (srcEl) srcEl.classList.remove('node-active');
            return;
        }

        progress += speed;
        const t  = Math.min(1, step.rev ? 1 - progress / 100 : progress / 100);
        const pt = line.getPointAtLength(t * length);

        pkt.setAttribute('cx', pt.x);
        pkt.setAttribute('cy', pt.y);
        lbl.setAttribute('x',  pt.x);
        lbl.setAttribute('y',  pt.y - 14);

        if (progress < 100) {
            requestAnimationFrame(move);
        } else {
            pkt.remove(); lbl.remove();
            if (srcEl) srcEl.classList.remove('node-active');
            // Pulse destination green on arrival
            if (dstEl) {
                dstEl.classList.add('node-pulse');
                setTimeout(() => dstEl.classList.remove('node-pulse'), 700);
            }
            animating = false;
            if (onDone) onDone();
        }
    }

    requestAnimationFrame(move);
}

/* ── STEP FORWARD ───────────────────────────────────────────── */
function stepForward() {
    if (animating || !currentSimKey) return;

    const sim = SIMS[currentSimKey];
    currentStepIdx++;

    if (currentStepIdx >= sim.steps.length) {
        completeSimulation(sim);
        return;
    }

    const step = sim.steps[currentStepIdx];
    const gen  = animGen;
    animating  = true;

    setDesc(
        `Step ${currentStepIdx + 1} / ${sim.steps.length}  —  ${step.title}`,
        step.iface,
        step.desc,
        currentStepIdx,
        sim.steps.length
    );

    animatePacket(step, sim, gen, () => {
        if (autoRunning && gen === animGen) {
            setTimeout(stepForward, 480);
        }
    });
}

/* ── AUTO PLAY ──────────────────────────────────────────────── */
function autoPlay() {
    if (animating || !currentSimKey) return;
    autoRunning = true;
    stepForward();
}

/* ── COMPLETION ─────────────────────────────────────────────── */
function completeSimulation(sim) {
    autoRunning = false;
    document.getElementById('btnPlay').disabled = true;
    document.getElementById('btnStep').disabled = true;

    setDesc(
        `✅  ${sim.name} — Complete`,
        null,
        `All ${sim.steps.length} steps completed successfully. Click Reset to replay, or choose another simulation.`,
        sim.steps.length,
        sim.steps.length
    );

    // Ripple-pulse every node in sequence
    sim.nodes.forEach((n, i) => {
        setTimeout(() => {
            const el = document.getElementById('nd-' + n.id);
            if (!el) return;
            el.classList.add('node-pulse');
            setTimeout(() => el.classList.remove('node-pulse'), 750);
        }, i * 130);
    });
}

/* ── RESET ──────────────────────────────────────────────────── */
function resetSim() {
    animGen++;               // cancels any in-flight animation immediately
    animating   = false;
    autoRunning = false;
    if (currentSimKey) loadSim(currentSimKey);
}
