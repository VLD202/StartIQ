import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal() {
  const { authModalState, closeAuthModal, handleAuthSuccess, login, signup } = useAuth();
  const { isOpen, mode: initialMode } = authModalState;

  const [mode, setMode] = useState(initialMode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || "login");
      setError("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [isOpen, initialMode]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAuthModal]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic Validations
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(trimmedEmail, password);
      } else {
        await signup(name.trim(), trimmedEmail, password);
      }
      handleAuthSuccess();
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
  };

  return (
    <div className="auth-overlay" onClick={closeAuthModal}>
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="auth-close-btn"
          onClick={closeAuthModal}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="auth-header">
          <div className="auth-logo">
            Start<em>IQ</em>
          </div>
          <p className="auth-sub">
            {mode === "login"
              ? "Sign in to evaluate startup ideas with 6 AI agents"
              : "Create an account to start analyzing your startup"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Log In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="auth-field">
              <label htmlFor="auth-name" className="auth-label">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                className="auth-input"
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email" className="auth-label">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password" className="auth-label">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password" className="auth-label">
                Confirm Password
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log In →"
              : "Create Account →"}
          </button>
        </form>

        <div className="auth-footer">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => switchMode("signup")}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => switchMode("login")}
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
