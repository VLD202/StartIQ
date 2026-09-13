from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

# ==============================================================================
# Common & Sub-Models
# ==============================================================================

class SWOTAnalysis(BaseModel):
    strengths: List[str] = Field(default_factory=list, description="Internal strengths of the startup")
    weaknesses: List[str] = Field(default_factory=list, description="Internal weaknesses or vulnerabilities")
    opportunities: List[str] = Field(default_factory=list, description="External market opportunities")
    threats: List[str] = Field(default_factory=list, description="External competitive/regulatory threats")

class ScoreBreakdown(BaseModel):
    idea: float = Field(..., description="Idea & feasibility score (0-100)")
    market: float = Field(..., description="Market opportunity score (0-100)")
    competitor: float = Field(..., description="Competitive edge score (0-100)")
    risk: float = Field(..., description="Risk resilience score (0-100, higher is safer)")
    finance: float = Field(..., description="Financial viability score (0-100)")


# ==============================================================================
# 6 Agent Output Models
# ==============================================================================

# Agent 01: Idea Agent Output
class IdeaOutput(BaseModel):
    problem_statement: str = Field(..., description="Core problem identified")
    solution_summary: str = Field(..., description="Startup proposed solution")
    target_user: str = Field(..., description="Primary ideal customer profile")
    feasibility_score: float = Field(..., ge=0.0, le=10.0, description="Technical and operational feasibility (0-10)")
    clarity_score: float = Field(..., ge=0.0, le=10.0, description="Clarity and focus of the proposition (0-10)")
    innovation_level: float = Field(..., ge=0.0, le=10.0, description="Degree of uniqueness and differentiation (0-10)")
    idea_score: float = Field(..., ge=0.0, le=100.0, description="Overall idea score (0-100)")
    initial_verdict: str = Field(..., description="Quick summary verdict on concept strength")

# Agent 02: Market Agent Output
class MarketOutput(BaseModel):
    tam: str = Field(..., description="Total Addressable Market size (e.g. '$45B')")
    sam: str = Field(..., description="Serviceable Addressable Market size (e.g. '$8B')")
    som: str = Field(..., description="Serviceable Obtainable Market size (e.g. '$450M')")
    target_audience: List[str] = Field(default_factory=list, description="Key target customer segments")
    market_trends: List[str] = Field(default_factory=list, description="Macro trends supporting the market")
    growth_rate: str = Field(..., description="Projected annual market growth rate (e.g. '18.4% CAGR')")
    market_score: float = Field(..., ge=0.0, le=100.0, description="Market attractiveness score (0-100)")
    market_opportunity_summary: str = Field(..., description="Strategic overview of the market opportunity")

# Agent 03: Competitor Agent Output
class CompetitorOutput(BaseModel):
    direct_competitors: List[str] = Field(default_factory=list, description="Direct competitors solving the exact same problem")
    indirect_competitors: List[str] = Field(default_factory=list, description="Indirect alternatives or substitutes")
    market_gap: str = Field(..., description="Identified gap or underserved niche")
    swot: SWOTAnalysis = Field(..., description="SWOT analysis")
    competitive_advantage: str = Field(..., description="Core moat or unfair advantage")
    competitor_score: float = Field(..., ge=0.0, le=100.0, description="Competitive positioning score (0-100)")
    threat_level: str = Field("Medium", description="'Low' | 'Medium' | 'High'")

# Agent 04: Risk Agent Output
class RiskOutput(BaseModel):
    risk_score: float = Field(..., ge=0.0, le=10.0, description="Risk index (0-10, lower means less risky)")
    overall_risk_level: str = Field("Medium", description="'Low' | 'Medium' | 'High'")
    innovation_uniqueness: float = Field(..., ge=0.0, le=10.0, description="Degree of technical/business innovation (0-10)")
    execution_challenges: List[str] = Field(default_factory=list, description="Main operational or engineering hurdles")
    regulatory_risks: List[str] = Field(default_factory=list, description="Compliance or legal considerations")
    mitigation_strategies: List[str] = Field(default_factory=list, description="Actionable countermeasures")
    innovation_summary: str = Field(..., description="Assessment of innovation defensibility")

# Agent 05: Finance Agent Output
class FinanceOutput(BaseModel):
    estimated_startup_cost: str = Field(..., description="Estimated MVP or initial launch budget")
    monthly_burn_rate: str = Field(..., description="Estimated early monthly operational costs")
    revenue_streams: List[str] = Field(default_factory=list, description="Primary monetization models")
    pricing_model: str = Field(..., description="Recommended pricing strategy")
    break_even_months: int = Field(..., ge=1, description="Estimated months to achieve cash flow break-even")
    funding_needed: str = Field(..., description="Pre-seed or Seed capital recommendation")
    financial_score: float = Field(..., ge=0.0, le=100.0, description="Financial viability score (0-100)")
    financial_summary: str = Field(..., description="Overall financial sanity check")

# Agent 06: Final Scoring Agent Output
class ScoringOutput(BaseModel):
    run_id: str = Field(..., description="Evaluation identifier")
    overall_score: float = Field(..., ge=0.0, le=100.0, description="Aggregated weighted evaluation score (0-100)")
    score_breakdown: ScoreBreakdown = Field(..., description="Breakdown of individual scores")
    investment_readiness: str = Field(..., description="'SEED READY 🚀' | 'PROMISING MVP 📈' | 'EARLY CONCEPT 🔬' | 'HIGH RISK ⚠️'")
    verdict: str = Field(..., description="Executive verdict and comprehensive critique")
    key_strengths: List[str] = Field(default_factory=list, description="Top positive factors")
    critical_red_flags: List[str] = Field(default_factory=list, description="Primary warnings or vulnerabilities")
    recommended_next_steps: List[str] = Field(default_factory=list, description="Prioritized roadmap for founder")


# ==============================================================================
# Request Envelopes for API Endpoints
# ==============================================================================

class IdeaRequest(BaseModel):
    idea: str = Field(..., min_length=5, description="Startup idea description")

class MarketRequest(BaseModel):
    idea: str = Field(..., description="Startup idea description")
    idea_data: Optional[Dict[str, Any]] = Field(default=None, description="Output from Idea Agent")

class CompetitorRequest(BaseModel):
    idea: str = Field(..., description="Startup idea description")
    market_data: Optional[Dict[str, Any]] = Field(default=None, description="Output from Market Agent")

class RiskRequest(BaseModel):
    idea: str = Field(..., description="Startup idea description")
    competitor_data: Optional[Dict[str, Any]] = Field(default=None, description="Output from Competitor Agent")

class FinanceRequest(BaseModel):
    idea: str = Field(..., description="Startup idea description")
    market_data: Optional[Dict[str, Any]] = Field(default=None)
    competitor_data: Optional[Dict[str, Any]] = Field(default=None)
    risk_data: Optional[Dict[str, Any]] = Field(default=None)

class ScoringRequest(BaseModel):
    idea: str = Field(..., description="Startup idea description")
    run_id: Optional[str] = None
    idea_data: Optional[Dict[str, Any]] = None
    market_data: Optional[Dict[str, Any]] = None
    competitor_data: Optional[Dict[str, Any]] = None
    risk_data: Optional[Dict[str, Any]] = None
    finance_data: Optional[Dict[str, Any]] = None

class PipelineEvaluateRequest(BaseModel):
    idea: str = Field(..., min_length=5, description="Startup idea description")
    run_id: Optional[str] = None


# ==============================================================================
# Full Consolidated Evaluation Report
# ==============================================================================

class FullEvaluationReport(BaseModel):
    run_id: str
    idea: str
    status: str = "completed"
    created_at: Optional[str] = None
    idea_data: IdeaOutput
    market_data: MarketOutput
    competitor_data: CompetitorOutput
    risk_data: RiskOutput
    finance_data: FinanceOutput
    scoring_data: ScoringOutput
