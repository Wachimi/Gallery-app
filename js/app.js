// =========================================
// APP.JS - Logika galerii
// =========================================

import { fetchPopular, searchPhotos } from './api.js';
import {
    CATEGORIES,
    renderFilters,
    renderSkeletons,
    renderPhotos,
    updateResultsInfo,
    showState,
    showError,
    showLoadMore,
    openModal,
    closeModal
} from './ui.js';
import { debounce } from './utils.js';

// =========================================
// STAN APLIKACJI
// =========================================

const state = {
    photos: [],
    currentQuery: '',
    currentCategory: 'popular',
    currentPage: 1,
    totalResults: 0,
    isLoading: false,
    perPage: 20
};

// =========================================
// INICJALIZACJA
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    renderFilters('popular', handleFilterChange);
    initEventListeners();
    loadPhotos();
    console.log('🖼️ Gallery App załadowana!');
});

// =========================================
// EVENT LISTENERS
// =========================================

function initEventListeners() {

    // Wyszukiwarka
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener(
        'keypress',
        (e) => { if (e.key === 'Enter') handleSearch(); }
    );
    document.getElementById('searchInput').addEventListener(
        'input',
        debounce((e) => {
            if (e.target.value === '') {
                state.currentQuery = '';
                state.currentCategory = 'popular';
                renderFilters('popular', handleFilterChange);
                loadPhotos();
            }
        }, 500)
    );

    // Kliknięcie w zdjęcie (delegacja eventów)
    document.getElementById('galleryGrid').addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action="view"]');
        const photoItem = e.target.closest('.photo-item');

        if (actionBtn) {
            e.stopPropagation();
            const photoId = parseInt(actionBtn.dataset.id);
            openPhotoModal(photoId);
            return;
        }

        if (photoItem) {
            const photoId = parseInt(photoItem.dataset.id);
            openPhotoModal(photoId);
        }
    });

    // Załaduj więcej
    document.getElementById('loadMoreBtn').addEventListener('click', loadMore);

    // Retry
    document.getElementById('retryBtn').addEventListener('click', () => loadPhotos());

    // Modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', closeModal);
    document.getElementById('modalPrev').addEventListener('click', () => navigateModal(-1));
    document.getElementById('modalNext').addEventListener('click', () => navigateModal(1));

    // Klawiatura
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('modal').classList.contains('hidden')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigateModal(-1);
        if (e.key === 'ArrowRight') navigateModal(1);
    });
}

// =========================================
// ŁADOWANIE ZDJĘĆ
// =========================================

async function loadPhotos(append = false) {
    if (state.isLoading) return;
    state.isLoading = true;

    if (!append) {
        renderSkeletons();
        showState(null);
        showLoadMore(false);
    }

    try {
        let data;

        if (state.currentQuery) {
            data = await searchPhotos(state.currentQuery, state.currentPage, state.perPage);
        } else {
            data = await fetchPopular(state.currentPage, state.perPage);
        }

        const photos = data.photos;
        state.totalResults = data.total_results || photos.length;

        if (!photos.length && !append) {
            showState('emptyState');
            showLoadMore(false);
            return;
        }

        if (append) {
            state.photos = [...state.photos, ...photos];
        } else {
            state.photos = photos;
        }

        renderPhotos(photos, append);
        updateResultsInfo(state.totalResults, state.currentQuery);

        // Pokaż "Załaduj więcej" jeśli jest co ładować
        const hasMore = state.photos.length < state.totalResults;
        showLoadMore(hasMore);

    } catch (error) {
        console.error('Błąd:', error);

        if (!append) {
            showError('Błąd ładowania', error.message);
        }
    } finally {
        state.isLoading = false;
    }
}

// =========================================
// WYSZUKIWANIE I FILTRY
// =========================================

function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    state.currentQuery = query;
    state.currentCategory = null;
    state.currentPage = 1;
    state.photos = [];

    // Usuń aktywny filtr
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));

    loadPhotos();
}

function handleFilterChange(categoryId, query) {
    state.currentCategory = categoryId;
    state.currentQuery = query;
    state.currentPage = 1;
    state.photos = [];

    // Wyczyść wyszukiwarkę
    document.getElementById('searchInput').value = '';

    loadPhotos();
}

// =========================================
// ZAŁADUJ WIĘCEJ
// =========================================

function loadMore() {
    state.currentPage++;
    loadPhotos(true);
}

// =========================================
// MODAL
// =========================================

let currentModalIndex = 0;

function openPhotoModal(photoId) {
    const index = state.photos.findIndex(p => p.id === photoId);
    if (index === -1) return;

    currentModalIndex = index;
    openModal(state.photos[index], index, state.photos.length);
}

function navigateModal(direction) {
    const newIndex = currentModalIndex + direction;

    if (newIndex < 0 || newIndex >= state.photos.length) return;

    currentModalIndex = newIndex;
    openModal(state.photos[currentModalIndex], currentModalIndex, state.photos.length);
}