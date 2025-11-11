import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminReportService } from '../../../services/super-admin-report.service';
import {
  SystemOverviewReportDTO,
  BankPerformanceReportDTO,
  TransactionVolumeReportDTO,
  FinancialSummaryReportDTO
} from '../../../models/report.model';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  activeTab = 'overview';
  loading = false;
  error: string | null = null;

  // Date filters
  startDate: string = '';
  endDate: string = '';

  // Report data
  systemOverview: SystemOverviewReportDTO | null = null;
  bankPerformance: BankPerformanceReportDTO[] = [];
  transactionVolume: TransactionVolumeReportDTO | null = null;
  financialSummary: FinancialSummaryReportDTO | null = null;

  constructor(private reportService: SuperAdminReportService) {

 const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.endDate = this.formatDateForInput(today);
    this.startDate = this.formatDateForInput(lastWeek);

  }

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadSystemOverview();
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

  loadSystemOverview(): void {
    this.loading = true;
    this.error = null;

    this.reportService.getSystemOverview().subscribe({
      next: (data) => {
        this.systemOverview = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load system overview';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadSystemOverviewPdf(): void {
    this.reportService.downloadSystemOverviewPdf().subscribe({
      next: (blob) => {
        this.reportService.downloadFile(blob, `SystemOverview_${Date.now()}.pdf`);
      },
      error: (err) => {
        this.error = 'Failed to download PDF';
        console.error(err);
      }
    });
  }

 loadBankPerformance(): void {
  this.loading = true;
  this.reportService.getBankPerformance(new Date(this.startDate),new Date( this.endDate)).subscribe({
    next: (data: BankPerformanceReportDTO[]) => {
      this.bankPerformance = data.map(bank => ({
        ...bank,
        averagePaymentValue:
          bank.totalPayments > 0
            ? bank.totalPaymentValue / bank.totalPayments
            : 0
      }));
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading bank performance:', err);
      this.loading = false;
    }
  });
}



  downloadBankPerformancePdf(): void {
    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    this.reportService.downloadBankPerformancePdf(start, end).subscribe({
      next: (blob) => {
        this.reportService.downloadFile(blob, `BankPerformance_${Date.now()}.pdf`);
      },
      error: (err) => {
        this.error = 'Failed to download PDF';
        console.error(err);
      }
    });
  }

  loadTransactionVolume(): void {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    this.loading = true;
    this.reportService.getTransactionVolume(new Date(this.startDate), new Date(this.endDate))
      .subscribe({
        next: (data) => {
          this.transactionVolume = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading transaction volume:', error);
          alert('Failed to load report');
          this.loading = false;
        }
      });
  }

  getAveragePayment(): number {
    if (!this.transactionVolume || this.transactionVolume.totalPayments === 0) {
      return 0;
    }
    return this.transactionVolume.totalPaymentAmount / this.transactionVolume.totalPayments;
  }


  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  downloadTransactionVolumePdf(): void {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    this.loading = true;
    this.reportService.downloadTransactionVolumePdf(new Date(this.startDate), new Date(this.endDate))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `TransactionVolume_${this.startDate}_${this.endDate}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error downloading PDF:', error);
          alert('Failed to download PDF');
          this.loading = false;
        }
      });
    }

  loadFinancialSummary(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Please select both start and end dates';
      return;
    }

    this.loading = true;
    this.error = null;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    this.reportService.getFinancialSummary(start, end).subscribe({
      next: (data) => {
        this.financialSummary = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load financial summary';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadFinancialSummaryPdf(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Please select both start and end dates';
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    this.reportService.downloadFinancialSummaryPdf(start, end).subscribe({
      next: (blob) => {
        this.reportService.downloadFile(blob, `FinancialSummary_${Date.now()}.pdf`);
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

  calculatePercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

  getTotalTransactions(): number {
  if (!this.financialSummary?.bankWiseFinancials) return 0;
  return this.financialSummary.bankWiseFinancials.reduce(
    (sum, bank) => sum + bank.clientCount, 0
  );
}

getAverageTransactionValue(): number {
  if (!this.financialSummary?.bankWiseFinancials) return 0;
  const banks = this.financialSummary.bankWiseFinancials;
  const totalAvg = banks.reduce((sum, bank) => sum + bank.averageTransactionValue, 0);
  return banks.length > 0 ? totalAvg / banks.length : 0;
}

getHighestTransaction(): number {
  if (!this.financialSummary?.bankWiseFinancials) return 0;
  return Math.max(
    ...this.financialSummary.bankWiseFinancials.map(b => b.totalPaymentValue)
  );
}
}