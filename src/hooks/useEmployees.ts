import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listEmployees } from "../api/employees";
import type { ApiClientError } from "../api/apiClient";
import type { CompanyId, Employee, EmployeeStatusFilter } from "../types";

/**
 * Intentionally flawed hook for the exercise.
 * Candidates should identify and fix issues:
 * - query key does not include companyId or filters (cache leakage risk)
 * - no abort/cancellation / no error typing
 * - no sensible caching/retry
 * - API logic not centralized enough for re-use
 */

export type EmployeeFilters = {
  companyId: CompanyId;
  search: string;
  status: EmployeeStatusFilter;
};

const employeesQueryKey = (
  companyId: CompanyId,
  status: EmployeeStatusFilter,
  search: string
) => ["employees", companyId, status, search] as const;

export function useEmployees(
  filters: EmployeeFilters,
  options?: { enabled?: boolean }
) {
  const normalizedSearch = filters.search.trim();

  return useQuery<Employee[], ApiClientError>({
    queryKey: employeesQueryKey(
      filters.companyId,
      filters.status,
      normalizedSearch
    ),
    queryFn: ({ signal }) =>
      listEmployees({
        companyId: filters.companyId,
        search: normalizedSearch,
        status: filters.status,
        signal,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 2,
    enabled: options?.enabled ?? true,
  });
}
