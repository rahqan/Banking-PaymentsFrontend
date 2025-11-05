// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, BankDistribution, RecentActivity } from '../models/dashboard.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getBankDistribution(): Observable<BankDistribution[]> {
    return this.http.get<BankDistribution[]>(`${this.apiUrl}/bank-distribution`);
  }

  getRecentActivities(limit: number = 10): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/recent-activities?limit=${limit}`);
  }
}