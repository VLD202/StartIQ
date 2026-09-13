const express = require('express');
const router = express.Router();
const db = require('../db');
const { executeEvaluationPipeline } = require('../services/orchestrator');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// POST /evaluate or /analyze -> Trigger 6-agent evaluation pipeline
router.post(['/evaluate', '/analyze'], async (req, res) => {
    try {
        const { idea, run_id } = req.body;

        if (!idea || typeof idea !== 'string' || idea.trim().length < 5) {
            return res.status(400).json({
                error: 'Valid startup idea description is required (minimum 5 characters).'
            });
        }

        const report = await executeEvaluationPipeline(idea.trim(), run_id);
        return res.status(200).json(report);
    } catch (err) {
        console.error('[API /evaluate] Error:', err);
        return res.status(500).json({
            error: 'Startup evaluation pipeline failed.',
            details: err.message
        });
    }
});

// GET /result/:run_id -> Fetch evaluation by run_id
router.get('/result/:run_id', async (req, res) => {
    try {
        const { run_id } = req.params;
        const result = await db.getEvaluationByRunId(run_id);

        if (!result) {
            return res.status(404).json({
                error: `Evaluation with run_id '${run_id}' not found.`
            });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error(`[API /result/${req.params.run_id}] Error:`, err);
        return res.status(500).json({
            error: 'Failed to retrieve evaluation result.',
            details: err.message
        });
    }
});

// GET /history -> Fetch past evaluations
router.get('/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 30;
        const history = await db.getEvaluationHistory(limit);
        return res.status(200).json(history);
    } catch (err) {
        console.error('[API /history] Error:', err);
        return res.status(500).json({
            error: 'Failed to retrieve evaluation history.',
            details: err.message
        });
    }
});

// GET /health -> Check system health
router.get('/health', async (req, res) => {
    let aiServiceStatus = 'offline';
    try {
        const aiRes = await fetch(`${AI_SERVICE_URL}/health`, { signal: AbortSignal.timeout(3000) });
        if (aiRes.ok) {
            const data = await aiRes.json();
            aiServiceStatus = data.engine || 'online';
        }
    } catch (e) {
        aiServiceStatus = 'unreachable';
    }

    const dbHealth = db.getDbHealth();

    return res.status(200).json({
        orchestrator: 'online',
        port: process.env.PORT || 5000,
        ai_service: aiServiceStatus,
        ai_service_url: AI_SERVICE_URL,
        database: dbHealth,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
