import React from "react";
import { AuthProvider, useAuth } from "./context/auth";
import { COMPANIES } from "./mockData";
import { EmployeeList } from "./components/EmployeeList";
import type { CompanyId } from "./types";

function Shell() {
  const { companyId, setCompanyId, permissions, permissionFlags } = useAuth();
  const selectedCompanyName =
    COMPANIES.find((company) => company.id === companyId)?.name ?? "Company";

  return (
    <div className="container">
      <div className="row" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>
          {selectedCompanyName} – Employee List
        </h2>
        <span className="spacer" />
        <label className="muted">Company:</label>
        <select
          value={companyId}
          onChange={(event) => setCompanyId(event.target.value as CompanyId)}
        >
          {COMPANIES.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row" style={{ marginBottom: 12 }}>
        <span className="pill">Permissions: {permissions.join(", ")}</span>
      </div>

      <EmployeeList companyId={companyId} permissionFlags={permissionFlags} />
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
