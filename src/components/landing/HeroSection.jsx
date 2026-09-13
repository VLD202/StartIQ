import { useAuth } from "../../context/AuthContext";

export default function HeroSection({
  heroEyeRef,
  heroTitleRef,
  heroSubRef,
  heroActRef,
}) {
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleAnalyzeClick = () => {
    const inputSection = document.querySelector(".input-section");
    if (inputSection) {
      inputSection.scrollIntoView({ behavior: "smooth" });
    }

    if (!isAuthenticated) {
      // Allow the smooth scroll to reach the input box, then open auth overlay
      setTimeout(() => {
        openAuthModal("login", () => {
          document.querySelector(".input-ta")?.focus();
        });
      }, 550);
    } else {
      setTimeout(() => {
        document.querySelector(".input-ta")?.focus();
      }, 500);
    }
  };

  return (
    <section className="hero">
      <div className="hero-orb-a" />
      <div className="hero-orb-b" />
      <div className="hero-grid" />
      <div ref={heroEyeRef} className="hero-eyebrow">
        <span />6 AI agents · real-time · free
        <span />
      </div>
      <h1 ref={heroTitleRef} className="hero-title">
        Evaluate your startup
        <br />
        like a <em>VC partner.</em>
      </h1>
      <p ref={heroSubRef} className="hero-sub">
        Multi-agent AI dissects your idea across market, competition, finance,
        and risk — delivering an investor-grade report in under 60 seconds.
      </p>
      <div ref={heroActRef} className="hero-actions">
        <button
          className="btn-primary"
          onClick={handleAnalyzeClick}
        >
          Analyze my idea →
        </button>
        <button
          className="btn-ghost"
          onClick={() =>
            document
              .querySelector(".orbital-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          See how it works
        </button>
      </div>
    </section>
  );
}
