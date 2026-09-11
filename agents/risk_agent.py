import json
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import RiskOutput
from agents.base_agent import run_agent_with_fallback

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a ruthless startup risk manager and technology diligence auditor.
Critique the proposed startup for technical barriers, regulatory hurdles, execution friction, and defensibility.

IMPORTANT: Respond ONLY with valid JSON. No explanation, no markdown backticks.
The JSON must adhere strictly to this schema:
{{
  "risk_score": 5.8,
  "overall_risk_level": "Medium",
  "innovation_uniqueness": 8.2,
  "execution_challenges": [
    "Challenge 1 regarding distribution or product complexity",
    "Challenge 2 regarding unit economics or retention"
  ],
  "regulatory_risks": [
    "Regulatory risk 1 regarding data privacy or compliance"
  ],
  "mitigation_strategies": [
    "Actionable tactic 1 to minimize challenge 1",
    "Actionable tactic 2 to de-risk challenge 2"
  ],
  "innovation_summary": "Concise summary of why the innovation is defensible despite risks"
}}
risk_score must be between 0.0 and 10.0 (where lower means lower risk, 10 is catastrophic risk).
overall_risk_level must be "Low", "Medium", or "High".
innovation_uniqueness must be between 0.0 and 10.0."""),
    ("human", """Startup Idea: {idea}
Competitor & SWOT Context: {competitor_data}

Audit technical, operational, and regulatory risks. Return JSON only.""")
])


def _mock_risk_generator(inputs: dict) -> dict:
    idea_text = inputs.get("idea", "").lower()

    if "tutor" in idea_text or "edu" in idea_text:
        risk = 4.8
        level = "Low"
        uniqueness = 8.4
        challenges = [
            "Student churn during summer breaks and post-exam lulls",
            "Model hallucination risks in high-stakes subjects like organic chemistry or calculus",
            "Customer acquisition cost (CAC) inflation via direct-to-consumer social channels"
        ]
        regulatory = [
            "COPPA compliance for underage students under 13",
            "FERPA compliance if integrating directly with educational institutions"
        ]
        mitigations = [
            "Implement deterministic formula validation guardrails alongside conversational LLM",
            "Build student peer-study streaks and annual discounted subscription billing to combat seasonal churn",
            "Partner with campus ambassador student networks to maintain organic CAC below $15"
        ]
        summary = "Technically feasible with well-understood compliance paths; principal risk lies in retention."
    elif "health" in idea_text or "med" in idea_text:
        risk = 6.8
        level = "High"
        uniqueness = 8.9
        challenges = [
            "Zero-tolerance error threshold for clinical hallucination in clinical documentation",
            "Prolonged sales cycles (6 to 18 months) when selling to health systems",
            "High integration friction with fragmented, legacy on-premise EHR database schemas"
        ]
        regulatory = [
            "Strict HIPAA and BAA compliance requirements with end-to-end encrypted storage",
            "FDA software-as-a-medical-device (SaMD) scope review for diagnostic suggestions"
        ]
        mitigations = [
            "Mandatory physician signature review loop before notes are pushed into EHR records",
            "Target agile private clinics first to build reference case studies before hospital RFP pitches",
            "Adopt standard FHIR and SMART-on-FHIR connector protocols for universal integration"
        ]
        summary = "Substantial regulatory and sales friction, but accompanied by extremely high barriers to entry once deployed."
    else:
        risk = 5.2
        level = "Medium"
        uniqueness = 7.9
        challenges = [
            "Maintaining active daily user engagement beyond novelty onboarding",
            "API dependency risks and token unit economics scaling as user queries spike",
            "Distribution channel overcrowding in B2B inbound search and paid ads"
        ]
        regulatory = [
            "GDPR / CCPA user data retention and right-to-be-forgotten compliance",
            "IP and copyright terms of service regarding AI-generated output ownership"
        ]
        mitigations = [
            "Embed continuous workflow triggers into daily Slack/email notifications to drive habits",
            "Implement multi-tier prompt caching and hybrid small-model routing to optimize inference margins",
            "Focus on product-led growth (PLG) viral referral loops to build deflated organic CAC"
        ]
        summary = "Balanced operational risk profile with manageable regulatory overhead and solid execution paths."

    return {
        "risk_score": risk,
        "overall_risk_level": level,
        "innovation_uniqueness": uniqueness,
        "execution_challenges": challenges,
        "regulatory_risks": regulatory,
        "mitigation_strategies": mitigations,
        "innovation_summary": summary
    }


def run_risk_agent(idea: str, competitor_data: dict) -> dict:
    return run_agent_with_fallback(
        agent_name="risk",
        prompt_template=prompt,
        inputs={"idea": idea, "competitor_data": json.dumps(competitor_data)},
        output_schema=RiskOutput,
        mock_generator_fn=_mock_risk_generator
    )