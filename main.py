from final_scorer import calculate_final_score
from fastapi import FastAPI
from pydantic import BaseModel
from agents.competitor_agent import run_competitor_agent
from agents.risk_agent import run_risk_agent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="StartIQ - Member 2 Agents")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body ka structure
class AgentRequest(BaseModel):
    idea: str
    market_data: dict

@app.get("/")
def root():
    return {"message": "Member 2 agents are live!", "agents": ["competitor", "risk"]}

@app.post("/competitor")
def competitor_endpoint(request: AgentRequest):
    result = run_competitor_agent(
        idea=request.idea,
        market_data=request.market_data
    )
    return result

@app.post("/risk")
def risk_endpoint(request: AgentRequest):
    # Pehle competitor chalao
    competitor_data = run_competitor_agent(
        idea=request.idea,
        market_data=request.market_data
    )
    # Phir risk me pass karo
    risk_data = run_risk_agent(
        idea=request.idea,
        competitor_data=competitor_data
    )
    return {
        "competitor": competitor_data,
        "risk": risk_data
    }

@app.post("/final-score")
def final_score_endpoint(data: dict):
    final_result = calculate_final_score(data)
    return final_result