/* ============================================================
   About 5G — App Logic
   Loads all content from data/data.json
   ============================================================ */

/* ── BOOTSTRAP ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            renderFeatures(data.features);
            renderFivegSystem(data.fivegsystem);
            renderComparison(data.comparison);
            renderCapabilities(data.capabilities);
            renderBenefits(data.benefits);
            renderApplications(data.applications);
            initTableInteractions();
            initScrollAnimations();
        })
        .catch(err => console.error('Failed to load 5G data:', err));
});

/* ── RENDER: Feature Cards ──────────────────────────────────── */
function renderFeatures(features) {
    const container = document.getElementById('features-grid');
    if (!container) return;

    container.innerHTML = features.map(f => `
        <div class="info-card">
            <h3><i class="fas ${f.icon}"></i> ${f.title}</h3>
            <p>${f.content}</p>
            <ul>
                ${f.points.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

/* ── RENDER: 5G System Cards ────────────────────────────────── */
function renderFivegSystem(sections) {
    const container = document.getElementById('fivegsystem-grid');
    if (!container) return;

    container.innerHTML = sections.map(s => `
        <div class="info-card">
            <h3><i class="fas ${s.icon}"></i> ${s.title}</h3>
            <p>${s.content}</p>
            <img src="${s.image}" alt="${s.title}" class="fivegsystem-img">
        </div>
    `).join('');
}

/* ── RENDER: Comparison Table ───────────────────────────────── */
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
                    <tr class="${gen.name === '5G' ? 'highlighted' : ''}"
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

/* ── RENDER: Capabilities Table ─────────────────────────────── */
/* BUG FIX: data row was using <th> instead of <td>, causing wrong styling */
function renderCapabilities(capabilities) {
    const container = document.getElementById('capabilities-table');
    if (!container) return;

    container.innerHTML = `
        <table class="capabilities-table">
            <thead>
                <tr>
                    ${capabilities.map(c => `<th>${c.label}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    ${capabilities.map(c => `<td>${c.value}</td>`).join('')}
                </tr>
            </tbody>
        </table>
    `;
}

/* ── RENDER: Benefits List ──────────────────────────────────── */
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

/* ── RENDER: Applications Grid ──────────────────────────────── */
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
/* BUG FIX: capabilities table click handler was accidentally using
   comparisonTable's NodeList (table1Rows defined but never used).
   Now each table has its own correct handler. */
function initTableInteractions() {

    // Comparison table — click to highlight row
    const compRows = document.querySelectorAll('.comparison-table tbody tr');
    compRows.forEach(row => {
        row.addEventListener('click', function () {
            compRows.forEach(r => r.classList.remove('highlighted'));
            this.classList.add('highlighted');
        });
    });

    // Card click ripple effect
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('click', function () {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => { this.style.transform = ''; }, 200);
        });
    });
}

/* ── SCROLL ANIMATIONS ──────────────────────────────────────── */
/* BUG FIX: content-grid and fivegsystem-grid observer blocks were identical —
   merged into one handler */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');

            // Stagger-animate info-cards inside grids
            if (
                entry.target.classList.contains('content-grid') ||
                entry.target.id === 'fivegsystem-grid'
            ) {
                entry.target.querySelectorAll('.info-card').forEach((card, i) => {
                    setTimeout(() => card.classList.add('visible'), i * 100);
                });
            }

            // Animate comparison table
            if (entry.target.id === 'comparison') {
                const table = entry.target.querySelector('.comparison-table');
                if (table) setTimeout(() => table.classList.add('visible'), 300);
            }

            // Animate capabilities table
            if (entry.target.id === 'capabilities') {
                const table = entry.target.querySelector('.capabilities-table');
                if (table) setTimeout(() => table.classList.add('visible'), 300);
            }

            // Animate benefit items
            if (entry.target.id === 'benefits') {
                entry.target.querySelectorAll('.benefit-item').forEach((item, i) => {
                    setTimeout(() => item.classList.add('visible'), i * 100);
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe sections and individual animated elements
    document.querySelectorAll(
        '.section, .info-card, .comparison-table, .capabilities-table, .benefit-item'
    ).forEach(el => observer.observe(el));
}
