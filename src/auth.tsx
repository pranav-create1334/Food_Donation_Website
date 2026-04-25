import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, Role } from './types';
import { signin, signup } from './lib/api';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (username: string, password: string, role: Role) => Promise<AuthUser>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'food_donation_auth';

function loadAuthState(): AuthState {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    return { token: null, user: null };
  }
  try {
    return JSON.parse(stored) as AuthState;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { token: null, user: null };
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthState());

  const persist = (next: AuthState) => {
    setAuthState(next);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
  };

  const login = async (username: string, password: string) => {
    const response = await signin(username, password);
    persist({ token: response.token, user: response.user });
    return response.user;
  };

  const register = async (username: string, password: string, role: Role) => {
    const response = await signup(username, password, role);
    persist({ token: response.token, user: response.user });
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({ token: null, user: null });
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token: authState.token,
      user: authState.user,
      login,
      register,
      logout,
    }),
    [authState.token, authState.user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
