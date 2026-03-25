import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from schemas.models import FinanceOutput
from tenacity import retry, stop_after_attempt, wait_fixed

# Load environment variables
load_dotenv()

# Initialize LLM
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.2
)

# Prompt template
prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are a startup financial analyst. "
        "Respond ONLY with valid JSON. No explanation. "
        "Use the exact keys: "
        "estimated_monthly_cost, "
        "projected_monthly_revenue, "
        "monthly_burn, "
        "break_even_months, "
        "funding_required, "
        "revenue_model, "
        "financial_feasibility_score."
    ),
    (
        "human",
        """Startup Idea: {idea}
Idea Analysis: {idea_data}
Market Data: {market_data}
Competitor Data: {competitor_data}
Risk Data: {risk_data}

Return JSON only."""
    )
])

# Retry LLM call if it fails
@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def _call_llm(payload: dict) -> str:
    chain = prompt | llm
    response = chain.invoke(payload)
    return response.content.strip()

# Clean and parse JSON safely
def _parse_json(raw_text: str) -> dict:
    raw_text = raw_text.replace("```json", "").replace("```", "")
    return json.loads(raw_text.strip())

# Main agent function
def run_finance_agent(payload: dict) -> dict:
    raw_text = _call_llm(payload)
    result_dict = _parse_json(raw_text)

    # Validate with Pydantic schema
    validated = FinanceOutput(**result_dict)

    return validated.model_dump()