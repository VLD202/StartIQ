import { LANDING_FEATURES } from "../../utils/constants";

export default function FeaturesSection({ featRef }) {
  return (
    <section ref={featRef} className="feat-section">
      <div className="feat-inner">
        <div className="sect-eyebrow">What we analyze</div>
        <h2 className="sect-title">
          Six agents.
          <br />
          One <em>verdict.</em>
        </h2>
        <p className="sect-sub">
          Every dimension a VC would scrutinize — evaluated in parallel by
          specialized AI agents.
        </p>
        <div className="feat-grid">
          {LANDING_FEATURES.map((f, i) => (
            <div key={i} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-name">{f.name}</div>
              <div className="feat-desc">{f.desc}</div>
              <span className="feat-tag">{f.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
