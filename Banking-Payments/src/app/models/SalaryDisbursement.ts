interface SalaryDisbursement {
  salaryDisbursementId: number;
  createdAt: Date;
  amount: number;
  employeeId: number;
  clientId: number;
  employee?: {
    name?: string;
    position?: string;
    department?: string;
    salary?: number;
  };
}

export default SalaryDisbursement;