import json
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import CompetitorOutput
from agents.base_agent import run_agent_with_fallback

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an aggressive corporate intelligence and startup competitive strategist.
Map out direct and indirect competitors, dissect the competitive moat, identify market gaps, and construct a comprehensive SWOT matrix.

IMPORTANT: Respond ONLY with valid JSON. No explanation, no markdown backticks.
The JSON must adhere strictly to this schema:
{{
  "direct_competitors": ["Company A", "Company B", "Company C"],
  "indirect_competitors": ["Alternative 1", "Alternative 2"],
  "market_gap": "Clear description of what incumbents fail to offer",
  "swot": {{
    "strengths": ["Proprietary technological edge", "Frictionless UX"],
    "weaknesses": ["Unproven early brand awareness", "Initial data flywheel cold start"],
    "opportunities": ["Expansion into adjacent mid-market tiers", "Strategic API integrations"],
    "threats": ["Incumbent feature copying", "Downward margin pressure"]
  }},
  "competitive_advantage": "Core defensive moat or defensibility factor",
  "competitor_score": 78.5,
  "threat_level": "Medium"
}}
competitor_score must be a float between 0.0 and 100.0.
threat_level must be one of: "Low", "Medium", "High"."""),
    ("human", """Startup Idea: {idea}
Market Context: {market_data}

Analyze competitive positioning, SWOT, and defensibility. Return JSON only.""")
])


def _mock_competitor_generator(inputs: dict) -> dict:
    idea_text = inputs.get("idea", "").lower()

    if "tutor" in idea_text or "edu" in idea_text:
        direct = ["Khan Academy (Khanmigo)", "Chegg Study", "Photomath / Brainly"]
        indirect = ["Private Human Tutors", "YouTube Explanatory Channels", "Coursera / Quizlet"]
        gap = "Incumbents provide static Q&A or surface-level chatbots rather than continuous diagnostic Socratic learning."
        swot = {
            "strengths": [
                "Real-time diagnostic Socratic feedback engine",
                "Frictionless conversational interface tuned for student patience",
                "Significantly lower price point than human private tutoring"
            ],
            "weaknesses": [
                "Requires student self-discipline for long study sessions",
                "Early lack of institutional school board certifications"
            ],
            "opportunities": [
                "B2B school district licensing for after-school remediation",
                "Integration with mainstream LMS platforms (Canvas, Google Classroom)"
            ],
            "threats": [
                "Commoditization of generic LLM web interfaces by foundational model providers",
                "Academic integrity controversies and restrictive school firewall policies"
            ]
        }
        moat = "Fine-tuned pedagogical pacing algorithms and proprietary mistake-pattern knowledge graph."
        threat = "Medium"
        score = 81.0
    elif "health" in idea_text or "med" in idea_text:
        direct = ["Abridge", "Ambience Healthcare", "Suki.ai"]
        indirect = ["Traditional Medical Dictation (Dragon)", "Human Scribes", "Manual EHR typing"]
        gap = "Existing scribes focus purely on basic note transcription without predictive clinical coding or proactive diagnostic checks."
        swot = {
            "strengths": [
                "Sub-second structured charting reducing physician admin time by 75%",
                "Multi-specialty ontology support with high accuracy on accents and medical jargon",
                "Lightweight zero-install browser extension workflow"
            ],
            "weaknesses": [
                "High liability burden requiring strict human-in-the-loop review",
                "Lengthy enterprise hospital procurement cycles"
            ],
            "opportunities": [
                "Direct EHR vendor marketplace distribution partnerships",
                "Expansion into post-consultation patient instructions and follow-up reminders"
            ],
            "threats": [
                "Epic Systems or Oracle Health building native ambient scribing into EHR suites",
                "Evolving HIPAA and medical malpractice liability laws"
            ]
        }
        moat = "Deep workflow integration and proprietary multi-speaker clinical acoustic models."
        threat = "High"
        score = 79.0
    else:
        direct = ["Incumbent Enterprise Suite X", "Legacy Platform Y", "Point Solution Z"]
        indirect = ["Spreadsheets & Manual Scripts", "In-house Custom Tooling", "Offshore Outsourcing"]
        gap = "Legacy tools are clunky, multi-click, and slow, failing to harness modern autonomous AI agents."
        swot = {
            "strengths": [
                "Modern intuitive glassmorphism UX designed for speed",
                "Modular agent architecture delivering instant time-to-value",
                "Extensible developer API and webhook integration ecosystem"
            ],
            "weaknesses": [
                "Initial brand trust deficit compared to decade-old incumbents",
                "Resource constraints compared to heavily funded venture competitors"
            ],
            "opportunities": [
                "Capturing underserved SMB and mid-market cohorts overlooked by enterprise vendors",
                "Building viral bottoms-up developer and team adoption loops"
            ],
            "threats": [
                "Fast-follower copies from venture-backed competitors",
                "Prolonged enterprise IT review and security clearance hurdles"
            ]
        }
        moat = "Speed of feature iteration and hyper-personalized user workflow graph."
        threat = "Medium"
        score = 77.5

    return {
        "direct_competitors": direct,
        "indirect_competitors": indirect,
        "market_gap": gap,
        "swot": swot,
        "competitive_advantage": moat,
        "competitor_score": score,
        "threat_level": threat
    }


def run_competitor_agent(idea: str, market_data: dict) -> dict:
    return run_agent_with_fallback(
        agent_name="competitor",
        prompt_template=prompt,
        inputs={"idea": idea, "market_data": json.dumps(market_data)},
        output_schema=CompetitorOutput,
        mock_generator_fn=_mock_competitor_generator
    )