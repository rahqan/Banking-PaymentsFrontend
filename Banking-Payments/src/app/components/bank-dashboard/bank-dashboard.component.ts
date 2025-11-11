import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BankUserService } from '../../services/bank-user.service';
import { PaymentService } from '../../services/payment.service';
import { Client } from '../../models/client.model';
import { Payment, VerificationStatus } from '../../models/payment.model';

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

    // Load all clients
    this.bankUserService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.stats.totalClients = clients.length;
        this.stats.pendingOnboard = clients.filter(c => c.clientVerificationStatus === 'Pending').length;
        this.stats.verifiedClients = clients.filter(c => c.clientVerificationStatus === 'Verified').length;
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