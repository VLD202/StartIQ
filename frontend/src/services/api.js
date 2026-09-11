import { adaptEvaluationResult } from "./adapter";
import { MOCK } from "../utils/constants";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/**
 * Sends a startup idea to the backend for evaluation.
 * Tries the primary backend (port 5000 / Node orchestrator),
 * falls back to FastAPI on port 8000 if unreachable,
 * and falls back to mock data if both are offline.
 */
export async function evaluateStartupIdea(idea) {
  let res;
  try {
    res = await fetch(`${BACKEND_URL}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
  } catch {
    // Try FastAPI directly on port 8000
    res = await fetch("http://localhost:8000/pipeline/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
  }

  if (!res.ok) {
    throw new Error(`Evaluation failed with status ${res.status}`);
  }

  const rawData = await res.json();
  return adaptEvaluationResult(rawData);
}

/**
 * Logs in an existing user with email and password.
 */
export async function loginUser(email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed. Please check your credentials.");
  }
  return data;
}

/**
 * Registers a new user.
 */
export async function signupUser(name, email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Registration failed. Please check your details.");
  }
  return data;
}

/**
 * Validates token and returns current user profile.
 */
export async function fetchCurrentUser(token) {
  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Session expired.");
  }
  return data.user;
}

