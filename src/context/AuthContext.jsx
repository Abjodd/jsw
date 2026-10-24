import { createContext, useContext, useMemo, useState } from 'react';

/**
 * Demo auth — accepts any non-empty credentials and keeps the user in
 * sessionStorage. Replace `login` / `logout` with the real SSO / API calls.
 */
const AuthContext = createContext(null);
const STORAGE_KEY = 'jsw.user';

const readUser = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async ({ email }) => {
        // TODO: replace with real authentication call
        await new Promise((r) => setTimeout(r, 600));
        const local = email.split('@')[0] || 'user';
        const name = local
          .split(/[._-]/)
          .filter(Boolean)
          .map((p) => p[0].toUpperCase() + p.slice(1))
          .join(' ');
        const u = { email, name: name || 'JSW User', role: 'Procurement Manager' };
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch { /* ignore */ }
        setUser(u);
        return u;
      },
      logout: () => {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
