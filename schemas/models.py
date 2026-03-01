from pydantic import BaseModel
from typing import List

# SWOT ka structure — 4 cheezein hoti hain SWOT me
class SWOTAnalysis(BaseModel):
    strengths: List[str]      # Kya achha hai startup me
    weaknesses: List[str]     # Kya kamzori hai
    opportunities: List[str]  # Market me kya mauka hai
    threats: List[str]        # Kya khatra hai

# Competitor Agent ka poora output structure
class CompetitorOutput(BaseModel):
    direct_competitors: List[str]    # Same kaam karne wali companies
    indirect_competitors: List[str]  # Alag tarike se same problem solve karne wale
    market_gap: str                  # Kya opportunity hai abhi market me
    swot: SWOTAnalysis               # Upar wala SWOT object
    competitive_advantage: str       # Is startup ka edge kya hai

# Risk Agent ka output structure
class RiskOutput(BaseModel):
    risk_score: float                 # 0-10, jitna zyada utna risky
    innovation_uniqueness: float      # 0-10, kitna unique hai idea
    execution_challenges: List[str]   # Kya mushkilein aayengi
    mitigation_strategies: List[str]  # Risks se kaise bachein
    overall_risk_level: str           # "Low" / "Medium" / "High"
    innovation_summary: str           # Short description
