-- ==============================================================================
-- StartIQ Database Schema (PostgreSQL & SQLite Compatible)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id VARCHAR(64) UNIQUE NOT NULL,
    idea TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_outputs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id VARCHAR(64) NOT NULL,
    agent_name VARCHAR(32) NOT NULL,
    output_data TEXT NOT NULL,
    latency_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS final_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evaluations_run_id ON evaluations(run_id);
CREATE INDEX IF NOT EXISTS idx_agent_outputs_run_id ON agent_outputs(run_id);
CREATE INDEX IF NOT EXISTS idx_final_scores_run_id ON final_scores(run_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
