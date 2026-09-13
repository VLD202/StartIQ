# StartIQ — AI-Powered Multi-Agent Startup Evaluation Platform

StartIQ is an intelligent startup idea evaluation platform that runs a sequential 6-agent AI pipeline to assess early-stage venture viability, market size (TAM/SAM/SOM), competitive dynamics (SWOT), risk profile, and unit economics, culminating in an overall investment readiness score and strategic roadmap.

---

## Architecture Overview (Option A: 3-Tier Multi-Service)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TIER 1: FRONTEND (Port 3000)                          │
│  React (Vite) + Cyberpunk/Modern Dark Mode Dashboard                        │
│  - Startup Idea Form with Quick-Fill Preset Chips                           │
│  - Live 6-Agent Sequential Pipeline Stepper                                 │
│  - Score Dashboard (Radial Circular Gauge, Verdict, Readiness Badge)        │
│  - Deep Analytical Cards (TAM/SAM/SOM, SWOT Matrix, Risk Audit, Unit Econ)  │
│  - Searchable Evaluation History Explorer                                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP REST (Port 3000 -> Port 5000)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 TIER 2: NODE.JS ORCHESTRATOR & DB (Port 5000)               │
│  Express.js REST API                                                        │
│  - POST /evaluate          -> Orchestrates 6 agents, generates run_id       │
│  - GET  /result/:run_id    -> Retrieves full report from database           │
│  - GET  /history           -> Fetches past evaluations                      │
│  - GET  /health            -> System health check                           │
│  Dual Database Engine:                                                      │
│  - PostgreSQL via DATABASE_URL (if provided)                                │
│  - Zero-config local SQLite (startiq.db) automatic fallback                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Sequential HTTP Calls (Port 5000 -> 8000)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                  TIER 3: PYTHON FASTAPI AI ENGINE (Port 8000)               │
│  FastAPI + Pydantic v2 + LangChain 6-Agent Engine                           │
│  1. Idea Agent       -> Problem-solution fit, feasibility, clarity (0-100)  │
│  2. Market Agent     -> TAM/SAM/SOM, target audience, trends, CAGR          │
│  3. Competitor Agent -> Direct/indirect rivals, 4-quadrant SWOT, moat       │
│  4. Risk Agent       -> Technical/regulatory barriers, mitigation tactics   │
│  5. Finance Agent    -> Startup budget, monthly burn, break-even timeline   │
│  6. Scoring Agent    -> Weighted composite rating, readiness & next steps   │
│                                                                             │
│  Multi-Provider LLM Engine:                                                 │
│  - Primary: Groq LLaMA 3.3 70B (if GROQ_API_KEY in .env)                    │
│  - Resilient Fallback: Built-in High-Fidelity Domain-Aware Mock Engine       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start (Localhost)

### Method 1: One-Click Startup (Windows)
Double-click `run_all.bat` in the project root. It will automatically launch all 3 services in separate windows and open `http://localhost:3000` in your browser.

```cmd
run_all.bat
```

### Method 2: Manual Startup (3 Terminals)

#### Terminal 1: Python FastAPI AI Engine (Port 8000)
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

#### Terminal 2: Node.js Orchestrator & DB (Port 5000)
```bash
cd backend
npm start
```

#### Terminal 3: React Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

Then visit: **`http://localhost:3000`**

---

## Configuration (`.env`)

Copy `.env.example` to `.env` (already created):

```env
# Optional - Leave blank to use the autonomous Mock Engine
GROQ_API_KEY=your_groq_api_key_here

# Service Ports
AI_SERVICE_PORT=8000
AI_SERVICE_URL=http://localhost:8000
PORT=5000
BACKEND_URL=http://localhost:5000

# Optional Database (Leave blank for automatic local SQLite)
DATABASE_URL=
```

---

## API Documentation

### Node.js Backend (`http://localhost:5000`)
- **`POST /evaluate`**:
  - Body: `{ "idea": "AI clinical scribe for outpatient clinics" }`
  - Runs all 6 agents, saves to database, returns full evaluation report.
- **`GET /result/:run_id`**:
  - Returns complete saved evaluation report for the specified run ID.
- **`GET /history`**:
  - Returns a list of past evaluations ordered by timestamp descending.
- **`GET /health`**:
  - Checks health of orchestrator, database, and AI service.

### Python AI Engine (`http://localhost:8000`)
- **`POST /agents/idea`**: Run Idea Agent standalone.
- **`POST /agents/market`**: Run Market Agent standalone.
- **`POST /agents/competitor`**: Run Competitor Agent standalone.
- **`POST /agents/risk`**: Run Risk Agent standalone.
- **`POST /agents/finance`**: Run Finance Agent standalone.
- **`POST /agents/scoring`**: Run Final Scoring Agent standalone.
- **`POST /pipeline/evaluate`**: Run all 6 agents directly in Python.
- **`GET /docs`**: Interactive Swagger / OpenAPI documentation.
