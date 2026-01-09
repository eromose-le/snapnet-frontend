import React from "react";
import type { Employee } from "../types";

type Props = {
  rows: Employee[];
  showSalary: boolean;
};

type EmployeeRowProps = {
  employee: Employee;
  showSalary: boolean;
};

const salaryFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const EmployeeRow = React.memo(function EmployeeRow({ employee, showSalary }: EmployeeRowProps) {
  return (
    <tr>
      <td>{employee.name}</td>
      <td>{employee.email}</td>
      <td>{employee.department}</td>
      {showSalary ? <td>{salaryFormatter.format(employee.salary)}</td> : null}
      <td>{employee.status}</td>
    </tr>
  );
});

export const EmployeeTable = React.memo(function EmployeeTable({ rows, showSalary }: Props) {
  return (
    <div style={{ maxHeight: 520, overflow: "auto", border: "1px solid #eee", borderRadius: 10 }}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            {showSalary ? <th>Salary</th> : null}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((employee) => (
            <EmployeeRow key={employee.id} employee={employee} showSalary={showSalary} />
          ))}
        </tbody>
      </table>
    </div>
  );
});
