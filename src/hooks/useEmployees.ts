import { useQuery } from "@tanstack/react-query";
import { listEmployees } from "../api/employees";
import type { CompanyId } from "../types";

/**
 * Intentionally flawed hook for the exercise.
 * Candidates should identify and fix issues:
 * - query key does not include companyId or filters (cache leakage risk)
 * - no abort/cancellation / no error typing
 * - no sensible caching/retry
 * - API logic not centralized enough for re-use
 */
export function useEmployees(companyId: CompanyId, search: string, status: "ACTIVE" | "INACTIVE" | "ALL") {
  return useQuery({
    queryKey: ["employees"], // intentionally wrong
    queryFn: async () => {
      return listEmployees({ companyId, search, status });
    }
  });
}
