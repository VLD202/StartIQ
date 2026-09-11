import { TESTIMONIALS } from "../../utils/constants";

export default function TestimonialsSection({ testRef }) {
  return (
    <section ref={testRef} className="test-section">
      <div className="test-inner">
        <div className="sect-eyebrow">Founder stories</div>
        <h2 className="sect-title">
          Built for <em>founders.</em>
        </h2>
        <div className="test-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="test-card">
              <div className="test-stars">★★★★★</div>
              <p className="test-quote">"{t.quote}"</p>
              <div className="test-author">
                <div
                  className="test-avatar"
                  style={{ background: t.color + "22", color: t.color }}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="test-name">{t.name}</div>
                  <div className="test-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
