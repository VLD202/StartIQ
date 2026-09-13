import { useAuth } from "../../context/AuthContext";

export default function LandingNavbar({ navRef }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav ref={navRef} className="nav">
      <div className="nav-logo" onClick={handleScrollTop} role="button" tabIndex={0}>
        Start<em>IQ</em>
      </div>

      <div className="nav-links">
        <button
          type="button"
          className="nav-link"
          onClick={() =>
            document.querySelector(".feat-section")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Features
        </button>

        <button
          type="button"
          className="nav-link"
          onClick={() =>
            document.querySelector(".orbital-section")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          How it works
        </button>

        {!isAuthenticated ? (
          <button
            type="button"
            className="nav-link nav-link-login"
            onClick={() => openAuthModal("login")}
          >
            Login
          </button>
        ) : null}
      </div>

      <div className="nav-actions">
        {!isAuthenticated ? (
          <button
            type="button"
            className="nav-cta"
            onClick={() => openAuthModal("signup")}
          >
            Sign Up
          </button>
        ) : (
          <div className="nav-user-wrap">
            <span className="nav-user-badge" title={user.email}>
              <span className="nav-user-dot" />
              {user.name.split(" ")[0]}
            </span>
            <button
              type="button"
              className="nav-logout-btn"
              onClick={logout}
              title="Sign out of StartIQ"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

