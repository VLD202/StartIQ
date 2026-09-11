import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, signupUser, fetchCurrentUser } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "startiq_auth_token";
const USER_KEY = "startiq_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    mode: "login", // 'login' | 'signup'
    onSuccessCallback: null,
  });

  // Verify token on mount
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token)
        .then((fetchedUser) => {
          setUser(fetchedUser);
          localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser));
        })
        .catch(() => {
          // Token invalid or expired
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  };

  const signup = async (name, email, password) => {
    const data = await signupUser(name, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const openAuthModal = useCallback((mode = "login", onSuccessCallback = null) => {
    setAuthModalState({
      isOpen: true,
      mode,
      onSuccessCallback,
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalState((prev) => ({
      ...prev,
      isOpen: false,
      onSuccessCallback: null,
    }));
  }, []);

  const handleAuthSuccess = useCallback(() => {
    if (authModalState.onSuccessCallback) {
      try {
        authModalState.onSuccessCallback();
      } catch (err) {
        console.error("Error executing auth callback:", err);
      }
    }
    closeAuthModal();
  }, [authModalState, closeAuthModal]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        authModalState,
        openAuthModal,
        closeAuthModal,
        handleAuthSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
