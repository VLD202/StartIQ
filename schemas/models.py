from pydantic import BaseModel

class FinanceOutput(BaseModel):
    estimated_monthly_cost: float
    projected_monthly_revenue: float
    monthly_burn: float
    break_even_months: int
    funding_required: float
    revenue_model: str
    financial_feasibility_score: float