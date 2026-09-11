import json
import uuid
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import ScoringOutput, ScoreBreakdown
from agents.base_agent import run_agent_with_fallback

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are the Managing Partner at a Tier-1 Venture Capital Firm.
Synthesize all 5 specialist agent evaluations into a decisive master investment report, composite rating, investment readiness verdict, key strengths, red flags, and concrete founder roadmap.

IMPORTANT: Respond ONLY with valid JSON. No markdown backticks, no explanation.
The JSON must adhere strictly to this schema:
{{
  "run_id": "startiq_abc123",
  "overall_score": 83.4,
  "score_breakdown": {{
    "idea": 85.0,
    "market": 84.0,
    "competitor": 80.0,
    "risk": 82.0,
    "finance": 86.0
  }},
  "investment_readiness": "SEED READY 🚀",
  "verdict": "Thorough venture thesis explaining why this startup is or is not investable.",
  "key_strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "critical_red_flags": ["Red flag 1", "Red flag 2"],
  "recommended_next_steps": [
    "Step 1: Immediate validation milestone",
    "Step 2: Technical prototype target",
    "Step 3: Initial pilot customer cohort"
  ]
}}
overall_score and all score_breakdown values must be floats between 0.0 and 100.0.
investment_readiness must be one of: "SEED READY 🚀", "PROMISING MVP 📈", "EARLY CONCEPT 🔬", "HIGH RISK ⚠️"."""),
    ("human", """Startup Idea: {idea}
Run ID: {run_id}

Previous Agent Evaluations:
1. Idea Analysis: {idea_data}
2. Market Sizing: {market_data}
3. Competitors & SWOT: {competitor_data}
4. Risk Audit: {risk_data}
5. Finance & Unit Economics: {finance_data}

Generate the final master investment score and report. Return JSON only.""")
])


def _calculate_weighted_score(idea_d: dict, market_d: dict, comp_d: dict, risk_d: dict, fin_d: dict) -> tuple[float, ScoreBreakdown]:
    s_idea = float(idea_d.get("idea_score", 80.0))
    s_market = float(market_d.get("market_score", 75.0))
    s_comp = float(comp_d.get("competitor_score", 75.0))
    
    # Invert risk score (0-10) to 0-100 safety scale
    r_val = float(risk_d.get("risk_score", 5.0))
    s_risk = max(0.0, min(100.0, (10.0 - r_val) * 10.0))
    
    s_fin = float(fin_d.get("financial_score", 75.0))
    
    # Weighted composite: Idea (20%), Market (25%), Competitor (20%), Risk (15%), Finance (20%)
    overall = round((s_idea * 0.20) + (s_market * 0.25) + (s_comp * 0.20) + (s_risk * 0.15) + (s_fin * 0.20), 1)
    
    breakdown = ScoreBreakdown(
        idea=round(s_idea, 1),
        market=round(s_market, 1),
        competitor=round(s_comp, 1),
        risk=round(s_risk, 1),
        finance=round(s_fin, 1)
    )
    return overall, breakdown


def _mock_scoring_generator(inputs: dict) -> dict:
    idea_text = inputs.get("idea", "")
    run_id = inputs.get("run_id") or f"startiq_{uuid.uuid4().hex[:8]}"
    
    idea_d = json.loads(inputs.get("idea_data", "{}"))
    market_d = json.loads(inputs.get("market_data", "{}"))
    comp_d = json.loads(inputs.get("competitor_data", "{}"))
    risk_d = json.loads(inputs.get("risk_data", "{}"))
    fin_d = json.loads(inputs.get("finance_data", "{}"))

    overall, breakdown = _calculate_weighted_score(idea_d, market_d, comp_d, risk_d, fin_d)

    if overall >= 82.0:
        readiness = "SEED READY 🚀"
        verdict = (
            f"Exceptional startup proposition. Demonstrated strong problem-solution clarity, "
            f"addressing a sizable addressable market ({market_d.get('tam', '$30B+')}) with defensive unit economics "
            f"and a manageable break-even runway of {fin_d.get('break_even_months', 12)} months. "
            f"Highly recommended for institutional Pre-Seed / Seed syndicate backing."
        )
    elif overall >= 72.0:
        readiness = "PROMISING MVP 📈"
        verdict = (
            f"Solid commercial foundation with compelling early differentiation. "
            f"Market fundamentals and unit economics are favorable, though early distribution strategy "
            f"and retention mechanics require de-risking before raising institutional capital."
        )
    elif overall >= 60.0:
        readiness = "EARLY CONCEPT 🔬"
        verdict = (
            f"Viable nascent concept requiring further customer discovery. "
            f"High competitive noise and operational friction require a narrower initial beachhead before scaling."
        )
    else:
        readiness = "HIGH RISK ⚠️"
        verdict = (
            f"High-friction opportunity. Substantial technical or regulatory hurdles combined with heavy incumbent moats. "
            f"Recommend fundamental pivot toward an underserved sub-segment before committing capital."
        )

    strengths = [
        f"Clear, urgent problem articulation addressing {idea_d.get('target_user', 'high-intent users')}",
        f"Significant market tailwinds in a {market_d.get('growth_rate', '18% CAGR')} growth category",
        f"Attractive software gross margins with {fin_d.get('monthly_burn_rate', '$3,500/mo')} disciplined burn rate"
    ]

    red_flags = [
        f"Competitive pressure from incumbents ({', '.join(comp_d.get('direct_competitors', ['legacy players'])[:2])})",
        f"Execution dependency: {risk_d.get('execution_challenges', ['scaling early organic customer acquisition'])[0]}"
    ]

    next_steps = [
        "Conduct 30 in-depth discovery interviews with the exact target persona to validate willingness-to-pay",
        f"Build lean interactive MVP focused purely on the single core feature for under {fin_d.get('estimated_startup_cost', '$30,000')}",
        "Secure first 10 paying pilot cohort members and benchmark Weekly Active Retention before opening Seed round"
    ]

    return {
        "run_id": run_id,
        "overall_score": overall,
        "score_breakdown": breakdown.model_dump(),
        "investment_readiness": readiness,
        "verdict": verdict,
        "key_strengths": strengths,
        "critical_red_flags": red_flags,
        "recommended_next_steps": next_steps
    }


def run_scoring_agent(
    idea: str,
    run_id: str,
    idea_data: dict,
    market_data: dict,
    competitor_data: dict,
    risk_data: dict,
    finance_data: dict
) -> dict:
    return run_agent_with_fallback(
        agent_name="scoring",
        prompt_template=prompt,
        inputs={
            "idea": idea,
            "run_id": run_id,
            "idea_data": json.dumps(idea_data),
            "market_data": json.dumps(market_data),
            "competitor_data": json.dumps(competitor_data),
            "risk_data": json.dumps(risk_data),
            "finance_data": json.dumps(finance_data)
        },
        output_schema=ScoringOutput,
        mock_generator_fn=_mock_scoring_generator
    )
