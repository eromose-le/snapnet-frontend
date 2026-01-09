import React from "react";
import { useEmployees } from "../hooks/useEmployees";
import type { CompanyId, EmployeeStatusFilter } from "../types";
import type { PermissionFlags } from "../permissions";
import { EmployeeTable } from "./EmployeeTable";

type Props = {
  companyId: CompanyId;
  permissionFlags: PermissionFlags;
};

type RowCounts = {
  active: number;
  inactive: number;
  total: number;
};

type EmployeeListToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: EmployeeStatusFilter;
  onStatusChange: (value: EmployeeStatusFilter) => void;
  counts: RowCounts;
  isFetching: boolean;
  onRefetch: () => void;
};

export function EmployeeList({ companyId, permissionFlags }: Props) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<EmployeeStatusFilter>("ALL");
  const deferredSearch = React.useDeferredValue(search);

  const { data = [], isLoading, isError, error, isFetching, refetch } = useEmployees(
    { companyId, search: deferredSearch, status },
    { enabled: permissionFlags.canViewEmployees }
  );
  const isRefreshing = isFetching && !isLoading;

  const counts = React.useMemo<RowCounts>(() => {
    let active = 0;
    let inactive = 0;
    for (const employee of data) {
      if (employee.status === "ACTIVE") {
        active++;
      } else {
        inactive++;
      }
    }
    return { active, inactive, total: data.length };
  }, [data]);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleStatusChange = React.useCallback((value: EmployeeStatusFilter) => {
    setStatus(value);
  }, []);

  if (!permissionFlags.canViewEmployees) {
    return <p className="error">You do not have permission to view employees.</p>;
  }

  return (
    <div>
      <EmployeeListToolbar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        counts={counts}
        isFetching={isRefreshing}
        onRefetch={refetch}
      />

      {isLoading ? <p className="muted">Loading employees...</p> : null}
      {isError ? (
        <div>
          <p className="error">Error: {getErrorMessage(error)}</p>
          <button onClick={() => refetch()}>Try again</button>
        </div>
      ) : null}

      {data.length > 0 ? <EmployeeTable rows={data} showSalary={permissionFlags.canViewSalary} /> : null}
      {!isLoading && !isError && data.length === 0 ? <p className="muted">No employees found.</p> : null}
    </div>
  );
}

function EmployeeListToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  counts,
  isFetching,
  onRefetch
}: EmployeeListToolbarProps) {
  return (
    <div className="row" style={{ marginBottom: 12 }}>
      <input
        value={search}
        placeholder="Search name, email, department..."
        onChange={(event) => onSearchChange(event.target.value)}
        style={{ minWidth: 280 }}
      />

      <select value={status} onChange={(event) => onStatusChange(event.target.value as EmployeeStatusFilter)}>
        <option value="ALL">All</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>

      <span className="pill">Active: {counts.active}</span>
      <span className="pill">Inactive: {counts.inactive}</span>
      <span className="spacer" />
      <span className="muted">Rows: {counts.total}</span>
      {isFetching ? <span className="muted">Updating...</span> : null}
      <button onClick={onRefetch}>Refetch</button>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Unknown error";
}
