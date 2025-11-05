import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, ApprovePaymentRequest } from '../models/payment.model';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/bankuser`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPendingPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/pending`, {
      headers: this.getHeaders()
    });
  }

  getPaymentsByStatus(status: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/status/${status}`, {
      headers: this.getHeaders()
    });
  }

  getAllPaymentsByBank(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/bank`, {
      headers: this.getHeaders()
    });
  }

  getPaymentById(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/payments/${paymentId}`, {
      headers: this.getHeaders()
    });
  }

  approvePayment(paymentId: number, request: ApprovePaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(
      `${this.apiUrl}/payments/${paymentId}/approve`,
      request,
      { headers: this.getHeaders() }
    );
  }

  rejectPayment(paymentId: number, request: ApprovePaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(
      `${this.apiUrl}/payments/${paymentId}/reject`,
      request,
      { headers: this.getHeaders() }
    );
  }
}
