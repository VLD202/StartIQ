import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import RiskOutput
from tenacity import retry, stop_after_attempt, wait_fixed

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.2
)

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a startup risk analyst.
Evaluate the risk and innovation level for the given startup.
IMPORTANT: Respond ONLY with valid JSON. No explanation, no markdown.
JSON must follow this exact structure:
{{
  "risk_score": 6.5,
  "innovation_uniqueness": 7.8,
  "execution_challenges": ["challenge1", "challenge2"],
  "mitigation_strategies": ["strategy1", "strategy2"],
  "overall_risk_level": "Medium",
  "innovation_summary": "string describing innovation"
}}"""),
    ("human", """Startup Idea: {idea}
Competitor Analysis: {competitor_data}
Assess risk and innovation. Return JSON only.""")
])

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def _call_llm(idea: str, competitor_data: str) -> str:
    chain = prompt | llm
    response = chain.invoke({
        "idea": idea,
        "competitor_data": competitor_data
    })
    return response.content.strip()

def _parse_json(raw_text: str) -> dict:
    if "```" in raw_text:
        raw_text = raw_text.split("```")[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
    return json.loads(raw_text.strip())

def run_risk_agent(idea: str, competitor_data: dict) -> dict:
    try:
        raw_text = _call_llm(idea, json.dumps(competitor_data))
        result_dict = _parse_json(raw_text)
        validated = RiskOutput(**result_dict)
        return validated.model_dump()

    except json.JSONDecodeError as e:
        return {"error": f"JSON parse failed: {str(e)}", "agent": "risk"}
    except Exception as e:
        return {"error": f"Agent failed: {str(e)}", "agent": "risk"}