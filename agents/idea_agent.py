import json
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import IdeaOutput
from agents.base_agent import run_agent_with_fallback

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an elite Silicon Valley venture scout and startup idea analyst.
Analyze the provided startup idea for problem severity, solution viability, clarity, and innovation.

IMPORTANT: Respond ONLY with valid JSON. No markdown backticks, no commentary.
The JSON must adhere strictly to this schema:
{{
  "problem_statement": "Clear articulation of the acute customer pain point",
  "solution_summary": "Concise overview of how the startup solves this problem",
  "target_user": "Specific description of the initial ideal customer profile (ICP)",
  "feasibility_score": 8.5,
  "clarity_score": 9.0,
  "innovation_level": 8.0,
  "idea_score": 85.0,
  "initial_verdict": "High-conviction concept with strong initial product-market indicators"
}}
All scores must be numerical (feasibility, clarity, innovation: 0.0 to 10.0; idea_score: 0.0 to 100.0)."""),
    ("human", "Startup Idea: {idea}\n\nAnalyze the startup idea and return JSON only.")
])


def _mock_idea_generator(inputs: dict) -> dict:
    idea_text = inputs.get("idea", "Innovative startup idea")
    lower = idea_text.lower()
    
    if "tutor" in lower or "edu" in lower or "learn" in lower or "student" in lower:
        target = "High school and undergraduate students needing personalized guidance"
        problem = "Standardized curricula fail to adapt to individual learning paces, leading to comprehension gaps and high tutoring costs."
        solution = "An adaptive AI-driven tutor that diagnoses knowledge gaps in real-time, delivering personalized explanations and practice."
        feasibility = 8.8
        clarity = 9.2
        innovation = 8.1
        score = 87.0
        verdict = "Strong product-market alignment in EdTech with rapid organic adoption potential."
    elif "health" in lower or "med" in lower or "doctor" in lower or "patient" in lower:
        target = "Outpatient clinics, independent practitioners, and chronic care patients"
        problem = "Physicians spend up to 40% of their day on repetitive administrative charting and manual patient triage, leading to burnout."
        solution = "An ambient clinical AI co-pilot that transcribes patient encounters, formats structured EHR records, and flags diagnostic insights."
        feasibility = 8.2
        clarity = 9.0
        innovation = 8.7
        score = 86.5
        verdict = "High-impact HealthTech solution with massive operational ROI for healthcare providers."
    elif "fin" in lower or "pay" in lower or "money" in lower or "crypto" in lower:
        target = "Freelancers, global remote workers, and cross-border digital agencies"
        problem = "High cross-border remittance fees (3-7%), multi-day settlement delays, and fragmented compliance documentation."
        solution = "Unified global treasury platform offering instant zero-spread multi-currency payouts and automated tax withholding."
        feasibility = 8.4
        clarity = 8.9
        innovation = 8.5
        score = 86.0
        verdict = "Compelling FinTech solution tackling tangible friction in international payments."
    else:
        target = "Early-adopter professionals and mid-market teams seeking workflow efficiency"
        problem = f"Legacy tools in this domain remain fragmented and manual, creating operational inefficiencies for users pursuing {idea_text[:60]}."
        solution = f"A streamlined intelligent platform automating core workflows with automated insight generation for {idea_text[:60]}."
        feasibility = 8.5
        clarity = 8.8
        innovation = 8.2
        score = 85.0
        verdict = "Promising foundational premise with distinct competitive leverage if executed cleanly."

    return {
        "problem_statement": problem,
        "solution_summary": solution,
        "target_user": target,
        "feasibility_score": feasibility,
        "clarity_score": clarity,
        "innovation_level": innovation,
        "idea_score": score,
        "initial_verdict": verdict
    }


def run_idea_agent(idea: str) -> dict:
    return run_agent_with_fallback(
        agent_name="idea",
        prompt_template=prompt,
        inputs={"idea": idea},
        output_schema=IdeaOutput,
        mock_generator_fn=_mock_idea_generator
    )
