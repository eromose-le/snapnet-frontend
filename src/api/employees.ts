import type { CompanyId, Employee, EmployeeStatusFilter } from "../types";
import { EMPLOYEES_DB } from "../mockData";
import { withNetwork } from "./apiClient";

export type ListEmployeesParams = {
  companyId: CompanyId;
  search?: string;
  status?: EmployeeStatusFilter;
  limit?: number; // optional client-side limit
  signal?: AbortSignal;
};

// Intentionally not fully standardized. Candidates can improve.
export async function listEmployees(params: ListEmployeesParams): Promise<Employee[]> {
  const { companyId, search, status = "ALL", limit, signal } = params;
  const normalizedSearch = search?.trim();

  return withNetwork(() => {
    let rows = EMPLOYEES_DB[companyId];

    if (status !== "ALL") {
      rows = rows.filter((e) => e.status === status);
    }

    if (normalizedSearch && normalizedSearch.length > 0) {
      const q = normalizedSearch.toLowerCase();
      rows = rows.filter((e) => {
        return (
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
        );
      });
    }

    if (typeof limit === "number") {
      rows = rows.slice(0, limit);
    }

    // Note: returns a new array each time; could be optimized.
    return [...rows];
  }, signal);
}
