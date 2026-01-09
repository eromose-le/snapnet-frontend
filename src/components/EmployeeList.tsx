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

type EmployeePaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const pageSizeOptions = [25, 50, 100];

export function EmployeeList({ companyId, permissionFlags }: Props) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<EmployeeStatusFilter>("ALL");
  const [pageSize, setPageSize] = React.useState(50);
  const [page, setPage] = React.useState(1);
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

  const totalPages = React.useMemo(
    () => Math.max(1, Math.ceil(data.length / pageSize)),
    [data.length, pageSize]
  );
  const currentPage = Math.min(page, totalPages);
  const pagedRows = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleStatusChange = React.useCallback((value: EmployeeStatusFilter) => {
    setStatus(value);
  }, []);

  const handlePageChange = React.useCallback(
    (nextPage: number) => {
      setPage((prev) => {
        const clamped = Math.max(1, Math.min(nextPage, totalPages));
        return prev === clamped ? prev : clamped;
      });
    },
    [totalPages]
  );

  const handlePageSizeChange = React.useCallback((nextSize: number) => {
    setPageSize(nextSize);
    setPage(1);
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [companyId, status, deferredSearch]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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

      {data.length > 0 ? <EmployeeTable rows={pagedRows} showSalary={permissionFlags.canViewSalary} /> : null}
      {data.length > 0 ? (
        <EmployeePagination
          page={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRows={data.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : null}
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

function EmployeePagination({
  page,
  totalPages,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange
}: EmployeePaginationProps) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);

  return (
    <div className="row" style={{ marginTop: 12 }}>
      <span className="muted">
        Showing {start}-{end} of {totalRows}
      </span>
      <span className="spacer" />
      <label className="muted">Rows per page:</label>
      <select
        value={pageSize}
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
      >
        {pageSizeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Prev
      </button>
      <span className="muted">
        Page {page} of {totalPages}
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Unknown error";
}
