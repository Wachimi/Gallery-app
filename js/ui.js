// =========================================
// UI.JS - Renderowanie galerii i modala
// =========================================

import { truncate } from './utils.js';

// ===== KATEGORIE/FILTRY =====

export const CATEGORIES = [
    { id: 'popular', label: '🔥 Popularne', query: '' },
    { id: 'nature', label: '🌿 Natura', query: 'nature' },
    { id: 'city', label: '🏙️ Miasto', query: 'city' },
    { id: 'animals', label: '🐾 Zwierzęta', query: 'animals' },
    { id: 'food', label: '🍕 Jedzenie', query: 'food' },
    { id: 'travel', label: '✈️ Podróże', query: 'travel' },
    { id: 'architecture', label: '🏛️ Architektura', query: 'architecture' },
    { id: 'technology', label: '💻 Technologia', query: 'technology' },
];

export function renderFilters(activeId, onFilterClick) {
    const container = document.getElementById('filters');
    container.innerHTML = CATEGORIES.map(cat => `
        <button
            class="filter-btn ${cat.id === activeId ? 'active' : ''}"
            data-id="${cat.id}"
            data-query="${cat.query}"
        >
            ${cat.label}
        </button>
    `).join('');

    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        onFilterClick(btn.dataset.id, btn.dataset.query);
    });
}

// ===== STANY =====

export function showState(name) {
    ['loadingState', 'emptyState', 'errorState'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });

    if (name) document.getElementById(name).classList.remove('hidden');
}

export function showError(title, message) {
    document.getElementById('errorTitle').textContent = title;
    document.getElementById('errorMsg').textContent = message;
    showState('errorState');
}

// ===== SZKIELETY (skeleton loading) =====

export function renderSkeletons(count = 12) {
    const grid = document.getElementById('galleryGrid');
    const heights = [250, 320, 200, 380, 280, 350, 220, 300, 260, 400, 240, 310];

    grid.innerHTML = Array.from({ length: count }, (_, i) => `
        <div class="skeleton" style="height: ${heights[i % heights.length]}px;"></div>
    `).join('');
}

// ===== ZDJĘCIA =====

export function renderPhotos(photos, append = false) {
    const grid = document.getElementById('galleryGrid');

    const html = photos.map(photo => `
        <div class="photo-item" data-id="${photo.id}">
            <img
                src="${photo.src.large}"
                alt="${photo.alt || 'Zdjęcie'}"
                loading="lazy"
            >
            <div class="photo-overlay">
                <div class="photo-photographer">
                    📷 ${truncate(photo.photographer, 25)}
                </div>
                <div class="photo-actions">
                    <button class="photo-action-btn" data-action="view" data-id="${photo.id}">
                        🔍 Powiększ
                    </button>
                    <a
                        class="photo-action-btn"
                        href="${photo.src.original}"
                        download
                        target="_blank"
                        onclick="event.stopPropagation()"
                    >
                        ⬇️ Pobierz
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    if (append) {
        grid.insertAdjacentHTML('beforeend', html);
    } else {
        grid.innerHTML = html;
    }
}

// ===== RESULTS INFO =====

export function updateResultsInfo(total, query) {
    document.getElementById('resultsInfo').textContent =
        `${total.toLocaleString('pl-PL')} zdjęć`;

    const queryEl = document.getElementById('currentQuery');
    if (query) {
        queryEl.textContent = `„${query}"`;
        queryEl.classList.remove('hidden');
    } else {
        queryEl.textContent = '';
        queryEl.classList.add('hidden');
    }
}

// ===== LOAD MORE BUTTON =====

export function showLoadMore(show) {
    document.getElementById('loadMoreWrapper').style.display = show ? 'block' : 'none';
}

// ===== MODAL =====

export function openModal(photo, index, total) {
    const modal = document.getElementById('modal');
    const img = document.getElementById('modalImg');
    const loader = document.getElementById('modalLoader');

    // Pokaż loader
    loader.classList.remove('hidden');
    img.style.opacity = '0';

    // Ustaw dane
    document.getElementById('modalPhotographer').innerHTML =
        `📷 Zdjęcie: <span>${photo.photographer}</span>`;
    document.getElementById('modalDownload').href = photo.src.original;
    document.getElementById('modalPexels').href = photo.url;
    document.getElementById('modalCounter').textContent =
        `${index + 1} / ${total}`;

    // Załaduj zdjęcie
    img.onload = () => {
        loader.classList.add('hidden');
        img.style.opacity = '1';
        img.style.transition = 'opacity 0.3s';
    };
    img.src = photo.src.large;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.body.style.overflow = '';
}
