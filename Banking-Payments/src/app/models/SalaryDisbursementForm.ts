export interface SalaryDisbursementForm {
  file: File;        // Uploaded file
  clientId: number;  // Selected client ID
  batchSize?: number; // Optional (default = 10)
}
