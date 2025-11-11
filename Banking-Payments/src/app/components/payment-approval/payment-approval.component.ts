
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { Payment, PaymentType, VerificationStatus, ApprovePaymentRequest } from '../../models/payment.model';

@Component({
  selector: 'app-payment-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-approval.component.html',
  styleUrls: ['./payment-approval.component.css']
})
export class PaymentApprovalComponent implements OnInit {
  public Math = Math;
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  selectedPayment: Payment | null = null;

  // Filters
  statusFilter = 'Pending';
  dateFilter = 'Last7Days';
  minAmount = 0;
  maxAmount = 999999999;

  // Stats
  pendingCount = 0;
  approvedTodayCount = 0;
  rejectedTodayCount = 0;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  loading = false;
  showDetailsModal = false;
  approvalNotes = '';

  // Enums for template
  PaymentType = PaymentType;
  VerificationStatus = VerificationStatus;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAllPaymentsByBank().subscribe({

      next: (payments) => {
          
        console.log('Payments from API:', payments);
        this.payments = payments;
        this.calculateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.pendingCount = this.payments.filter(
      p => p.status === VerificationStatus.Pending
    ).length;

    this.approvedTodayCount = this.payments.filter(
      p => p.status === VerificationStatus.Verified
    ).length;

    this.rejectedTodayCount = this.payments.filter(
      p => p.status === VerificationStatus.Rejected
    ).length;
  }

  applyFilters(): void {
  this.filteredPayments = this.payments.filter(payment => {
    const statusName =
      typeof payment.status === 'number'
        ? VerificationStatus[payment.status]
        : payment.status;

    const matchesStatus =
      this.statusFilter === 'All' || statusName === this.statusFilter;

    const matchesAmount =
      payment.amount >= this.minAmount && payment.amount <= this.maxAmount;

    const matchesDate = this.matchesDateFilter(payment.paymentDate);

    return matchesStatus && matchesAmount && matchesDate;
  });

  this.currentPage = 1;
}


  matchesDateFilter(paymentDate: Date): boolean {
    const date = new Date(paymentDate);
    const now = new Date();

    switch (this.dateFilter) {
      case 'Today':
        return date.toDateString() === now.toDateString();
      case 'Last7Days':
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= sevenDaysAgo;
      case 'Last30Days':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= thirtyDaysAgo;
      case 'All':
      default:
        return true;
    }
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openPaymentDetails(payment: Payment): void {
    this.selectedPayment = payment;
    this.showDetailsModal = true;
    this.approvalNotes = '';
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedPayment = null;
    this.approvalNotes = '';
  }

  approvePayment(): void {
    if (!this.selectedPayment) return;

    const request: ApprovePaymentRequest = {
      notes: this.approvalNotes || undefined
    };

    this.paymentService.approvePayment(this.selectedPayment.paymentId, request).subscribe({
      next: () => {
        alert('Payment approved successfully');
        this.loadPayments();
        this.closeDetailsModal();
      },
      error: (error) => {
        alert('Failed to approve payment: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }

  rejectPayment(): void {
    if (!this.selectedPayment) return;

    if (!this.approvalNotes) {
      alert('Please provide a reason for rejection');
      return;
    }

    const request: ApprovePaymentRequest = {
      notes: this.approvalNotes
    };

    this.paymentService.rejectPayment(this.selectedPayment.paymentId, request).subscribe({
      next: () => {
        alert('Payment rejected successfully');
        this.loadPayments();
        this.closeDetailsModal();
      },
      error: (error) => {
        alert('Failed to reject payment: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }

  getPaymentTypeName(type: PaymentType): string {
    return PaymentType[type];
  }

  getStatusName(status: VerificationStatus): string {
    return VerificationStatus[status];
  }

  getStatusClass(status: VerificationStatus): string {
    switch (status) {
      case VerificationStatus.Pending:
        return 'badge bg-warning';
      case VerificationStatus.Verified:
        return 'badge bg-success';
      case VerificationStatus.Rejected:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  get paginatedPayments(): Payment[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPayments.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPayments.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  exportPayments(): void {
    // TODO: Implement export functionality
    alert('Export functionality to be implemented');
  }

  refreshPayments(): void {
    this.loadPayments();
  }
}
