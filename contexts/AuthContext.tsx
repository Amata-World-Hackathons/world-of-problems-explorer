import React, { useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { firebaseAuth } from "./globals/firebaseApp";

const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
};

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

const logout = () => signOut(firebaseAuth);

export interface AuthResult {
  user?: User;
  loading: boolean;
  error?: string;
  signup?: (email: string, password: string) => Promise<unknown>;
  login?: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthResult>({
  loading: true,
  logout,
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [result, setResult] = useState<AuthResult>({ loading: true, logout });

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      setResult({
        user: user ? user : undefined,
        loading: false,
        signup: user ? undefined : signup,
        login: user ? undefined : login,
        logout,
      });
    });

    setResult({ loading: false, signup, login, logout });
  }, []);

  return <AuthContext.Provider value={result}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}

export function useFirebaseAuth() {
  return firebaseAuth;
}
