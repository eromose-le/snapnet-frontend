import React from "react";
import type { CompanyId, Permission } from "../types";
import { USER_PERMISSIONS_BY_COMPANY } from "../mockData";

type AuthState = {
  permissions: Permission[]; // current user's permissions for active company
  companyId: CompanyId;
  setCompanyId: (id: CompanyId) => void;
};

const AuthContext = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [companyId, setCompanyId] = React.useState<CompanyId>("hcmatrix");

  const permissions = USER_PERMISSIONS_BY_COMPANY[companyId];

  return (
    <AuthContext.Provider value={{ permissions, companyId, setCompanyId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Intentionally basic permission helper (could be improved/centralized further).
export function hasPermission(perms: Permission[], p: Permission) {
  return perms.includes(p);
}
