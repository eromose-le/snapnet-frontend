export type CompanyId = "hcmatrix" | "snapnet";

export type Permission = "EMPLOYEE_VIEW" | "EMPLOYEE_VIEW_SALARY" | "EMPLOYEE_EDIT";

export type EmployeeStatus = "ACTIVE" | "INACTIVE";
export type EmployeeStatusFilter = EmployeeStatus | "ALL";

export type Employee = {
  id: string;
  companyId: CompanyId;
  name: string;
  email: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
};
