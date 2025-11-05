// src/app/services/bank.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankDTO, CreateBankDTO, UpdateBankDTO } from '../models/bank.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private apiUrl = `${environment.apiUrl}/Bank`;

  constructor(private http: HttpClient) {}

  getAllBanks(): Observable<BankDTO[]> {
    return this.http.get<BankDTO[]>(this.apiUrl);
  }

  getAllBanksWithClientCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/with-clients`);
  }

  getBankById(id: number): Observable<BankDTO> {
    return this.http.get<BankDTO>(`${this.apiUrl}/${id}`);
  }

  createBank(bank: CreateBankDTO): Observable<BankDTO> {
    return this.http.post<BankDTO>(this.apiUrl, bank);
  }

  updateBank(id: number, bank: UpdateBankDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, bank);
  }

  softDeleteBank(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Get all bank users for a specific bank
  getAllBankUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bankUsers`);
  }

  getBankUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bankUsers/${id}`);
  }

  createBankUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bankUsers`, user);
  }

  updateBankUser(id: number, user: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/bankUsers/${id}`, user);
  }

  deleteBankUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/bankUsers/${id}`);
  }
}