document.addEventListener('DOMContentLoaded', () => {
    // UI State Containers
    const loadingState = document.getElementById('state-loading');
    const errorState = document.getElementById('state-error');
    const successState = document.getElementById('state-success');

    const charactersGrid = document.getElementById('characters-grid');
    const retryBtn = document.getElementById('retry-btn');
    const errorMessageEl = document.getElementById('error-message');

    // API Endpoint for the SOA Backend (Now movies)
    const API_URL = '/api/movies';

    /**
     * Helper to manage which UI state to show
     * @param {'loading' | 'success' | 'error'} stateName 
     */
    const showState = (stateName) => {
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        successState.classList.add('hidden');

        if (stateName === 'loading') loadingState.classList.remove('hidden');
        if (stateName === 'error') errorState.classList.remove('hidden');
        if (stateName === 'success') {
            successState.classList.remove('hidden');
        }
    };

    /**
     * Builds a single card HTML snippet for a Movie
     */
    const createCardHTML = (movie, index) => {
        const title = movie.title || 'Título Desconocido';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        // Build the image path using TMDB standard base url
        const image = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : `https://via.placeholder.com/500x750?text=Sin+Imagen`;

        return `
            <div class="character-card" style="animation-delay: ${index * 0.05}s">
                <div class="card-image-wrapper">
                    <img src="${image}" alt="${title}" class="card-image tmdb-poster" loading="lazy" />
                    <div class="rating-badge">⭐ ${rating}</div>
                </div>
                <div class="card-content">
                    <h2 class="card-title">${title}</h2>
                </div>
            </div>
        `;
    };

    /**
     * Fetches Movies from our SOA Backend
     */
    const loadData = async () => {
        showState('loading');
        charactersGrid.innerHTML = '';

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success || !Array.isArray(data.data)) {
                throw new Error('Invalid data format received from the backend service.');
            }

            const movies = data.data;

            if (movies.length === 0) {
                throw new Error('No se encontraron películas.');
            }

            const cardsHTML = movies.map((movie, i) => createCardHTML(movie, i)).join('');

            charactersGrid.innerHTML = cardsHTML;
            showState('success');

        } catch (error) {
            console.error('[Frontend Error]:', error);
            errorMessageEl.textContent = error.message;
            showState('error');
        }
    };

    // Initialization
    loadData();

    // Event Listeners
    retryBtn.addEventListener('click', loadData);
});
