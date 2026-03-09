/* ============================================================
   About 4G — App Logic
   Loads all content from data/data.json
   ============================================================ */

/* ── BOOTSTRAP ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            renderCards('features-grid',      data.epcComponents,      'info-card');
            renderCards('lteairinterface-grid',data.lteAirInterface,   'info-card');
            renderCards('roadto5g-grid',       data.roadTo5g,          'info-card');
            renderCards('carrieraggre-grid',   data.carrierAggregation,'info-card');
            renderCards('lteevolution-grid',   data.lteEvolution,      'info-card1');
            renderComparison(data.comparison);
            renderBenefits(data.benefits);
            renderApplications(data.applications);
            initTableInteractions();
            initScrollAnimations();
        })
        .catch(err => console.error('Failed to load 4G data:', err));
});

/* ── GENERIC CARD RENDERER ──────────────────────────────────── */
/* BUG FIX: renderFeatures, renderlteairinterface, renderroadto5g,
   rendercarrieraggre were all identical functions — merged into one */
function renderCards(containerId, items, cardClass) {
    const container = document.getElementById(containerId);
    if (!container) return;

    /* lteEvolution uses content1 field; all others use content */
    container.innerHTML = items.map(item => `
        <div class="${cardClass}">
            <h3><i class="fas ${item.icon}"></i> ${item.title}</h3>
            <p>${item.content ?? item.content1 ?? ''}</p>
            ${item.points && item.points.length ? `
            <ul>
                ${item.points.map(p => `<li>${p}</li>`).join('')}
            </ul>` : ''}
        </div>
    `).join('');
}

/* ── COMPARISON TABLE ───────────────────────────────────────── */
function renderComparison(generations) {
    const container = document.getElementById('comparison-table');
    if (!container) return;

    container.innerHTML = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>Generation</th>
                    <th>Max Speed</th>
                    <th>Latency</th>
                    <th>Key Features</th>
                    <th>Launch Year</th>
                </tr>
            </thead>
            <tbody>
                ${generations.map(gen => `
                    <tr class="${gen.name === '4G' ? 'highlighted' : ''}"
                        data-gen="${gen.name}">
                        <td><strong>${gen.name}</strong></td>
                        <td>${gen.speed}</td>
                        <td>${gen.latency}</td>
                        <td>${gen.keyFeature}</td>
                        <td>${gen.year}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/* ── BENEFITS LIST ──────────────────────────────────────────── */
function renderBenefits(benefits) {
    const container = document.getElementById('benefits-list');
    if (!container) return;

    container.innerHTML = benefits.map((b, i) => `
        <li class="benefit-item" style="transition-delay: ${i * 0.1}s">
            <i class="fas ${b.icon}"></i>
            <div>
                <h3>${b.title}</h3>
                <p>${b.description}</p>
            </div>
        </li>
    `).join('');
}

/* ── APPLICATIONS GRID ──────────────────────────────────────── */
function renderApplications(applications) {
    const container = document.getElementById('applications-grid');
    if (!container) return;

    container.innerHTML = applications.map(a => `
        <div class="info-card">
            <h3><i class="fas ${a.icon}"></i> ${a.name}</h3>
            <p>${a.description}</p>
            <ul>
                ${a.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

/* ── TABLE INTERACTIONS ─────────────────────────────────────── */
/* BUG FIX: initInteractiveElements had the card click handler duplicated
   (infoCards and infoCards1 were identical blocks) — removed duplicate */
function initTableInteractions() {
    const compRows = document.querySelectorAll('.comparison-table tbody tr');
    compRows.forEach(row => {
        row.addEventListener('click', function () {
            compRows.forEach(r => r.classList.remove('highlighted'));
            this.classList.add('highlighted');
        });
    });

    document.querySelectorAll('.info-card, .info-card1').forEach(card => {
        card.addEventListener('click', function () {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => { this.style.transform = ''; }, 200);
        });
    });
}

/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
/* BUG FIX: content-grid and content1-grid observer blocks were identical —
   merged into one handler */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');

            // Stagger cards inside any grid
            if (
                entry.target.classList.contains('content-grid') ||
                entry.target.classList.contains('content1-grid')
            ) {
                entry.target.querySelectorAll('.info-card, .info-card1').forEach((card, i) => {
                    setTimeout(() => card.classList.add('visible'), i * 100);
                });
            }

            // Comparison table
            if (entry.target.id === 'comparison') {
                const table = entry.target.querySelector('.comparison-table');
                if (table) setTimeout(() => table.classList.add('visible'), 300);
            }

            // Benefits
            if (entry.target.id === 'benefits') {
                entry.target.querySelectorAll('.benefit-item').forEach((item, i) => {
                    setTimeout(() => item.classList.add('visible'), i * 100);
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(
        '.section, .info-card, .info-card1, .comparison-table, .benefit-item'
    ).forEach(el => observer.observe(el));
}
