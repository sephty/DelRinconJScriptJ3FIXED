const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Allow requests from localhost (development) and Netlify (production)
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost and Netlify domains
        if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('netlify.app')) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Load db.json
const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'));
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

// Use JSON Server's default middleware (logger, static, etc.)
app.use(middlewares);

// Use JSON Server router for /api routes
app.use('/api', router);

// Also expose routes without /api prefix for backward compatibility
app.use(router);

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Backend server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Export app for Vercel serverless
module.exports = app;

// Start server locally if not on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Hotel Rincón del Carmen Backend`);
        console.log(`Server is running on port ${PORT}`);
        console.log(`API available at: http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`Routes: /usuarios, /habitaciones, /reservas`);
    });
}
