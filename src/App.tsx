import React from "react";
import { AuthProvider, useAuth } from "./context/auth";
import { COMPANIES } from "./mockData";
import { useEmployees } from "./hooks/useEmployees";
import { EmployeeTable } from "./components/EmployeeTable";

function Shell() {
  const { companyId, setCompanyId, permissions } = useAuth();

  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"ACTIVE" | "INACTIVE" | "ALL">("ALL");

  const { data, isLoading, error, refetch } = useEmployees(companyId, search, status);

  return (
    <div className="container">
      <div className="row" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>HCMatrix – Employee List</h2>
        <span className="spacer" />
        <label className="muted">Company:</label>
        <select value={companyId} onChange={(e) => setCompanyId(e.target.value as any)}>
          {COMPANIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row" style={{ marginBottom: 12 }}>
        <span className="pill">Permissions: {permissions.join(", ")}</span>
        <span className="spacer" />
        <button onClick={() => refetch()}>Refetch</button>
      </div>

      {isLoading ? <p className="muted">Loading employees...</p> : null}
      {error ? (
        <div>
          <p className="error">Error: {(error as any)?.message ?? "Unknown error"}</p>
          <button onClick={() => refetch()}>Try again</button>
        </div>
      ) : null}

      {data ? (
        <EmployeeTable
          rows={data}
          permissions={permissions}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
      ) : null}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
