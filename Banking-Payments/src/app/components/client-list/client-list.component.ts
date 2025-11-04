import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BankUserService } from '../../services/bank-user.service';
import { Client, ClientVerificationRequest } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  public Math = Math;
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;

  // Filters
  statusFilter = 'All';
  searchTerm = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  loading = false;
  showActionModal = false;

  constructor(
    private bankUserService: BankUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.bankUserService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredClients = this.clients.filter(client => {
      const matchesStatus = this.statusFilter === 'All' ||
                           client.verificationStatus === this.statusFilter;
      const matchesSearch = !this.searchTerm ||
                           client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  openActionModal(client: Client): void {
    this.selectedClient = client;
    this.showActionModal = true;
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.selectedClient = null;
  }

  updateClientStatus(status: string): void {
    if (!this.selectedClient) return;

    const request: ClientVerificationRequest = {
      verificationStatus: status,
      notes: `Status updated to ${status}`
    };

    this.bankUserService.verifyClient(this.selectedClient.clientId, request).subscribe({
      next: () => {
        this.loadClients();
        this.closeActionModal();
      },
      error: (error) => {
        console.error('Error updating client status:', error);
      }
    });
  }

  deleteClient(clientId: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.bankUserService.deleteClient(clientId).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error) => {
          console.error('Error deleting client:', error);
        }
      });
    }
  }

  get paginatedClients(): Client[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredClients.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredClients.length / this.itemsPerPage);
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
}