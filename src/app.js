const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

// Middlewares
app.use(cors()); // Configure CORS to allow frontend connections
app.use(express.json()); // Parse JSON payloads
app.use(express.static('public')); // Serve the frontend UI

// Routes
app.use('/api/movies', movieRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

module.exports = app;
