import os
import json
import logging
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import ValidationError
from tenacity import retry, stop_after_attempt, wait_fixed, RetryError

from schemas.models import FinanceOutput

load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")

# LLM setup
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.2,
)

# Prompt  — explicit numeric guardrails reduce hallucinated figures
SYSTEM_PROMPT = """
You are a senior startup financial analyst. Your job is to produce REALISTIC,
internally consistent financial projections for early-stage startups.

Rules you MUST follow:
1. Respond ONLY with a valid JSON object — no prose, no markdown fences.
2. Use ONLY these exact keys:
   - estimated_monthly_cost      (float, USD, > 0)
   - projected_monthly_revenue   (float, USD, >= 0)
   - monthly_burn                (float, = max(0, cost - revenue))
   - break_even_months           (integer, > 0; how many months to break even)
   - funding_required            (float, USD, >= monthly_burn × break_even_months)
   - revenue_model               (string, e.g. "SaaS subscription at $15/user/month")
   - financial_feasibility_score (float, 0.0 – 10.0)
3. Numbers must be REALISTIC for an early-stage startup:
   - estimated_monthly_cost: typically $2,000 – $50,000 for seed stage.
   - projected_monthly_revenue: based on realistic user/customer growth, NOT wishful thinking.
   - break_even_months: typically 12 – 48 months for most B2C / B2B SaaS ideas.
   - financial_feasibility_score: 7+ only if the market, margins, and model are strong.
4. monthly_burn MUST equal max(0, estimated_monthly_cost - projected_monthly_revenue).
5. funding_required MUST be >= monthly_burn × break_even_months.
6. Do NOT invent data not implied by the inputs.
""".strip()

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", (
        "Startup Idea: {idea}\n"
        "Idea Analysis: {idea_data}\n"
        "Market Data: {market_data}\n"
        "Competitor Data: {competitor_data}\n"
        "Risk Data: {risk_data}\n\n"
        "Return a single JSON object only."
    )),
])

# LLM call — retried up to 3 times on failures
@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def _call_llm(payload: dict) -> str:
    chain = prompt | llm
    response = chain.invoke(payload)
    raw = response.content.strip()
    if not raw:
        raise ValueError("LLM returned an empty response.")
    return raw


# JSON extraction — handles fenced and bare JSON
def _extract_json(raw_text: str) -> dict:
    """
    Robustly extract a JSON object from LLM output.
    Handles:
      - Bare JSON
      - ```json ... ``` fences
      - ``` ... ``` fences
      - Leading/trailing prose with an embedded JSON object
    """
    text = raw_text.strip()

    # 1. Try direct parse first (fastest path)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 2. Strip markdown fences
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            candidate = part.strip()
            if candidate.startswith("json"):
                candidate = candidate[4:].strip()
            try:
                return json.loads(candidate)
            except json.JSONDecodeError:
                continue

    # 3. Find the first {...} block in the text
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            pass

    raise ValueError(
        f"Could not extract valid JSON from LLM output.\nRaw output:\n{raw_text}"
    )

def _sanity_check(data: dict) -> dict:
    """
    Coerce obvious LLM mistakes before Pydantic sees the data.
    Raises ValueError for unrecoverable issues.
    """
    required_keys = {
        "estimated_monthly_cost",
        "projected_monthly_revenue",
        "monthly_burn",
        "break_even_months",
        "funding_required",
        "revenue_model",
        "financial_feasibility_score",
    }
    missing = required_keys - data.keys()
    if missing:
        raise ValueError(f"LLM response is missing required keys: {missing}")

    # Coerce numeric fields
    for key in required_keys - {"revenue_model"}:
        try:
            data[key] = float(data[key]) if key != "break_even_months" else int(data[key])
        except (TypeError, ValueError) as exc:
            raise ValueError(f"Field '{key}' has non-numeric value: {data[key]}") from exc

    # Correct monthly_burn if LLM got it wrong
    expected_burn = max(
        0.0,
        data["estimated_monthly_cost"] - data["projected_monthly_revenue"],
    )
    data["monthly_burn"] = round(expected_burn, 2)

    # Raise if break_even_months is non-positive (unachievable signal)
    if data["break_even_months"] <= 0:
        raise ValueError(
            "break_even_months must be a positive integer. "
            "If break-even is not achievable with the given inputs, "
            "reconsider the startup parameters."
        )

    # Clamp feasibility score
    data["financial_feasibility_score"] = max(
        0.0, min(10.0, float(data["financial_feasibility_score"]))
    )

    return data


# Public entry point
def run_finance_agent(payload: dict) -> dict:
    """
    Run the finance agent pipeline.

    Args:
        payload: dict with keys — idea, idea_data, market_data,
                 competitor_data, risk_data.

    Returns:
        Validated FinanceOutput as a plain dict.

    Raises:
        ValueError: if the LLM output cannot be parsed or validated.
        RuntimeError: if all LLM retry attempts are exhausted.
    """
    required_payload_keys = {"idea", "idea_data", "market_data", "competitor_data", "risk_data"}
    missing = required_payload_keys - payload.keys()
    if missing:
        raise ValueError(f"Payload is missing required keys: {missing}")

    # Step 1 — call LLM
    try:
        raw_text = _call_llm(payload)
    except RetryError as exc:
        raise RuntimeError(
            "Finance agent failed after 3 LLM attempts. Check your API key and network."
        ) from exc

    logger.info("Raw LLM output:\n%s", raw_text)

    # Step 2 — extract JSON
    try:
        raw_dict = _extract_json(raw_text)
    except ValueError as exc:
        logger.error("JSON extraction failed: %s", exc)
        raise

    logger.info("Extracted dict: %s", raw_dict)

    # Step 3 — sanity checks
    try:
        raw_dict = _sanity_check(raw_dict)
    except ValueError as exc:
        logger.error("Sanity check failed: %s", exc)
        raise

    # Step 4 — Pydantic validation
    try:
        validated = FinanceOutput(**raw_dict)
    except ValidationError as exc:
        logger.error("Pydantic validation failed:\n%s", exc)
        raise ValueError(f"Financial output failed validation:\n{exc}") from exc

    return validated.model_dump()