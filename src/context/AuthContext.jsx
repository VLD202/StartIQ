import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

const USER_KEY = "startiq_auth_user";

export function AuthProvider({ children }) {
  // Get saved user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Frontend-only login
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const loggedInUser = {
      name: email.split("@")[0],
      email: email,
    };

    setUser(loggedInUser);

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(loggedInUser)
    );

    return loggedInUser;
  };

  // Frontend-only signup
  const signup = async (name, email, password) => {
    if (!name || !email || !password) {
      throw new Error("Please fill all the fields.");
    }

    const newUser = {
      name: name,
      email: email,
    };

    setUser(newUser);

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(newUser)
    );

    return newUser;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  // Authentication modal state
  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    mode: "login",
    onSuccessCallback: null,
  });

  const openAuthModal = useCallback(
    (mode = "login", onSuccessCallback = null) => {
      setAuthModalState({
        isOpen: true,
        mode,
        onSuccessCallback,
      });
    },
    []
  );

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
        console.error(
          "Error executing auth callback:",
          err
        );
      }
    }

    closeAuthModal();
  }, [authModalState, closeAuthModal]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user ? "frontend-demo-token" : null,
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
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return ctx;
}