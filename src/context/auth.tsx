import React from "react";
import type { CompanyId, Permission } from "../types";
import { USER_PERMISSIONS_BY_COMPANY } from "../mockData";
import { buildPermissionFlags, type PermissionFlags } from "../permissions";

type AuthState = {
  permissions: Permission[]; // current user's permissions for active company
  permissionFlags: PermissionFlags;
  companyId: CompanyId;
  setCompanyId: (id: CompanyId) => void;
};

const AuthContext = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [companyId, setCompanyId] = React.useState<CompanyId>("hcmatrix");

  const permissions = USER_PERMISSIONS_BY_COMPANY[companyId];
  const permissionFlags = React.useMemo(() => buildPermissionFlags(permissions), [permissions]);
  const value = React.useMemo(
    () => ({ permissions, permissionFlags, companyId, setCompanyId }),
    [permissions, permissionFlags, companyId, setCompanyId]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
