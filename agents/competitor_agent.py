import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import CompetitorOutput
from tenacity import retry, stop_after_attempt, wait_fixed

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.3
)

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a startup competitor analyst.
Analyze the competitors for the given startup idea.
IMPORTANT: Respond ONLY with valid JSON. No explanation, no markdown, no extra text.
JSON must follow this exact structure:
{{
  "direct_competitors": ["company1", "company2"],
  "indirect_competitors": ["alt1", "alt2"],
  "market_gap": "string explaining the gap",
  "swot": {{
    "strengths": ["s1", "s2"],
    "weaknesses": ["w1", "w2"],
    "opportunities": ["o1", "o2"],
    "threats": ["t1", "t2"]
  }},
  "competitive_advantage": "string"
}}"""),
    ("human", """Startup Idea: {idea}
Market Data: {market_data}
Analyze competitors and return JSON only.""")
])

# Retry decorator — 3 baar try karega, har baar 2 sec wait
@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def _call_llm(idea: str, market_data: str) -> str:
    chain = prompt | llm
    response = chain.invoke({
        "idea": idea,
        "market_data": market_data
    })
    return response.content.strip()

def _parse_json(raw_text: str) -> dict:
    # ```json wrapper hatao agar ho
    if "```" in raw_text:
        raw_text = raw_text.split("```")[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
    return json.loads(raw_text.strip())

def run_competitor_agent(idea: str, market_data: dict) -> dict:
    try:
        # LLM call karo — retry ke saath
        raw_text = _call_llm(idea, json.dumps(market_data))

        # JSON parse karo
        result_dict = _parse_json(raw_text)

        # Validate karo
        validated = CompetitorOutput(**result_dict)
        return validated.model_dump()

    except json.JSONDecodeError as e:
        return {"error": f"JSON parse failed: {str(e)}", "agent": "competitor"}
    except Exception as e:
        return {"error": f"Agent failed: {str(e)}", "agent": "competitor"}