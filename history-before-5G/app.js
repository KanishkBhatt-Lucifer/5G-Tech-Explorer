/* ============================================================
   History Before 5G — App Logic
   Loads generation data from data/generations.json
   ============================================================ */

/* ── BOOTSTRAP ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

    fetch('generations.json')
        .then(res => res.json())
        .then(generations => {
            buildTimeline(generations);
            initSlider(generations);
            initCardExpansion();
        })
        .catch(err => console.error('Failed to load generations data:', err));
});

/* ── BUILD TIMELINE ─────────────────────────────────────────── */
function buildTimeline(generations) {
    const timeline = document.getElementById('timeline');

    generations.forEach((gen, index) => {

        // Alternate left / right
        const item = document.createElement('div');
        item.className = index % 2 === 0 ? 'timeline-item left' : 'timeline-item right';

        const content = document.createElement('div');
        content.className = 'timeline-content';

        // Tech badges HTML
        const techBadges = gen.tech.map(t => `<span class="tech">${t}</span>`).join('');

        // Details list HTML
        const detailItems = gen.details.map(d => `<li>${d}</li>`).join('');

        content.innerHTML = `
            <h2>${gen.name}</h2>
            <p>${gen.shortDesc}</p>
            <div>${techBadges}</div>

            <div class="expanded-info">
                <h3>Detailed Information</h3>
                <ul>${detailItems}</ul>
                <h2>History</h2>
                <p>${gen.descrip}</p>
                <button onclick="closeCard(event)">Close</button>
            </div>
        `;

        /* BUG FIX: all cards were showing images/1g.jpg because the background
           was hardcoded in CSS. Now set per-card from JSON data. */
        const expandedInfo = content.querySelector('.expanded-info');
        expandedInfo.style.backgroundImage =
            `linear-gradient(rgba(5,140,198,0.8), rgba(0,0,0,0.85)), url("${gen.image}")`;

        item.appendChild(content);
        timeline.appendChild(item);
    });
}

/* ── SLIDER ─────────────────────────────────────────────────── */
function initSlider(generations) {
    const slider = document.getElementById('evolutionSlider');
    const title  = document.getElementById('genTitle');
    const desc   = document.getElementById('genDesc');

    slider.addEventListener('input', function () {
        const gen = generations[this.value - 1];
        title.textContent = gen.name;
        desc.textContent  = gen.shortDesc;
    });
}

/* ── CARD EXPANSION ─────────────────────────────────────────── */
function initCardExpansion() {
    const cards = document.querySelectorAll('.timeline-content');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            // Don't re-open if already active
            if (card.classList.contains('active')) return;

            // Dim all others, activate this one
            cards.forEach(c => {
                if (c !== card) c.classList.add('dimmed');
            });

            card.classList.add('active');
            document.body.classList.add('overlay');
            document.body.style.overflow = 'hidden';
        });
    });
}

/* ── CLOSE CARD ─────────────────────────────────────────────── */
function closeCard(event) {
    event.stopPropagation();

    document.querySelectorAll('.timeline-content').forEach(c => {
        c.classList.remove('active', 'dimmed');
    });

    document.body.classList.remove('overlay');
    document.body.style.overflow = 'auto';
}

/* ── KEYBOARD: Escape to close ──────────────────────────────── */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCard(new Event('click'));
});
