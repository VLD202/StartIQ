from fastapi import FastAPI
from pydantic import BaseModel
from agents.finance_agent import run_finance_agent

# ✅ ADD THIS
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ ADD THIS BLOCK (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema (from frontend)
class AnalyzeRequest(BaseModel):
    idea: str
    tam: str
    competitor: str
    feasibility: float
    risk: float

@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    payload = {
        "idea": data.idea,
        "idea_data": {"feasibility_score": data.feasibility},
        "market_data": {"TAM": data.tam},
        "competitor_data": {"direct_competitors": [data.competitor]},
        "risk_data": {"risk_score": data.risk}
    }

    result = run_finance_agent(payload)
    return result