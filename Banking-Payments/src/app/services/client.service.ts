import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import BankDetails from '../models/BankDetails ';
import Beneficiary from '../models/Beneficiary';
import Employee from '../models/Employee';
import Payment from '../models/Payment';
import PaymentDTO from '../models/PaymentDTO';
import SalaryDisbursement from '../models/SalaryDisbursement';
import { SalaryDisbursementForm } from '../models/SalaryDisbursementForm';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = "https://localhost:7234/api/v1";
  constructor(private http:HttpClient) { }
  private clientId  = localStorage.getItem('userId');
  salaryForm!:SalaryDisbursementForm;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      // 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getClientBankDetails():Observable<BankDetails>{
    var res = this.http.get<BankDetails>(`${this.apiUrl}/get-client-for-bank/${this.clientId}`,{headers:this.getHeaders()});
    return res;
  }

  getAllBeneficiary():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/get-all-beneficiaries/${this.clientId}`);
  }

  getAllEmployee():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/get-all-employee/${this.clientId}`);
  }

  getAllPayments():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/get-all-payment/${this.clientId}`);
  }

  addEmployee(employee:Employee):Observable<Employee>{
    return this.http.post<Employee>(`${this.apiUrl}/add-employee`, employee);
  }

  addBeneficiary(beneficiary:Beneficiary):Observable<Beneficiary>{
    return this.http.post<Beneficiary>(`${this.apiUrl}/add-beneficiary`,beneficiary);
  }

  addPayment(payment:PaymentDTO):Observable<PaymentDTO>{
    return this.http.post<PaymentDTO>(`${this.apiUrl}/add-payment`, payment);
  }

  deleteEmployee(employeeId:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/delete-employee-by-id/${employeeId}`);
  }

  getSalaryDisbursement():Observable<SalaryDisbursement[]>{
    return this.http.get<SalaryDisbursement[]>(`${this.apiUrl}/get-salary-disbursement-by-client-id/${this.clientId}`);
  }

  salaryDisburment(salary:SalaryDisbursement):Observable<SalaryDisbursement>{
    return this.http.post<SalaryDisbursement>(`${this.apiUrl}/individual-salary-disbursement`,salary);
  }

salaryDisbursementByCSV(file: File, clientId: number): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId.toString());
    formData.append('batchSize', '10');
    
    // Create headers WITHOUT Content-Type for FormData
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      // Uncomment if you need authorization:
      // 'Authorization': `Bearer ${token}`
    });
    // Note: Do NOT set Content-Type for FormData uploads!
    
    return this.http.post<any>(
      `${this.apiUrl}/salary-disbursement-by-batch`, 
      formData,
      { headers: headers }
    );
}

}
