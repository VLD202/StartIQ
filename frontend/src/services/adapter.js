import { MOCK } from "../utils/constants";

/**
 * Normalizes API response from StartIQ backend into the dashboard structure.
 * Supports both flattened responses and full 6-agent report payloads.
 */
export function adaptEvaluationResult(raw) {
  if (!raw) return MOCK;

  // If already matches frontend structure
  if (raw.overall_score && raw.problem_statement && raw.swot && raw.swot.strengths) {
    return {
      ...MOCK,
      ...raw,
      swot: {
        strengths: raw.swot?.strengths || MOCK.swot.strengths,
        weaknesses: raw.swot?.weaknesses || MOCK.swot.weaknesses,
        opportunities: raw.swot?.opportunities || MOCK.swot.opportunities,
        threats: raw.swot?.threats || MOCK.swot.threats,
      },
      direct_competitors: raw.direct_competitors || MOCK.direct_competitors,
      indirect_competitors: raw.indirect_competitors || MOCK.indirect_competitors,
      market_trends: raw.market_trends || MOCK.market_trends,
      execution_challenges: raw.execution_challenges || MOCK.execution_challenges,
      mitigation_strategies: raw.mitigation_strategies || MOCK.mitigation_strategies,
    };
  }

  // StartIQ 6-Agent pipeline output (Node orchestrator or FastAPI)
  const idea = raw.idea_data || {};
  const market = raw.market_data || {};
  const comp = raw.competitor_data || {};
  const risk = raw.risk_data || {};
  const fin = raw.finance_data || {};
  const scoring = raw.scoring_data || {};
  const breakdown = scoring.score_breakdown || {};

  let yoy = "28";
  if (market.growth_rate) {
    const match = String(market.growth_rate).match(/[\d.]+/);
    if (match) yoy = match[0];
  }

  return {
    overall_score:
      scoring.overall_score != null
        ? Math.round(scoring.overall_score * 10) / 10
        : (raw.overall_score ?? 78.5),
    rating: scoring.investment_readiness || raw.rating || "Seed Ready 🌱",
    idea: Math.round(breakdown.idea ?? idea.idea_score ?? 85),
    market: Math.round(breakdown.market ?? market.market_score ?? 76),
    finance: Math.round(breakdown.finance ?? fin.financial_score ?? 72),
    risk: Math.round(breakdown.risk ?? (10 - (risk.risk_score || 5)) * 10),
    competitor: Math.round(breakdown.competitor ?? comp.competitor_score ?? 70),
    problem_statement: idea.problem_statement || MOCK.problem_statement,
    solution_summary: idea.solution_summary || MOCK.solution_summary,
    target_users:
      idea.target_user ||
      (Array.isArray(market.target_audience)
        ? market.target_audience.join(", ")
        : MOCK.target_users),
    innovation_level: idea.innovation_level ?? MOCK.innovation_level,
    feasibility_score: idea.feasibility_score ?? MOCK.feasibility_score,
    clarity_score: idea.clarity_score ?? MOCK.clarity_score,
    TAM: market.tam || market.TAM || MOCK.TAM,
    SAM: market.sam || market.SAM || MOCK.SAM,
    SOM: market.som || market.SOM || MOCK.SOM,
    yoy_growth: yoy,
    market_trends:
      Array.isArray(market.market_trends) && market.market_trends.length > 0
        ? market.market_trends
        : MOCK.market_trends,
    key_insight: market.market_opportunity_summary || MOCK.key_insight,
    direct_competitors:
      Array.isArray(comp.direct_competitors) && comp.direct_competitors.length > 0
        ? comp.direct_competitors
        : MOCK.direct_competitors,
    indirect_competitors:
      Array.isArray(comp.indirect_competitors) && comp.indirect_competitors.length > 0
        ? comp.indirect_competitors
        : MOCK.indirect_competitors,
    market_gap: comp.market_gap || MOCK.market_gap,
    swot: {
      strengths: comp.swot?.strengths?.length
        ? comp.swot.strengths
        : MOCK.swot.strengths,
      weaknesses: comp.swot?.weaknesses?.length
        ? comp.swot.weaknesses
        : MOCK.swot.weaknesses,
      opportunities: comp.swot?.opportunities?.length
        ? comp.swot.opportunities
        : MOCK.swot.opportunities,
      threats: comp.swot?.threats?.length
        ? comp.swot.threats
        : MOCK.swot.threats,
    },
    risk_score: risk.risk_score ?? MOCK.risk_score,
    innovation_uniqueness:
      risk.innovation_uniqueness ?? MOCK.innovation_uniqueness,
    overall_risk_level: risk.overall_risk_level || MOCK.overall_risk_level,
    execution_challenges:
      Array.isArray(risk.execution_challenges) && risk.execution_challenges.length > 0
        ? risk.execution_challenges
        : MOCK.execution_challenges,
    mitigation_strategies:
      Array.isArray(risk.mitigation_strategies) && risk.mitigation_strategies.length > 0
        ? risk.mitigation_strategies
        : MOCK.mitigation_strategies,
    monthly_costs: fin.monthly_burn_rate || MOCK.monthly_costs,
    monthly_costs_growth: MOCK.monthly_costs_growth,
    revenue_potential: fin.revenue_potential || MOCK.revenue_potential,
    revenue_potential_growth: MOCK.revenue_potential_growth,
    break_even_time: fin.break_even_months ? `${fin.break_even_months} Months` : MOCK.break_even_time,
    break_even_margin: MOCK.break_even_margin,
    funding_requirements: fin.funding_needed || MOCK.funding_requirements,
    funding_stage: MOCK.funding_stage,
    revenue_projection_breakdown: MOCK.revenue_projection_breakdown,
    revenue_simulation: MOCK.revenue_simulation,
    target_valuation: MOCK.target_valuation,
    runway_months: MOCK.runway_months,
    ltv_cac: MOCK.ltv_cac,
    gross_margin: MOCK.gross_margin,
    challenges_breakdown: MOCK.challenges_breakdown,
    uniqueness_breakdown: MOCK.uniqueness_breakdown,
    market_details_series: MOCK.market_details_series,
    market_tam_penetration: MOCK.market_tam_penetration,
    market_tam_multiplier: MOCK.market_tam_multiplier,
    market_sam_reference: MOCK.market_sam_reference,
    market_sam_multiplier: MOCK.market_sam_multiplier,
    market_som_rate: MOCK.market_som_rate,
    market_som_volume: MOCK.market_som_volume,
    target_audience_segments:
      Array.isArray(market.target_audience) && market.target_audience.length > 0
        ? market.target_audience
        : MOCK.target_audience_segments,
    idea_target_metrics: MOCK.idea_target_metrics,
    idea_clarity_metrics: MOCK.idea_clarity_metrics,
    feasibility_points: MOCK.feasibility_points,
    innovation_points: MOCK.innovation_points,
    direct_competitors_detailed: MOCK.direct_competitors_detailed,
    indirect_competitors_detailed: MOCK.indirect_competitors_detailed,
    competitive_advantage: comp.competitive_advantage || MOCK.competitive_advantage,
    competitor_threat_level: comp.threat_level || MOCK.competitor_threat_level,
    whitespace_summary: comp.market_gap || MOCK.whitespace_summary,
  };
}
