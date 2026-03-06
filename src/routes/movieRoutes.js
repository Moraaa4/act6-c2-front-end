const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

// GET /api/movies
router.get('/', movieController.getPopularMovies);

module.exports = router;
