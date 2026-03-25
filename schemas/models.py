from pydantic import BaseModel, Field, model_validator


class FinanceOutput(BaseModel):
    estimated_monthly_cost: float = Field(
        gt=0,
        description="Realistic monthly operating cost in USD. Must be positive."
    )
    projected_monthly_revenue: float = Field(
        ge=0,
        description="Projected monthly revenue in USD at steady state."
    )
    monthly_burn: float = Field(
        ge=0,
        description=(
            "Net cash burned per month (costs - revenue). "
            "Must be >= 0; use 0 if revenue already covers costs."
        )
    )
    break_even_months: int = Field(
        gt=0,
        description=(
            "Number of months until the startup breaks even. "
            "Must be a positive integer. "
            "If break-even is not achievable, the agent raises an error."
        )
    )
    funding_required: float = Field(
        ge=0,
        description="Total funding required in USD to reach break-even."
    )
    revenue_model: str = Field(
        min_length=5,
        description="A short description of the revenue model (e.g. SaaS subscription, freemium)."
    )
    financial_feasibility_score: float = Field(
        ge=0.0,
        le=10.0,
        description="A score from 0 to 10 indicating overall financial feasibility."
    )

    @model_validator(mode="after")
    def validate_business_logic(self) -> "FinanceOutput":
        # monthly_burn should equal cost - revenue when revenue < cost
        expected_burn = max(
            0.0,
            self.estimated_monthly_cost - self.projected_monthly_revenue
        )
        tolerance = self.estimated_monthly_cost * 0.15   # allow 15 % drift from LLM rounding
        if abs(self.monthly_burn - expected_burn) > tolerance:
            # Silently correct rather than reject — LLM rounding errors are common
            self.monthly_burn = round(expected_burn, 2)

        # funding_required should roughly cover burn until break-even
        implied_funding = round(self.monthly_burn * self.break_even_months, 2)
        funding_tolerance = implied_funding * 0.30      # allow 30 % overhead (team, infra)
        if self.funding_required < implied_funding - funding_tolerance:
            raise ValueError(
                f"funding_required ({self.funding_required}) seems too low. "
                f"Expected at least ~{implied_funding:.2f} based on burn × break_even_months."
            )

        # Raise an explicit error if break-even looks unachievable
        if self.projected_monthly_revenue == 0 and self.financial_feasibility_score < 2.0:
            raise ValueError(
                "Break-even is not achievable: projected revenue is 0 and "
                "feasibility score is critically low. Revisit the startup idea inputs."
            )

        return self