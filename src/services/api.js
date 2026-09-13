import { adaptEvaluationResult } from "./adapter";

/*
 * FRONTEND-ONLY MODE
 *
 * Backend/API calls are disabled for now.
 * Login, signup and evaluation use local/mock data.
 */

// --------------------------------------------------
// STARTUP EVALUATION
// --------------------------------------------------

export async function evaluateStartupIdea(idea) {
  /*
   * Backend call removed for now.
   * Returning mock data from adapter.js.
   */
  return adaptEvaluationResult(null);
}


// --------------------------------------------------
// LOGIN
// --------------------------------------------------

export async function loginUser(email, password) {
  /*
   * Backend authentication removed.
   * This is a frontend-only demo login.
   */

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  return {
    token: "frontend-demo-token",

    user: {
      name: email.split("@")[0],
      email: email,
    },
  };
}


// --------------------------------------------------
// SIGN UP
// --------------------------------------------------

export async function signupUser(name, email, password) {
  /*
   * Backend signup removed.
   * This is a frontend-only demo signup.
   */

  if (!name || !email || !password) {
    throw new Error("Please fill all the fields.");
  }

  return {
    token: "frontend-demo-token",

    user: {
      name: name,
      email: email,
    },
  };
}


// --------------------------------------------------
// CURRENT USER
// --------------------------------------------------

export async function fetchCurrentUser(token) {
  /*
   * No backend request.
   * User is read from localStorage.
   */

  if (!token) {
    throw new Error("No user session.");
  }

  const savedUser = localStorage.getItem("startiq_auth_user");

  if (!savedUser) {
    throw new Error("No user found.");
  }

  return JSON.parse(savedUser);
}