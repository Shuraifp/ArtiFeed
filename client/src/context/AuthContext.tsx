"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export interface authResponse {
  id: string;
  name: string;
}

interface AuthContextType {
  user: authResponse | null;
  admin: authResponse | null;
  login: (user: authResponse) => void;
  logout: () => void;
  loginAdmin: (admin: authResponse) => void;
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
  const [user, setUser] = useState<authResponse | null>(null);
  const [admin, setAdmin] = useState<authResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const storedUser = localStorage.getItem("artiUser");
    const storedAdmin = localStorage.getItem("artiAdmin");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    setLoading(false);
  }, []);

  const login = (user: authResponse) => {
    setUser(user);
    localStorage.setItem("artiUser", JSON.stringify(user));
    // toast.success("Logged in successfully");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("artiUser");
    router.push("/login");
    toast("Logged out");
  };

  const loginAdmin = (admin: authResponse) => {
    setAdmin(admin);
    localStorage.setItem("artiAdmin", JSON.stringify(admin));
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
