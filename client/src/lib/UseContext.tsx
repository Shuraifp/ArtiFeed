"use client" 

import { AuthProvider } from "@/context/AuthContext"

export default function UseContext({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}