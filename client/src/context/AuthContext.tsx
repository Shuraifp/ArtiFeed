"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: string | null;
  admin: string | null;
  login: (user: string) => void;
  logout: () => void;
  loginAdmin: (admin: string) => void;
  logoutAdmin: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  admin: null,
  login: () => {},
  logout: () => {},
  loginAdmin: () => {},
  logoutAdmin: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem("artiUser");
    const storedAdmin = localStorage.getItem("artiAdmin");


    if (storedUser) setUser(storedUser);
    if (storedAdmin) setAdmin(storedAdmin);
    setLoading(false);
  }, []);

  const login = (user: string) => {
    setUser(user);
    localStorage.setItem("artiUser", user); 
    // toast.success("Logged in successfully");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("artiUser");
    router.push("/login");
    toast("Logged out");
  };

  const loginAdmin = (admin: string) => {
    setAdmin(admin);
    localStorage.setItem("artiAdmin", admin);
    // toast.success("Admin logged in");
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("artiAdmin");
    router.push("/admin/login");
    toast("Admin logged out");
  };

  return (
    <AuthContext.Provider
      value={{ user, admin, login, logout, loginAdmin, logoutAdmin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
