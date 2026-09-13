import json
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import FinanceOutput
from agents.base_agent import run_agent_with_fallback

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a venture capital chief financial officer and financial modeling analyst.
Construct a realistic early-stage unit economic assessment, cost structure, break-even timeline, and capitalization plan.

IMPORTANT: Respond ONLY with valid JSON. No explanation, no markdown backticks.
The JSON must adhere strictly to this schema:
{{
  "estimated_startup_cost": "$25,000 - $45,000",
  "monthly_burn_rate": "$3,500/mo",
  "revenue_streams": [
    "Tiered monthly SaaS subscription ($29/mo individual, $99/mo team)",
    "Usage-based overage fees for high-volume enterprise compute",
    "Annual enterprise licensing contracts with dedicated support"
  ],
  "pricing_model": "Freemium + Usage-based B2B Tiering",
  "break_even_months": 14,
  "funding_needed": "$75,000 - $150,000 Pre-Seed",
  "financial_score": 82.5,
  "financial_summary": "Favorable software gross margins (80%+) with manageable early server burn and fast path to cash flow sustainability."
}}
break_even_months must be an integer (e.g. 12 to 24).
financial_score must be a float between 0.0 and 100.0."""),
    ("human", """Startup Idea: {idea}
Market Context: {market_data}
Risk Analysis: {risk_data}

Model unit economics and funding requirements. Return JSON only.""")
])


def _mock_finance_generator(inputs: dict) -> dict:
    idea_text = inputs.get("idea", "").lower()

    if "tutor" in idea_text or "edu" in idea_text:
        cost = "$15,000 - $30,000"
        burn = "$2,400/mo"
        streams = [
            "Monthly recurring student subscriptions ($19.99/mo)",
            "Discounted annual access passes ($149/year)",
            "Institutional school campus license ($5,000/year/school)"
        ]
        pricing = "Consumer Freemium (5 free queries/day) with $20/mo Unlimited Pro"
        months = 11
        funding = "$50,000 Angel / Pre-Seed"
        score = 88.0
        summary = "Attractive consumer recurring software margins with low infrastructure overhead and swift break-even potential."
    elif "health" in idea_text or "med" in idea_text:
        cost = "$45,000 - $80,000"
        burn = "$6,500/mo"
        streams = [
            "Per-clinician monthly seat licenses ($199 - $349/provider/mo)",
            "Enterprise clinic volume packages with custom EHR connector onboarding ($15,000 setup)",
            "Specialty medical billing diagnostic coding add-on module"
        ]
        pricing = "Per-Physician Monthly B2B Subscription with 14-day clinical trial"
        months = 16
        funding = "$150,000 - $250,000 Pre-Seed"
        score = 84.0
        summary = "Exceptional customer lifetime value (LTV > $12,000/seat) easily offsets upfront HIPAA compliance and integration costs."
    else:
        cost = "$25,000 - $50,000"
        burn = "$3,800/mo"
        streams = [
            "Self-serve monthly SaaS subscriptions ($39/mo standard, $99/mo pro)",
            "Annual prepaid enterprise team workspace tier ($1,200/seat/year)",
            "API metered volume consumption charges"
        ]
        pricing = "Product-Led Tiered SaaS with 14-day Free Trial"
        months = 13
        funding = "$75,000 - $125,000 Pre-Seed"
        score = 83.0
        summary = "High gross margin profile (82%+) with lean cloud infrastructure and steady expansion paths."

    return {
        "estimated_startup_cost": cost,
        "monthly_burn_rate": burn,
        "revenue_streams": streams,
        "pricing_model": pricing,
        "break_even_months": months,
        "funding_needed": funding,
        "financial_score": score,
        "financial_summary": summary
    }


def run_finance_agent(idea: str, market_data: dict, competitor_data: dict, risk_data: dict) -> dict:
    return run_agent_with_fallback(
        agent_name="finance",
        prompt_template=prompt,
        inputs={
            "idea": idea,
            "market_data": json.dumps(market_data),
            "risk_data": json.dumps(risk_data)
        },
        output_schema=FinanceOutput,
        mock_generator_fn=_mock_finance_generator
    )
