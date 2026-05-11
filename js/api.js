// =========================================
// API.JS - Pexels API
// =========================================

import { PEXELS_API_KEY } from '../config.js';

const BASE_URL = 'https://api.pexels.com/v1';

// Nagłówki do każdego zapytania
const headers = {
    Authorization: PEXELS_API_KEY
};

// Pobierz popularne zdjęcia
export async function fetchPopular(page = 1, perPage = 20) {
    const response = await fetch(
        `${BASE_URL}/curated?page=${page}&per_page=${perPage}`,
        { headers }
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Nieprawidłowy klucz API. Sprawdź plik config.js');
        }
        throw new Error(`Błąd API: ${response.status}`);
    }

    return await response.json();
}

// Szukaj zdjęć
export async function searchPhotos(query, page = 1, perPage = 20) {
    const params = new URLSearchParams({ query, page, per_page: perPage });
    const response = await fetch(
        `${BASE_URL}/search?${params}`,
        { headers }
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Nieprawidłowy klucz API. Sprawdź plik config.js');
        }
        throw new Error(`Błąd API: ${response.status}`);
    }

    return await response.json();
}