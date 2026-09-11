export default function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Top Brand & Links Grid */}
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div
              className="footer-logo"
              onClick={scrollToTop}
              role="button"
              tabIndex={0}
              title="Back to top"
            >
              Start<em>IQ</em>
            </div>
            <p className="footer-brand-desc">
              AI-powered venture intelligence engine. Evaluate viability, unit economics,
              and competitive moats in under 60 seconds with our sequential 6-agent pipeline.
            </p>

            <div className="footer-status-pill">
              <span className="footer-status-dot" />
              <span>All 6 AI Agents Operational</span>
            </div>

            <div className="footer-socials">
              <a
                href="#twitter"
                className="footer-social-link"
                aria-label="Twitter / X"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#linkedin"
                className="footer-social-link"
                aria-label="LinkedIn"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#github"
                className="footer-social-link"
                aria-label="GitHub"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#discord"
                className="footer-social-link"
                aria-label="Discord Community"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1: Product */}
          <div className="footer-col">
            <h3 className="footer-col-title">Product</h3>
            <ul className="footer-links">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => scrollToSection(".feat-section")}
                >
                  Features Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => scrollToSection(".orbital-section")}
                >
                  6-Agent Pipeline
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => scrollToSection(".input-section")}
                >
                  Idea Analyzer
                </button>
              </li>
              <li>
                <a href="#tam-sam" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Market Sizing (TAM/SAM)
                </a>
              </li>
              <li>
                <a href="#pricing" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: AI Agents */}
          <div className="footer-col">
            <h3 className="footer-col-title">AI Agents</h3>
            <ul className="footer-links">
              <li>
                <span className="footer-agent-link">
                  <span className="footer-dot-agent" /> 01 Idea Agent
                </span>
              </li>
              <li>
                <span className="footer-agent-link">
                  <span className="footer-dot-agent" /> 02 Market Agent
                </span>
              </li>
              <li>
                <span className="footer-agent-link">
                  <span className="footer-dot-agent" /> 03 Competitor Agent
                </span>
              </li>
              <li>
                <span className="footer-agent-link">
                  <span className="footer-dot-agent" /> 04 Risk & SWOT
                </span>
              </li>
              <li>
                <span className="footer-agent-link">
                  <span className="footer-dot-agent" /> 05 Finance Agent
                </span>
              </li>
              <li>
                <span className="footer-agent-link">
                  <span className="footer-dot-agent" /> 06 VC Scorer
                </span>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Company & About */}
          <div className="footer-col">
            <h3 className="footer-col-title">About</h3>
            <ul className="footer-links">
              <li>
                <a href="#about" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#methodology" className="footer-link" onClick={(e) => e.preventDefault()}>
                  VC Methodology
                </a>
              </li>
              <li>
                <a href="#partners" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Venture Partners
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#careers" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Careers <span className="footer-badge">Hiring</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 4: Help & Legal */}
          <div className="footer-col">
            <h3 className="footer-col-title">Help & Legal</h3>
            <ul className="footer-links">
              <li>
                <a href="#help" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Help & FAQ
                </a>
              </li>
              <li>
                <a href="#support" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Founder Support
                </a>
              </li>
              <li>
                <a href="#privacy" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#security" className="footer-link" onClick={(e) => e.preventDefault()}>
                  Security Audit
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} StartIQ Inc. All rights reserved.
          </div>
          <div className="footer-bottom-note">
            Built for early-stage founders & venture studios.
          </div>
          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
