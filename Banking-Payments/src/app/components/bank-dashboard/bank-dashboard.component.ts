import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BankUserService } from '../../services/bank-user.service';
import { PaymentService } from '../../services/payment.service';
import { Client } from '../../models/client.model';
import { Payment, VerificationStatus } from '../../models/payment.model';
import { PagedResult } from '../../models/PagedResult';

interface DashboardStats {
  totalClients: number;
  pendingOnboard: number;
  verifiedClients: number;
  paymentApprovals: number;
  newDocs: number;
}

@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bank-dashboard.component.html',
  styleUrls: ['./bank-dashboard.component.css']
})
export class BankDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalClients: 0,
    pendingOnboard: 0,
    verifiedClients: 0,
    paymentApprovals: 0,
    newDocs: 0
  };

  clients: Client[] = [];
  pendingPayments: Payment[] = [];
  loading = true;

  constructor(
    private bankUserService: BankUserService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load stats separately
    this.bankUserService.getClientStats().subscribe({
      next: (stats) => {
        console.log(stats)
        this.stats.totalClients = stats.totalClients;
        this.stats.pendingOnboard = stats.pendingOnboard;
        this.stats.verifiedClients = stats.verifiedClients;
      },
      error: (error) => console.error('Error loading stats:', error)
    });

    // Load first page of clients for display (recent 5)
    this.bankUserService.getAllClients(1, 5).subscribe({
      next: (res: PagedResult<Client>) => {
        this.clients = res.data;
      },
      error: (error) => console.error('Error loading clients:', error)
    });

    // Load pending payments
    this.paymentService.getPendingPayments().subscribe({
      next: (payments) => {
        this.pendingPayments = payments.slice(0, 5);
        this.stats.paymentApprovals = payments.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading = false;
      }
    });
  }

  navigateToOnboarding(): void {
    this.router.navigate(['/bank/clients/onboard']);
  }

  navigateToApprovals(): void {
    this.router.navigate(['/bank/payments']);
  }

  navigateToClients(): void {
    this.router.navigate(['/bank/clients']);
  }
}