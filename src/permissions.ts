import type { Permission } from "./types";

export type PermissionFlags = {
  canViewEmployees: boolean;
  canViewSalary: boolean;
  canEditEmployees: boolean;
};

export function buildPermissionFlags(permissions: Permission[]): PermissionFlags {
  const set = new Set(permissions);
  return {
    canViewEmployees: set.has("EMPLOYEE_VIEW"),
    canViewSalary: set.has("EMPLOYEE_VIEW_SALARY"),
    canEditEmployees: set.has("EMPLOYEE_EDIT")
  };
}
