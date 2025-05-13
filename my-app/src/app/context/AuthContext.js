"use client";

import { createContext, useContext, useEffect, useState } from "react";

import pb from "@/lib/pb";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(pb.authStore.model);  // get user from localStorage if exists
  const [loading, setLoading] = useState(true);          // loading state

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });

    setUser(pb.authStore.model);
    setLoading(false);

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await pb.collection("users").authWithPassword(email, password);
    setUser(pb.authStore.model);
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);