import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientCreation, ClientVerificationRequest } from '../models/client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankUserService {
  private apiUrl = `${environment.apiUrl}/bankuser`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Client Management
  createClient(client: ClientCreation): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients`, client, {
      headers: this.getHeaders()
    });
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`, {
      headers: this.getHeaders()
    });
  }

  getClientById(clientId: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${clientId}`, {
      headers: this.getHeaders()
    });
  }

  updateClient(clientId: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${clientId}`, client, {
      headers: this.getHeaders()
    });
  }

  deleteClient(clientId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/clients/${clientId}`,
      { headers: this.getHeaders() }
    );
  }

  verifyClient(clientId: number, request: ClientVerificationRequest): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${clientId}/verify`, request, {
      headers: this.getHeaders()
    });
  }

  getClientsByVerificationStatus(status: string): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.apiUrl}/clients/verification-status/${status}`,
      { headers: this.getHeaders() }
    );
  }
}
