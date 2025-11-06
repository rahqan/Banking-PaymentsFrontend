// src/app/components/super-admin/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { BankDistribution, DashboardStats, RecentActivity } from '../../../models/dashboard.model';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone:true,
  imports:[CommonModule,NgChartsModule],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalBanks: 0,
    activeBanks: 0,
    activeBankUsers: 0,
    // reportsGenerated: 0
  };

  bankDistribution: BankDistribution[] = [];
  recentActivities: RecentActivity[] = [];
  loading = true;

  chartData: any;
  chartOptions: any;

  constructor(private dashboardService: DashboardService) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        alert('Failed to load dashboard stats');
      }
    });

    this.dashboardService.getBankDistribution().subscribe({
      next: (distribution) => {
        this.bankDistribution = distribution;
        this.prepareChartData(distribution);
      },
      error: (err) => {
        console.error('Error loading distribution:', err);
        alert('Failed to load bank distribution');
      }
    });

    this.dashboardService.getRecentActivities(10).subscribe({
      next: (activities) => {
        this.recentActivities = activities;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading activities:', err);
        this.loading = false;
      }
    });
  }

  prepareChartData(distribution: BankDistribution[]): void {
    const labels = distribution.map(d => d.bankName);
    const data = distribution.map(d => d.clientCount);
    const percentages = distribution.map(d => d.percentage.toFixed(1));

    this.chartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    };
  }

  initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              const percentage = this.bankDistribution[context.dataIndex]?.percentage.toFixed(1);
              return `${label}: ${value} clients (${percentage}%)`;
            }
          }
        }
      }
    };
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(timestamp).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1d ago';
    return `${diffDays}d ago`;
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'bank': return '🏦';
      case 'user': return '👤';
      case 'report': return '📊';
      default: return '•';
    }
  }
}