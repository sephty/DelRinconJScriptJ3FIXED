const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware - CRITICAL for Vercel + Netlify
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Allow all origins (dev-friendly, can restrict later)
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// Additional CORS middleware
app.use(cors({
    origin: true,
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
