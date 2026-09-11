const TICKER_ITEMS = [
  "Idea Scoring",
  "Market Sizing",
  "Competitor Intel",
  "Risk Analysis",
  "Finance Modeling",
  "VC Verdict",
  "TAM · SAM · SOM",
  "SWOT Matrix",
  "Innovation Index",
  "Fundability Score",
];

export default function MarqueeTicker() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...Array(2)].map((_, rep) =>
          TICKER_ITEMS.map((t, i) => (
            <div key={`${rep}-${i}`} className="marquee-item">
              <span className="marquee-dot" />
              {t}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
