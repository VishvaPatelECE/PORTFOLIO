'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isVerified: boolean;
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);

  const value = useMemo(() => ({ isVerified, setIsVerified }), [isVerified]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
