/* ============================================================
   5G NR Architecture Puzzle — Logic
   Exact structural replica of the LTE Puzzle JS engine.
   Data-driven: loads all diagram content from puzzle-data.json.
   ============================================================ */

let labels       = [];
let dropZones    = [];
let correctCount = 0;

/* ── BOOTSTRAP ─────────────────────────────────────────────── */
fetch('puzzle-data.json')
    .then(res => res.json())
    .then(data => {
        labels    = data.labels;
        dropZones = data.dropZones;
        buildDiagram(data);
        init();
    })
    .catch(err => {
        console.error('Failed to load puzzle data:', err);
    });

/* ── BUILD STATIC DIAGRAM ELEMENTS FROM JSON ──────────────── */
function buildDiagram(data) {
    const wrapper = document.querySelector('.arch-wrapper');

    // Interface labels
    data.interfaceLabels.forEach(item => {
        const el = document.createElement('div');
        el.className = 'interface';
        el.setAttribute('style', item.style);
        el.textContent = item.text;
        wrapper.appendChild(el);
    });

    // Arrows and SBA bus line
    data.arrows.forEach(item => {
        const el = document.createElement('div');
        el.className = item.type;
        el.setAttribute('style', item.style);
        wrapper.appendChild(el);
    });
}

/* ── SHUFFLE (Fisher-Yates) ─────────────────────────────────── */
function shuffle(arr) {
    let a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* ── INIT ───────────────────────────────────────────────────── */
function init() {
    correctCount = 0;
    updateProgress();

    document.getElementById('message').style.display = 'none';
    document.getElementById('packet').style.display  = 'none';

    buildDragTray();
    resetDropZones();
}

/* ── BUILD DRAG TRAY ────────────────────────────────────────── */
function buildDragTray() {
    const container = document.getElementById('dragContainer');
    container.innerHTML = '';

    shuffle(labels).forEach(item => {
        const div = document.createElement('div');
        div.className    = 'drag-item';
        div.innerText    = item.text;
        div.draggable    = true;
        div.dataset.slot = item.slot;

        div.addEventListener('dragstart', e => {
            e.dataTransfer.setData('slot', div.dataset.slot);
            e.dataTransfer.setData('text', div.innerText);
        });

        container.appendChild(div);
    });
}

/* ── RESET DROP ZONES ───────────────────────────────────────── */
function resetDropZones() {
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML      = '';
        zone.dataset.filled = 'false';
        zone.classList.remove('correct', 'drag-over');

        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            if (zone.dataset.filled === 'true') return;

            const draggedSlot = e.dataTransfer.getData('slot');
            const draggedText = e.dataTransfer.getData('text');

            const isCorrect =
                draggedText === zone.dataset.answer &&
                draggedSlot === zone.dataset.slot;

            if (isCorrect) {
                zone.innerText      = draggedText;
                zone.dataset.filled = 'true';
                zone.classList.add('correct');

                const draggedEl = document.querySelector(
                    `.drag-item[data-slot="${draggedSlot}"]`
                );
                if (draggedEl) draggedEl.remove();

                correctCount++;
                updateProgress();

                if (correctCount === labels.length) {
                    animatePacket();
                }
            }
        });
    });
}

/* ── PROGRESS BAR ───────────────────────────────────────────── */
function updateProgress() {
    const pct = (correctCount / labels.length) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-label').textContent =
        `${correctCount} / ${labels.length} placed correctly`;
}

/* ── PACKET ANIMATION ───────────────────────────────────────── */
function animatePacket() {
    const packet = document.getElementById('packet');
    packet.style.display = 'block';
    packet.style.left    = '50px';
    let pos = 50;

    const interval = setInterval(() => {
        pos += 6;
        packet.style.left = pos + 'px';
        if (pos > 1080) {
            clearInterval(interval);
            packet.style.display = 'none';
            document.getElementById('message').style.display = 'block';
        }
    }, 20);
}

/* ── RESET BUTTON ───────────────────────────────────────────── */
function resetGame() {
    document.getElementById('packet').style.display  = 'none';
    document.getElementById('message').style.display = 'none';
    init();
}
