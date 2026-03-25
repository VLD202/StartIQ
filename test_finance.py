from agents.finance_agent import run_finance_agent

mock_payload = {
    "idea": "AI tutor for class 10 students",
    "idea_data": {"feasibility_score": 8.2},
    "market_data": {"TAM": "$45B"},
    "competitor_data": {"direct_competitors": ["Byju's", "Khan Academy"]},
    "risk_data": {"risk_score": 6.5},
}

result = run_finance_agent(mock_payload)

print("\n=== Finance Agent Output ===")
for key, value in result.items():
    print(f"  {key}: {value}")