import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import BankDetails from '../models/BankDetails ';
import Beneficiary from '../models/Beneficiary';
import Employee from '../models/Employee';
import Payment from '../models/Payment';
import PaymentDTO from '../models/PaymentDTO';
import SalaryDisbursement from '../models/SalaryDisbursement';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = "https://localhost:7234/api/v1";
  constructor(private http:HttpClient) { }
  private clientId  = localStorage.getItem('userId');

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

  getAllBeneficiary():Observable<Beneficiary[]>{
    return this.http.get<Beneficiary[]>(`${this.apiUrl}/get-all-beneficiaries/${this.clientId}`);
  }

  getAllEmployee():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/get-all-employee/${this.clientId}`);
  }

  getAllPayments():Observable<Payment[]>{
    return this.http.get<Payment[]>(`${this.apiUrl}/get-all-payment/${this.clientId}`);
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
}
