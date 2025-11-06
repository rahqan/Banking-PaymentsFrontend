// src/app/services/bank-user-report.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  TransactionReportDTO,
  CustomerOnboardingReportDTO,
  PaymentApprovalReportDTO,
  ClientActivityReportDTO,
  DashboardStatsDTO
} from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class BankUserReportService {
  private apiUrl = `${environment.apiUrl}/BankUserReport`;

  constructor(private http: HttpClient) {}

  // ==================== Report Data Endpoints ====================

  getTransactionReportByClient(
    clientId: number,
    startDate?: Date,
    endDate?: Date
  ): Observable<TransactionReportDTO[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<TransactionReportDTO[]>(
      `${this.apiUrl}/transactions/client/${clientId}`,
      { params }
    );
  }

  getAllTransactions(startDate?: Date, endDate?: Date): Observable<TransactionReportDTO[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<TransactionReportDTO[]>(`${this.apiUrl}/transactions/all`, { params });
  }

  getCustomerOnboardingReport(
    startDate?: Date,
    endDate?: Date
  ): Observable<CustomerOnboardingReportDTO> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<CustomerOnboardingReportDTO>(
      `${this.apiUrl}/customer-onboarding`,
      { params }
    );
  }

  getPaymentApprovalReport(
    startDate?: Date,
    endDate?: Date
  ): Observable<PaymentApprovalReportDTO> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<PaymentApprovalReportDTO>(
      `${this.apiUrl}/payment-approval`,
      { params }
    );
  }

  getClientActivityReport(
    startDate?: Date,
    endDate?: Date
  ): Observable<ClientActivityReportDTO[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<ClientActivityReportDTO[]>(
      `${this.apiUrl}/client-activity`,
      { params }
    );
  }

  getDashboardStats(): Observable<DashboardStatsDTO> {
    return this.http.get<DashboardStatsDTO>(`${this.apiUrl}/dashboard-stats`);
  }

  // ==================== PDF Download Endpoints ====================

  downloadClientTransactionsPdf(
    clientId: number,
    startDate?: Date,
    endDate?: Date
  ): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get(`${this.apiUrl}/transactions/client/${clientId}/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  downloadAllTransactionsPdf(startDate?: Date, endDate?: Date): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get(`${this.apiUrl}/transactions/all/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  downloadCustomerOnboardingPdf(startDate?: Date, endDate?: Date): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get(`${this.apiUrl}/customer-onboarding/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  downloadPaymentApprovalPdf(startDate?: Date, endDate?: Date): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get(`${this.apiUrl}/payment-approval/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  downloadClientActivityPdf(startDate?: Date, endDate?: Date): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get(`${this.apiUrl}/client-activity/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  // ==================== Helper Methods ====================

  /**
   * Download blob as file
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}