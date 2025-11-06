// src/app/services/super-admin-report.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  SystemOverviewReportDTO,
  BankPerformanceReportDTO,
  TransactionVolumeReportDTO,
  FinancialSummaryReportDTO,
  QuickStatsDTO
} from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminReportService {
  private apiUrl = `${environment.apiUrl}/SuperAdminReport`;

  constructor(private http: HttpClient) {}

  // ==================== Report Data Endpoints ====================

  getSystemOverview(): Observable<SystemOverviewReportDTO> {
    return this.http.get<SystemOverviewReportDTO>(`${this.apiUrl}/system-overview`);
  }

  getBankPerformance(startDate?: Date, endDate?: Date): Observable<BankPerformanceReportDTO[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<BankPerformanceReportDTO[]>(`${this.apiUrl}/bank-performance`, { params });
  }

  getTransactionVolume(startDate: Date, endDate: Date): Observable<TransactionVolumeReportDTO> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    return this.http.get<TransactionVolumeReportDTO>(`${this.apiUrl}/transaction-volume`, { params });
  }

  getFinancialSummary(startDate: Date, endDate: Date): Observable<FinancialSummaryReportDTO> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    return this.http.get<FinancialSummaryReportDTO>(`${this.apiUrl}/financial-summary`, { params });
  }

  getQuickStats(): Observable<QuickStatsDTO> {
    return this.http.get<QuickStatsDTO>(`${this.apiUrl}/quick-stats`);
  }

  // ==================== PDF Download Endpoints ====================

  downloadSystemOverviewPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/system-overview/pdf`, {
      responseType: 'blob'
    });
  }

  downloadBankPerformancePdf(startDate?: Date, endDate?: Date): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get(`${this.apiUrl}/bank-performance/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  downloadTransactionVolumePdf(startDate: Date, endDate: Date): Observable<Blob> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    return this.http.get(`${this.apiUrl}/transaction-volume/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  downloadFinancialSummaryPdf(startDate: Date, endDate: Date): Observable<Blob> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    return this.http.get(`${this.apiUrl}/financial-summary/pdf`, {
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