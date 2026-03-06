const axios = require('axios');

/**
 * Service to handle communication with the third-party TMDB API.
 * This completely decouples the external API logic from our controllers.
 */
const fetchPopularMovies = async () => {
    // Zero-Hardcoding approach: Get values from environment variables
    const baseUrl = process.env.TMDB_API_URL;
    const token = process.env.TMDB_API_TOKEN;

    if (!baseUrl || !token) {
        throw new Error('Server configuration error: TMDB_API_URL or TMDB_API_TOKEN is not defined in the environment.');
    }

    const endpoint = `${baseUrl}movie/popular?language=es-MX&page=1`;

    try {
        console.log(`[Service]: Fetching popular movies from TMDB...`);

        // Execute the GET request with the Bearer Authorization Header
        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Return only the relevant data array (TMDB returns data inside a 'results' array)
        return response.data.results;
    } catch (error) {
        console.error(`[Service Error]: TMDB Connection failed - ${error.message}`);

        // Throw the error so the controller handles it and sends a proper response to the Frontend
        throw new Error(`External API request failed: ${error.message}`);
    }
};

module.exports = {
    fetchPopularMovies
};
