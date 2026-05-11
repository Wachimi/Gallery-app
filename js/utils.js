// =========================================
// UTILS.JS - Funkcje pomocnicze
// =========================================

// Debounce - opóźnienie wyszukiwania
export function debounce(fn, delay = 400) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// Skróć tekst do określonej długości
export function truncate(text, maxLength = 30) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Oblicz wysokość szkieletu (skeleton) na podstawie proporcji
export function calcSkeletonHeight(width, height) {
    const ratio = height / width;
    const displayWidth = 300; // przybliżona szerokość kolumny
    return Math.round(displayWidth * ratio);
}