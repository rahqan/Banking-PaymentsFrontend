import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankUserReportService } from '../../services/bank-user-report.service';
import {
  TransactionReportDTO,
  CustomerOnboardingReportDTO,
  PaymentApprovalReportDTO,
  ClientActivityReportDTO
} from '../../models/report.model';



@Component({
  selector: 'app-bank-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-reports.component.html',
  styleUrls: ['./bank-reports.component.css']
})
export class BankReportsComponent implements OnInit {
  activeTab = 'transactions';
  loading = false;
  error: string | null = null;

  // Date filters
  startDate: string = '';
  endDate: string = '';
  clientId: number | null = null;

  // Report data
  transactions: TransactionReportDTO[] = [];
  onboardingReport: CustomerOnboardingReportDTO | null = null;
  paymentReport: PaymentApprovalReportDTO | null = null;
  clientActivity: ClientActivityReportDTO[] = [];

  constructor(private reportService: BankUserReportService) {}

  ngOnInit(): void {
    this.setDefaultDates();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.error = null;
  }

  loadAllTransactions(): void {
    this.loading = true;
    this.error = null;

    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.getAllTransactions(start, end).subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions report';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadClientTransactions(): void {
    if (!this.clientId || this.clientId <= 0) {
      this.error = 'Please enter a valid Client ID';
      return;
    }

    this.loading = true;
    this.error = null;

    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.getTransactionReportByClient(this.clientId, start, end).subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load client transactions';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadAllTransactionsPdf(): void {
    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.downloadAllTransactionsPdf(start, end).subscribe({
      next: (blob) => {
        this.reportService.downloadFile(blob, `AllTransactions_${Date.now()}.pdf`);
      },
      error: (err) => {
        this.error = 'Failed to download PDF';
        console.error(err);
      }
    });
  }

  downloadClientTransactionsPdf(): void {
    if (!this.clientId || this.clientId <= 0) {
      this.error = 'Please enter a valid Client ID';
      return;
    }

    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.downloadClientTransactionsPdf(this.clientId, start, end).subscribe({
      next: (blob) => {
        this.reportService.downloadFile(blob, `ClientTransactions_${this.clientId}_${Date.now()}.pdf`);
      },
      error: (err) => {
        this.error = 'Failed to download PDF';
        console.error(err);
      }
    });
  }

  loadOnboardingReport(): void {
    this.loading = true;
    this.error = null;

    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.getCustomerOnboardingReport(start, end).subscribe({
      next: (data) => {
        // console.log(data);



        this.onboardingReport = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load onboarding report';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadOnboardingPdf(): void {
    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.downloadCustomerOnboardingPdf(start, end).subscribe({
      next: (blob) => {
        this.reportService.downloadFile(blob, `CustomerOnboarding_${Date.now()}.pdf`);
      },
      error: (err) => {
        this.error = 'Failed to download PDF';
        console.error(err);
      }
    });
  }

  loadPaymentReport(): void {
    this.loading = true;
    this.error = null;
    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.getPaymentApprovalReport(start, end).subscribe({
      next: (data) => {
        this.paymentReport = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load payment report';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadPaymentPdf(): void {
    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.downloadPaymentApprovalPdf(start, end).subscribe({
      next: (blob) => {
        this.reportService.downloadFile(blob, `PaymentApproval_${Date.now()}.pdf`);
      },
      error: (err) => {
        this.error = 'Failed to download PDF';
        console.error(err);
      }
    });
  }

  loadClientActivity(): void {
    this.loading = true;
    this.error = null;

    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.getClientActivityReport(start, end).subscribe({
      next: (data) => {
        this.clientActivity = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load client activity report';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadClientActivityPdf(): void {
    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.downloadClientActivityPdf(start, end).subscribe({
      next: (blob) => {
        this.reportService.downloadFile(blob, `ClientActivity_${Date.now()}.pdf`);
      },
      error: (err) => {
        this.error = 'Failed to download PDF';
        console.error(err);
      }
    });
  }

  formatCurrency(amount: number): string {
    return this.reportService.formatCurrency(amount);
  }

  formatDate(date: Date | string): string {
    return this.reportService.formatDate(date);
  }

  getTotalTransactionAmount(): number {
    return this.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }

  getTotalPaymentValue(): number {
    return this.clientActivity.reduce((sum, c) => sum + c.totalPaymentValue, 0);
  }

  getTotalSalaryValue(): number {
    return this.clientActivity.reduce((sum, c) => sum + c.totalSalaryValue, 0);
  }

  getTotalCurrentBalance(): number {
    return this.clientActivity.reduce((sum, c) => sum + c.currentBalance, 0);
  }

  getActiveClientsCount(): number {
    return this.clientActivity.filter(c => c.isActive).length;
  }

  getHighValuePendingCount(): number {
    if (!this.paymentReport) return 0;
    return this.paymentReport.highValueTransactions.filter(t => t.status === 'Pending').length;
  }

}