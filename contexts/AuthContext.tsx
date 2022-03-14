import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  getAuth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import firebaseApp from "./globals/firebaseApp";
const firebaseAuth = getAuth(firebaseApp);

const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
};

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

export interface AuthResult {
  user?: User;
  loading: boolean;
  error?: string;
  signup?: (email: string, password: string) => Promise<unknown>;
  login?: (email: string, password: string) => Promise<unknown>;
}

const AuthContext = React.createContext<AuthResult>({
  loading: true,
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [result, setResult] = useState<AuthResult>({ loading: true });
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      setResult({
        user: user ? user : undefined,
        loading: false,
        signup: user ? undefined : signup,
        login: user ? undefined : login,
      });
    });

    setResult({ loading: false, signup, login });
  }, []);

  return <AuthContext.Provider value={result}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}

export function useFirebaseAuth() {
  return firebaseAuth;
}
