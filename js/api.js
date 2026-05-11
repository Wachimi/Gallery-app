// =========================================
// API.JS - Pexels API
// =========================================

import { PEXELS_API_KEY } from '../config.js';

const BASE_URL = 'https://api.pexels.com/v1';

// Nagłówki do każdego zapytania
const headers = {
    Authorization: PEXELS_API_KEY
};

async function requestPexels(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, { headers });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Nieprawidłowy klucz API. Sprawdź plik config.js');
            }

            throw new Error(`Błąd API: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                'Nie udało się połączyć z Pexels. Sprawdź internet, blokady przeglądarki i czy strona jest uruchomiona przez lokalny serwer, a nie jako plik file://.'
            );
        }

        throw error;
    }
}

// Pobierz popularne zdjęcia
export async function fetchPopular(page = 1, perPage = 20) {
    return requestPexels(`/curated?page=${page}&per_page=${perPage}`);
}

// Szukaj zdjęć
export async function searchPhotos(query, page = 1, perPage = 20) {
    const params = new URLSearchParams({ query, page, per_page: perPage });
    return requestPexels(`/search?${params}`);
}
