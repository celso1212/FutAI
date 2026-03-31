import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/services/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem('futai_user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [token, setToken] = useState<string | null>(localStorage.getItem('futai_token'));

  const persist = useCallback((tok: string, usr: User) => {
    localStorage.setItem('futai_token', tok);
    localStorage.setItem('futai_user', JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    persist(data.token, data.user);
  }, [persist]);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    await authApi.register({ email, password, name });
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('futai_token');
    localStorage.removeItem('futai_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
