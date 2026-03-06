const tmdbService = require('../services/tmdbService');

const getPopularMovies = async (req, res, next) => {
    try {
        // Controller asks the service layer for the data
        const movies = await tmdbService.fetchPopularMovies();

        // Send a structured and decoupled response back to the client
        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (error) {
        // If an error happens, we pass it down to the next error handler or handle it here
        console.error(`[Controller Error]: ${error.message}`);
        res.status(502).json({
            success: false,
            message: 'Failed to retrieve movies from the external service.',
            error: error.message
        });
    }
};

module.exports = {
    getPopularMovies
};

