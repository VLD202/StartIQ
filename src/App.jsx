import { useState } from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/auth/AuthModal";
import LandingPage from "./pages/LandingPage";
import AnalyzingView from "./components/analyzing/AnalyzingView";
import DashboardPage from "./pages/DashboardPage";
import { evaluateStartupIdea } from "./services/api";
import { MOCK } from "./utils/constants";

export default function App() {
  const [page, setPage] = useState("home");
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState(null);

  async function handleStart(txt) {
    setIdea(txt);
    setPage("analyzing");
    try {
      const evaluationResult = await evaluateStartupIdea(txt);
      setResult(evaluationResult);
    } catch (err) {
      console.warn("Backend evaluation call failed, using mock data:", err);
      // Allow visual animation of agent sequence before displaying fallback
      await new Promise((r) => setTimeout(r, 4800));
      setResult(MOCK);
    }
    setPage("results");
  }

  const handleReset = () => {
    setPage("home");
    setResult(null);
    setIdea("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AuthProvider>
      <div className="app-root">
        {page === "home" && <LandingPage onStart={handleStart} />}
        {page === "analyzing" && <AnalyzingView idea={idea} />}
        {page === "results" && result && (
          <DashboardPage result={result} onReset={handleReset} />
        )}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}

