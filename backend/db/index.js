const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

let pgPool = null;
let sqliteDb = null;
let activeEngine = 'sqlite';

const dbPath = path.join(__dirname, 'startiq.db');

// Initialize database
function initDatabase() {
    const databaseUrl = process.env.DATABASE_URL?.trim();

    if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
        try {
            console.log('Connecting to PostgreSQL database...');
            pgPool = new Pool({
                connectionString: databaseUrl,
                ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
            });
            activeEngine = 'postgres';

            // Create tables in PostgreSQL (PostgreSQL uses SERIAL or IDENTITY instead of AUTOINCREMENT)
            const pgSchema = `
                CREATE TABLE IF NOT EXISTS evaluations (
                    id SERIAL PRIMARY KEY,
                    run_id VARCHAR(64) UNIQUE NOT NULL,
                    idea TEXT NOT NULL,
                    status VARCHAR(32) DEFAULT 'in_progress',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS agent_outputs (
                    id SERIAL PRIMARY KEY,
                    run_id VARCHAR(64) NOT NULL,
                    agent_name VARCHAR(32) NOT NULL,
                    output_data TEXT NOT NULL,
                    latency_ms INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS final_scores (
                    id SERIAL PRIMARY KEY,
                    run_id VARCHAR(64) UNIQUE NOT NULL,
                    overall_score REAL NOT NULL,
                    idea_score REAL,
                    market_score REAL,
                    competitor_score REAL,
                    risk_score REAL,
                    finance_score REAL,
                    investment_readiness VARCHAR(64),
                    verdict TEXT NOT NULL,
                    recommended_next_steps TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(128) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            `;
            pgPool.query(pgSchema).catch(err => {
                console.warn('PostgreSQL table creation warning:', err.message);
            });
            console.log('PostgreSQL database initialized successfully.');
            return;
        } catch (err) {
            console.warn(`PostgreSQL initialization failed (${err.message}). Falling back to local SQLite.`);
            activeEngine = 'sqlite';
        }
    }

    // Default to local SQLite
    console.log(`Initializing zero-config local SQLite database at: ${dbPath}`);
    sqliteDb = new DatabaseSync(dbPath);
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    sqliteDb.exec(schemaSql);
    activeEngine = 'sqlite';
    console.log('Local SQLite database initialized successfully.');
}

initDatabase();

// DB Abstraction methods
async function createEvaluation(runId, idea, status = 'in_progress') {
    if (activeEngine === 'postgres' && pgPool) {
        const query = 'INSERT INTO evaluations (run_id, idea, status) VALUES ($1, $2, $3) RETURNING *';
        const res = await pgPool.query(query, [runId, idea, status]);
        return res.rows[0];
    } else {
        const stmt = sqliteDb.prepare('INSERT INTO evaluations (run_id, idea, status) VALUES (?, ?, ?)');
        stmt.run(runId, idea, status);
        return { run_id: runId, idea, status };
    }
}

async function updateEvaluationStatus(runId, status) {
    if (activeEngine === 'postgres' && pgPool) {
        const query = 'UPDATE evaluations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE run_id = $2';
        await pgPool.query(query, [status, runId]);
    } else {
        const stmt = sqliteDb.prepare('UPDATE evaluations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE run_id = ?');
        stmt.run(status, runId);
    }
}

async function saveAgentOutput(runId, agentName, outputData, latencyMs = 0) {
    const dataStr = typeof outputData === 'string' ? outputData : JSON.stringify(outputData);
    if (activeEngine === 'postgres' && pgPool) {
        const query = 'INSERT INTO agent_outputs (run_id, agent_name, output_data, latency_ms) VALUES ($1, $2, $3, $4)';
        await pgPool.query(query, [runId, agentName, dataStr, latencyMs]);
    } else {
        const stmt = sqliteDb.prepare('INSERT INTO agent_outputs (run_id, agent_name, output_data, latency_ms) VALUES (?, ?, ?, ?)');
        stmt.run(runId, agentName, dataStr, latencyMs);
    }
}

async function saveFinalScore(runId, scoreData) {
    const stepsStr = typeof scoreData.recommended_next_steps === 'string' 
        ? scoreData.recommended_next_steps 
        : JSON.stringify(scoreData.recommended_next_steps || []);
        
    const ideaScore = scoreData.score_breakdown?.idea ?? null;
    const marketScore = scoreData.score_breakdown?.market ?? null;
    const competitorScore = scoreData.score_breakdown?.competitor ?? null;
    const riskScore = scoreData.score_breakdown?.risk ?? null;
    const financeScore = scoreData.score_breakdown?.finance ?? null;

    if (activeEngine === 'postgres' && pgPool) {
        const query = `
            INSERT INTO final_scores (
                run_id, overall_score, idea_score, market_score, competitor_score,
                risk_score, finance_score, investment_readiness, verdict, recommended_next_steps
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (run_id) DO UPDATE SET
                overall_score = EXCLUDED.overall_score,
                verdict = EXCLUDED.verdict,
                investment_readiness = EXCLUDED.investment_readiness;
        `;
        await pgPool.query(query, [
            runId,
            scoreData.overall_score,
            ideaScore,
            marketScore,
            competitorScore,
            riskScore,
            financeScore,
            scoreData.investment_readiness,
            scoreData.verdict,
            stepsStr
        ]);
    } else {
        const stmt = sqliteDb.prepare(`
            INSERT OR REPLACE INTO final_scores (
                run_id, overall_score, idea_score, market_score, competitor_score,
                risk_score, finance_score, investment_readiness, verdict, recommended_next_steps
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            runId,
            scoreData.overall_score,
            ideaScore,
            marketScore,
            competitorScore,
            riskScore,
            financeScore,
            scoreData.investment_readiness,
            scoreData.verdict,
            stepsStr
        );
    }
}

async function getEvaluationByRunId(runId) {
    let evalRow = null;
    let agentRows = [];
    let scoreRow = null;

    if (activeEngine === 'postgres' && pgPool) {
        const evRes = await pgPool.query('SELECT * FROM evaluations WHERE run_id = $1', [runId]);
        evalRow = evRes.rows[0];

        const agRes = await pgPool.query('SELECT * FROM agent_outputs WHERE run_id = $1 ORDER BY id ASC', [runId]);
        agentRows = agRes.rows;

        const scRes = await pgPool.query('SELECT * FROM final_scores WHERE run_id = $1', [runId]);
        scoreRow = scRes.rows[0];
    } else {
        evalRow = sqliteDb.prepare('SELECT * FROM evaluations WHERE run_id = ?').get(runId);
        agentRows = sqliteDb.prepare('SELECT * FROM agent_outputs WHERE run_id = ? ORDER BY id ASC').all(runId);
        scoreRow = sqliteDb.prepare('SELECT * FROM final_scores WHERE run_id = ?').get(runId);
    }

    if (!evalRow) return null;

    // Parse agent outputs into a keyed dictionary
    const agentsMap = {};
    for (const ag of agentRows) {
        try {
            agentsMap[`${ag.agent_name}_data`] = JSON.parse(ag.output_data);
        } catch (e) {
            agentsMap[`${ag.agent_name}_data`] = ag.output_data;
        }
    }

    let parsedScoring = null;
    if (scoreRow) {
        let nextSteps = [];
        try {
            nextSteps = JSON.parse(scoreRow.recommended_next_steps);
        } catch (e) {
            nextSteps = [scoreRow.recommended_next_steps];
        }

        parsedScoring = {
            run_id: scoreRow.run_id,
            overall_score: scoreRow.overall_score,
            score_breakdown: {
                idea: scoreRow.idea_score,
                market: scoreRow.market_score,
                competitor: scoreRow.competitor_score,
                risk: scoreRow.risk_score,
                finance: scoreRow.finance_score
            },
            investment_readiness: scoreRow.investment_readiness,
            verdict: scoreRow.verdict,
            recommended_next_steps: nextSteps,
            created_at: scoreRow.created_at
        };
    }

    return {
        run_id: evalRow.run_id,
        idea: evalRow.idea,
        status: evalRow.status,
        created_at: evalRow.created_at,
        updated_at: evalRow.updated_at,
        ...agentsMap,
        scoring_data: parsedScoring || agentsMap['scoring_data'] || null
    };
}

async function getEvaluationHistory(limit = 20) {
    if (activeEngine === 'postgres' && pgPool) {
        const query = `
            SELECT 
                e.run_id, e.idea, e.status, e.created_at,
                s.overall_score, s.investment_readiness, s.verdict
            FROM evaluations e
            LEFT JOIN final_scores s ON e.run_id = s.run_id
            ORDER BY e.created_at DESC
            LIMIT $1
        `;
        const res = await pgPool.query(query, [limit]);
        return res.rows;
    } else {
        const stmt = sqliteDb.prepare(`
            SELECT 
                e.run_id, e.idea, e.status, e.created_at,
                s.overall_score, s.investment_readiness, s.verdict
            FROM evaluations e
            LEFT JOIN final_scores s ON e.run_id = s.run_id
            ORDER BY e.created_at DESC
            LIMIT ?
        `);
        return stmt.all(limit);
    }
}

function getDbHealth() {
    return {
        engine: activeEngine,
        status: 'connected',
        location: activeEngine === 'sqlite' ? dbPath : 'PostgreSQL Cloud/Local'
    };
}

async function createUser(name, email, passwordHash) {
    if (activeEngine === 'postgres' && pgPool) {
        const query = `
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at
        `;
        const res = await pgPool.query(query, [name, email.toLowerCase(), passwordHash]);
        return res.rows[0];
    } else {
        const stmt = sqliteDb.prepare(`
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(name, email.toLowerCase(), passwordHash);
        return {
            id: Number(result.lastInsertRowid),
            name,
            email: email.toLowerCase(),
            created_at: new Date().toISOString()
        };
    }
}

async function getUserByEmail(email) {
    if (activeEngine === 'postgres' && pgPool) {
        const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
        const res = await pgPool.query(query, [email.toLowerCase().trim()]);
        return res.rows[0] || null;
    } else {
        const stmt = sqliteDb.prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        return stmt.get(email.toLowerCase().trim()) || null;
    }
}

async function getUserById(id) {
    if (activeEngine === 'postgres' && pgPool) {
        const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1';
        const res = await pgPool.query(query, [id]);
        return res.rows[0] || null;
    } else {
        const stmt = sqliteDb.prepare('SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1');
        return stmt.get(id) || null;
    }
}

module.exports = {
    createEvaluation,
    updateEvaluationStatus,
    saveAgentOutput,
    saveFinalScore,
    getEvaluationByRunId,
    getEvaluationHistory,
    createUser,
    getUserByEmail,
    getUserById,
    getDbHealth
};
