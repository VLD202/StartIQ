import os
import uuid
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from schemas.models import (
    IdeaRequest, MarketRequest, CompetitorRequest,
    RiskRequest, FinanceRequest, ScoringRequest,
    PipelineEvaluateRequest, FullEvaluationReport,
    IdeaOutput, MarketOutput, CompetitorOutput,
    RiskOutput, FinanceOutput, ScoringOutput
)
from agents import (
    run_idea_agent,
    run_market_agent,
    run_competitor_agent,
    run_risk_agent,
    run_finance_agent,
    run_scoring_agent
)

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("startiq.api")

app = FastAPI(
    title="StartIQ AI Engine",
    description="6-Agent Multi-Agent Startup Evaluation Service",
    version="2.0.0"
)

# Enable CORS for frontend and Node orchestrator
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    has_groq = bool(os.getenv("GROQ_API_KEY", "").strip())
    return {
        "service": "StartIQ AI Multi-Agent Service",
        "version": "2.0.0",
        "status": "online",
        "mode": "Groq LLaMA 3.3" if has_groq else "Autonomous High-Fidelity Mock Engine",
        "agents": [
            "01_idea_agent",
            "02_market_agent",
            "03_competitor_agent",
            "04_risk_agent",
            "05_finance_agent",
            "06_scoring_agent"
        ]
    }


@app.get("/health")
def health_check():
    has_groq = bool(os.getenv("GROQ_API_KEY", "").strip())
    return {
        "status": "healthy",
        "groq_configured": has_groq,
        "engine": "groq_llama_3.3" if has_groq else "mock_engine",
        "timestamp": datetime.utcnow().isoformat()
    }


# ==============================================================================
# Individual Agent Endpoints
# ==============================================================================

@app.post("/agents/idea", response_model=IdeaOutput)
def agent_idea_endpoint(request: IdeaRequest):
    try:
        return run_idea_agent(idea=request.idea)
    except Exception as e:
        logger.error(f"Idea Agent failed: {e}")
        raise HTTPException(status_code=500, detail=f"Idea Agent error: {str(e)}")


@app.post("/agents/market", response_model=MarketOutput)
def agent_market_endpoint(request: MarketRequest):
    try:
        idea_data = request.idea_data or run_idea_agent(request.idea)
        return run_market_agent(idea=request.idea, idea_data=idea_data)
    except Exception as e:
        logger.error(f"Market Agent failed: {e}")
        raise HTTPException(status_code=500, detail=f"Market Agent error: {str(e)}")


@app.post("/agents/competitor", response_model=CompetitorOutput)
def agent_competitor_endpoint(request: CompetitorRequest):
    try:
        market_data = request.market_data
        if not market_data:
            idea_data = run_idea_agent(request.idea)
            market_data = run_market_agent(request.idea, idea_data)
        return run_competitor_agent(idea=request.idea, market_data=market_data)
    except Exception as e:
        logger.error(f"Competitor Agent failed: {e}")
        raise HTTPException(status_code=500, detail=f"Competitor Agent error: {str(e)}")


@app.post("/agents/risk", response_model=RiskOutput)
def agent_risk_endpoint(request: RiskRequest):
    try:
        comp_data = request.competitor_data
        if not comp_data:
            idea_data = run_idea_agent(request.idea)
            market_data = run_market_agent(request.idea, idea_data)
            comp_data = run_competitor_agent(request.idea, market_data)
        return run_risk_agent(idea=request.idea, competitor_data=comp_data)
    except Exception as e:
        logger.error(f"Risk Agent failed: {e}")
        raise HTTPException(status_code=500, detail=f"Risk Agent error: {str(e)}")


@app.post("/agents/finance", response_model=FinanceOutput)
def agent_finance_endpoint(request: FinanceRequest):
    try:
        market_data = request.market_data or {}
        comp_data = request.competitor_data or {}
        risk_data = request.risk_data or {}
        return run_finance_agent(
            idea=request.idea,
            market_data=market_data,
            competitor_data=comp_data,
            risk_data=risk_data
        )
    except Exception as e:
        logger.error(f"Finance Agent failed: {e}")
        raise HTTPException(status_code=500, detail=f"Finance Agent error: {str(e)}")


@app.post("/agents/scoring", response_model=ScoringOutput)
def agent_scoring_endpoint(request: ScoringRequest):
    try:
        run_id = request.run_id or f"startiq_{uuid.uuid4().hex[:8]}"
        return run_scoring_agent(
            idea=request.idea,
            run_id=run_id,
            idea_data=request.idea_data or {},
            market_data=request.market_data or {},
            competitor_data=request.competitor_data or {},
            risk_data=request.risk_data or {},
            finance_data=request.finance_data or {}
        )
    except Exception as e:
        logger.error(f"Scoring Agent failed: {e}")
        raise HTTPException(status_code=500, detail=f"Scoring Agent error: {str(e)}")


# ==============================================================================
# Complete 6-Agent Sequential Execution Pipeline
# ==============================================================================

@app.post("/pipeline/evaluate", response_model=FullEvaluationReport)
@app.post("/evaluate", response_model=FullEvaluationReport)
@app.post("/analyze", response_model=FullEvaluationReport)
def complete_pipeline_evaluate(request: PipelineEvaluateRequest):
    """
    Executes the full 6-agent sequential evaluation pipeline:
    Idea -> Market -> Competitor -> Risk -> Finance -> Final Scoring
    """
    idea = request.idea
    run_id = request.run_id or f"startiq_{uuid.uuid4().hex[:8]}"
    logger.info(f"Starting 6-agent evaluation pipeline for run_id={run_id}")

    # 1. Idea Agent
    idea_out = run_idea_agent(idea)

    # 2. Market Agent
    market_out = run_market_agent(idea, idea_out)

    # 3. Competitor Agent
    comp_out = run_competitor_agent(idea, market_out)

    # 4. Risk Agent
    risk_out = run_risk_agent(idea, comp_out)

    # 5. Finance Agent
    fin_out = run_finance_agent(idea, market_out, comp_out, risk_out)

    # 6. Final Scoring Agent
    scoring_out = run_scoring_agent(
        idea=idea,
        run_id=run_id,
        idea_data=idea_out,
        market_data=market_out,
        competitor_data=comp_out,
        risk_data=risk_out,
        finance_data=fin_out
    )

    return FullEvaluationReport(
        run_id=run_id,
        idea=idea,
        status="completed",
        created_at=datetime.utcnow().isoformat(),
        idea_data=idea_out,
        market_data=market_out,
        competitor_data=comp_out,
        risk_data=risk_out,
        finance_data=fin_out,
        scoring_data=scoring_out
    )


# ==============================================================================
# Backward-compatibility routes for previous Member 2 tests
# ==============================================================================

@app.post("/competitor")
def legacy_competitor_endpoint(request: CompetitorRequest):
    return agent_competitor_endpoint(request)

@app.post("/risk")
def legacy_risk_endpoint(request: RiskRequest):
    return agent_risk_endpoint(request)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    print(f"Starting StartIQ AI Service on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)