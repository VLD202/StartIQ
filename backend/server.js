const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const evaluateRoutes = require('./routes/evaluate');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Routes - Support both root and /api prefixes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/', evaluateRoutes);
app.use('/api', evaluateRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        service: 'StartIQ Node.js Orchestrator & Backend API',
        version: '2.0.0',
        endpoints: {
            evaluate: 'POST /evaluate (or /api/evaluate)',
            result: 'GET /result/:run_id (or /api/result/:run_id)',
            history: 'GET /history (or /api/history)',
            health: 'GET /health (or /api/health)'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: `Endpoint '${req.method} ${req.url}' not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Server Error]', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 StartIQ Backend Orchestrator running on port ${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/evaluate`);
    console.log(`   GET  http://localhost:${PORT}/result/:run_id`);
    console.log(`   GET  http://localhost:${PORT}/history`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`=======================================================`);
});
