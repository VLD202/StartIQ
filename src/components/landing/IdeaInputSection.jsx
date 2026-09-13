import { useState } from "react";
import { EXAMPLE_IDEAS } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

export default function IdeaInputSection({ inputRef, onStart }) {
  const [idea, setIdea] = useState("");
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleSubmit = () => {
    if (!idea.trim()) return;

    if (!isAuthenticated) {
      openAuthModal("login", () => {
        onStart(idea);
      });
      return;
    }

    onStart(idea);
  };

  return (
    <section ref={inputRef} className="input-section">
      <div className="input-inner">
        <div className="sect-eyebrow">Start analyzing</div>
        <h2 className="sect-title" style={{ marginBottom: 8 }}>
          Paste your idea.
          <br />
          Get your <em>report.</em>
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--sub)",
            marginBottom: 32,
            fontWeight: 300,
          }}
        >
          Describe in plain language — the agents figure out the rest.
        </p>
        <div className="input-box">
          <div className="input-top">
            <span className="input-lbl">Startup idea input</span>
            <div className="input-macs">
              <span className="input-mac" style={{ background: "#ff5f57" }} />
              <span className="input-mac" style={{ background: "#febc2e" }} />
              <span className="input-mac" style={{ background: "#28c840" }} />
            </div>
          </div>
          <textarea
            className="input-ta"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Describe your startup idea… e.g. An AI platform helping Class 10 students in rural India get personalized tutoring in vernacular languages at 1/10th the cost of existing solutions"
            rows={5}
            maxLength={2000}
          />
          <div className="input-examples">
            <span className="input-ex-lbl">Try →</span>
            {EXAMPLE_IDEAS.map((ex, i) => (
              <button
                key={i}
                type="button"
                className="input-ex"
                onClick={() => setIdea(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
          <div className="input-footer">
            <span className="input-count">{idea.length} / 2000</span>
            <button
              type="button"
              className="input-submit"
              onClick={handleSubmit}
              disabled={!idea.trim()}
            >
              Analyze Idea
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
