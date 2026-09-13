const crypto = require('crypto');
const db = require('../db');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function fetchJson(url, payload) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`AI Service request failed [${res.status}]: ${errorText}`);
    }

    return await res.json();
}

/**
 * Executes the complete 6-agent sequential pipeline:
 * Startup Idea -> Idea -> Market -> Competitor -> Risk -> Finance -> Final Scoring
 */
async function executeEvaluationPipeline(idea, customRunId = null) {
    const runId = customRunId || `startiq_${crypto.randomBytes(4).toString('hex')}`;
    console.log(`[Orchestrator] Starting evaluation pipeline for run_id: ${runId}`);

    // Create DB entry
    await db.createEvaluation(runId, idea, 'in_progress');

    try {
        // Step 1: Idea Agent
        console.log(`[Orchestrator][${runId}] Calling 1. Idea Agent...`);
        const t1 = Date.now();
        const ideaData = await fetchJson(`${AI_SERVICE_URL}/agents/idea`, { idea });
        const l1 = Date.now() - t1;
        await db.saveAgentOutput(runId, 'idea', ideaData, l1);

        // Step 2: Market Agent
        console.log(`[Orchestrator][${runId}] Calling 2. Market Agent...`);
        const t2 = Date.now();
        const marketData = await fetchJson(`${AI_SERVICE_URL}/agents/market`, { idea, idea_data: ideaData });
        const l2 = Date.now() - t2;
        await db.saveAgentOutput(runId, 'market', marketData, l2);

        // Step 3: Competitor Agent
        console.log(`[Orchestrator][${runId}] Calling 3. Competitor Agent...`);
        const t3 = Date.now();
        const competitorData = await fetchJson(`${AI_SERVICE_URL}/agents/competitor`, { idea, market_data: marketData });
        const l3 = Date.now() - t3;
        await db.saveAgentOutput(runId, 'competitor', competitorData, l3);

        // Step 4: Risk Agent
        console.log(`[Orchestrator][${runId}] Calling 4. Risk Agent...`);
        const t4 = Date.now();
        const riskData = await fetchJson(`${AI_SERVICE_URL}/agents/risk`, { idea, competitor_data: competitorData });
        const l4 = Date.now() - t4;
        await db.saveAgentOutput(runId, 'risk', riskData, l4);

        // Step 5: Finance Agent
        console.log(`[Orchestrator][${runId}] Calling 5. Finance Agent...`);
        const t5 = Date.now();
        const financeData = await fetchJson(`${AI_SERVICE_URL}/agents/finance`, {
            idea,
            market_data: marketData,
            competitor_data: competitorData,
            risk_data: riskData
        });
        const l5 = Date.now() - t5;
        await db.saveAgentOutput(runId, 'finance', financeData, l5);

        // Step 6: Final Scoring Agent
        console.log(`[Orchestrator][${runId}] Calling 6. Final Scoring Agent...`);
        const t6 = Date.now();
        const scoringData = await fetchJson(`${AI_SERVICE_URL}/agents/scoring`, {
            idea,
            run_id: runId,
            idea_data: ideaData,
            market_data: marketData,
            competitor_data: competitorData,
            risk_data: riskData,
            finance_data: financeData
        });
        const l6 = Date.now() - t6;
        await db.saveAgentOutput(runId, 'scoring', scoringData, l6);

        // Save final score record and mark complete
        await db.saveFinalScore(runId, scoringData);
        await db.updateEvaluationStatus(runId, 'completed');

        console.log(`[Orchestrator][${runId}] Pipeline completed successfully. Overall score: ${scoringData.overall_score}`);

        return {
            run_id: runId,
            idea,
            status: 'completed',
            created_at: new Date().toISOString(),
            idea_data: ideaData,
            market_data: marketData,
            competitor_data: competitorData,
            risk_data: riskData,
            finance_data: financeData,
            scoring_data: scoringData
        };
    } catch (err) {
        console.error(`[Orchestrator][${runId}] Pipeline execution error: ${err.message}`);
        await db.updateEvaluationStatus(runId, 'failed');
        throw err;
    }
}

module.exports = {
    executeEvaluationPipeline
};
