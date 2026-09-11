import json
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import MarketOutput
from agents.base_agent import run_agent_with_fallback

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a senior startup market research partner and venture analyst.
Analyze the target market, market sizing (TAM/SAM/SOM), target audience, macro tailwinds, and growth rate.

IMPORTANT: Respond ONLY with valid JSON. No markdown backticks, no commentary.
The JSON must adhere strictly to this schema:
{{
  "tam": "$42B",
  "sam": "$7.8B",
  "som": "$380M",
  "target_audience": ["Segment A", "Segment B", "Segment C"],
  "market_trends": ["Trend 1 driving demand", "Trend 2 technology shift", "Trend 3 regulatory tailwind"],
  "growth_rate": "19.5% CAGR",
  "market_score": 82.0,
  "market_opportunity_summary": "Extensive expanding market propelled by structural digitisation tailwinds."
}}
TAM, SAM, SOM should be formatted with currency ($) and magnitude (B / M).
market_score must be a float between 0.0 and 100.0."""),
    ("human", """Startup Idea: {idea}
Idea Analysis: {idea_data}

Analyze the market opportunity and return JSON only.""")
])


def _mock_market_generator(inputs: dict) -> dict:
    idea_text = inputs.get("idea", "").lower()
    
    if "tutor" in idea_text or "edu" in idea_text or "student" in idea_text:
        tam = "$38B"
        sam = "$8.2B"
        som = "$420M"
        audience = [
            "K-12 STEM students seeking asynchronous test prep",
            "Undergraduate university students in challenging gateway courses",
            "EdTech-forward parents investing in supplemental education"
        ]
        trends = [
            "Rapid shift from static video content to dynamic conversational tutoring",
            "Rising global demand for standardized STEM mastery and remote learning support",
            "Increasing willingness of households to pay for AI-augmented academic tools"
        ]
        growth = "17.8% CAGR"
        score = 86.0
        summary = "Global EdTech tutoring market is accelerating with significant headroom for personalized adaptive instruction."
    elif "health" in idea_text or "med" in idea_text:
        tam = "$54B"
        sam = "$11.5B"
        som = "$650M"
        audience = [
            "Independent primary care and specialty medical clinics",
            "Regional hospital networks seeking administrative cost reduction",
            "Telehealth operators scaling asynchronous consultation volumes"
        ]
        trends = [
            "Severe physician burnout driving aggressive enterprise automation adoption",
            "Regulatory reforms supporting AI-assisted documentation and interoperability",
            "Transition toward value-based care requiring granular encounter data"
        ]
        growth = "23.4% CAGR"
        score = 89.0
        summary = "Digital healthcare productivity is an urgent priority with exceptional recurring enterprise spend."
    else:
        tam = "$45B"
        sam = "$6.5B"
        som = "$350M"
        audience = [
            "Digital-first small and medium enterprises",
            "High-growth technology startups and distributed knowledge workers",
            "Enterprise innovation teams piloting workflow automation"
        ]
        trends = [
            "Consolidation of fragmented software stacks into intelligent unified platforms",
            "Increasing adoption of generative autonomy in daily business operations",
            "Consumerization of B2B user experiences demanding intuitive self-serve tools"
        ]
        growth = "18.2% CAGR"
        score = 83.5
        summary = "Strong secular market expansion supported by enterprise demand for modernized operational tooling."

    return {
        "tam": tam,
        "sam": sam,
        "som": som,
        "target_audience": audience,
        "market_trends": trends,
        "growth_rate": growth,
        "market_score": score,
        "market_opportunity_summary": summary
    }


def run_market_agent(idea: str, idea_data: dict) -> dict:
    return run_agent_with_fallback(
        agent_name="market",
        prompt_template=prompt,
        inputs={"idea": idea, "idea_data": json.dumps(idea_data)},
        output_schema=MarketOutput,
        mock_generator_fn=_mock_market_generator
    )
