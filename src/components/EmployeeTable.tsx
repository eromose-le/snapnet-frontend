import React from "react";
import type { Employee, Permission } from "../types";
import { hasPermission } from "../context/auth";

type Props = {
  rows: Employee[];
  permissions: Permission[];
  search: string;
  onSearchChange: (v: string) => void;
  status: "ACTIVE" | "INACTIVE" | "ALL";
  onStatusChange: (v: "ACTIVE" | "INACTIVE" | "ALL") => void;
};

/**
 * Intentionally imperfect table component for the exercise:
 * - permission logic mixed into rendering
 * - derived computations done on every render
 * - unstable handlers/props patterns likely cause re-renders
 * - no pagination/virtualization; will struggle with 1000+ rows
 */
export function EmployeeTable(props: Props) {
  const { rows, permissions, search, onSearchChange, status, onStatusChange } = props;

  // Derived work (intentionally heavy-ish)
  const activeCount = rows.filter((e) => e.status === "ACTIVE").length;
  const inactiveCount = rows.filter((e) => e.status === "INACTIVE").length;

  const canViewSalary = hasPermission(permissions, "EMPLOYEE_VIEW_SALARY");

  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        <input
          value={search}
          placeholder="Search name, email, department..."
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ minWidth: 280 }}
        />

        <select value={status} onChange={(e) => onStatusChange(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <span className="pill">Active: {activeCount}</span>
        <span className="pill">Inactive: {inactiveCount}</span>
        <span className="spacer" />
        <span className="muted">Rows: {rows.length}</span>
      </div>

      <div style={{ maxHeight: 520, overflow: "auto", border: "1px solid #eee", borderRadius: 10 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              {canViewSalary ? <th>Salary</th> : null}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.department}</td>
                {canViewSalary ? <td>{e.salary.toLocaleString()}</td> : null}
                <td>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
