import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import BankDetails from '../models/BankDetails ';
import Beneficiary from '../models/Beneficiary';
import Employee from '../models/Employee';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = "https://localhost:7234/api/v1";
  constructor(private http:HttpClient) { }
  // private clientId = localStorage.getItem('clientId');
  private clientId:number = 2;

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

  addEmployee(employee:Employee):Observable<Employee>{
    return this.http.post<Employee>(`${this.apiUrl}/api/`, employee);
  }

}
