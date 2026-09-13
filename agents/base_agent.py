import os
import re
import json
import logging
from typing import Dict, Any, Optional, Type
from dotenv import load_dotenv
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt, wait_fixed

load_dotenv()
logger = logging.getLogger("startiq.agents")

# Extract JSON block helper
def extract_json_from_text(raw_text: str) -> Dict[str, Any]:
    text = raw_text.strip()
    
    # Strip markdown ```json ... ``` or ``` ... ```
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            trimmed = part.strip()
            if trimmed.startswith("json"):
                trimmed = trimmed[4:].strip()
            if trimmed.startswith("{") and trimmed.endswith("}"):
                text = trimmed
                break
                
    # Fallback to finding outermost { ... }
    if not (text.startswith("{") and text.endswith("}")):
        start_idx = text.find("{")
        end_idx = text.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            text = text[start_idx:end_idx + 1]
            
    return json.loads(text)


def get_llm():
    groq_api_key = os.getenv("GROQ_API_KEY", "").strip()
    if groq_api_key:
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(
                api_key=groq_api_key,
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                max_retries=2
            )
        except Exception as e:
            logger.warning(f"Failed to initialize ChatGroq: {e}")
            return None
    return None


@retry(stop=stop_after_attempt(3), wait=wait_fixed(2), reraise=True)
def invoke_llm_chain(chain, inputs: Dict[str, Any]) -> str:
    response = chain.invoke(inputs)
    return response.content.strip()


def run_agent_with_fallback(
    agent_name: str,
    prompt_template,
    inputs: Dict[str, Any],
    output_schema: Type[BaseModel],
    mock_generator_fn
) -> Dict[str, Any]:
    """
    Executes an agent with prompt template, parses JSON, and validates with Pydantic.
    Falls back to high-fidelity mock generator if API key is not set or LLM fails.
    """
    llm = get_llm()
    
    if llm is not None:
        try:
            chain = prompt_template | llm
            raw_output = invoke_llm_chain(chain, inputs)
            parsed_dict = extract_json_from_text(raw_output)
            validated = output_schema(**parsed_dict)
            return validated.model_dump()
        except Exception as e:
            logger.warning(f"Agent '{agent_name}' LLM execution failed ({e}). Falling back to Mock Engine.")
            
    # Mock fallback
    mock_data = mock_generator_fn(inputs)
    validated = output_schema(**mock_data)
    return validated.model_dump()
