import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BankUserService } from '../../services/bank-user.service';
import { Client, ClientVerificationRequest } from '../../models/client.model';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { VerificationStatus } from '../../models/payment.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  public Math = Math;
  VerificationStatus = VerificationStatus;

  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;

  statusFilter = 'All';
  searchTerm = '';

  currentPage = 1;
  itemsPerPage = 10;

  loading = false;
  showActionModal = false;
  loadingDocuments = false;
  uploadingDocument = false;

  documents: Document[] = [];
  selectedFile: File | null = null;
  selectedDocType: string = '';

  constructor(
    private bankUserService: BankUserService,
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
    
  }


  loadClients(): void {
    this.loading = true;
    this.bankUserService.getAllClients().subscribe({
      next: (clients) => {
        console.log(clients[1])
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
                           client.clientVerificationStatus === this.statusFilter;
      const matchesSearch = !this.searchTerm ||
                           client.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           client.clientEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
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
    this.documents = [];
    this.loadClientDocuments(client.clientId);
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.selectedClient = null;
    this.documents = [];
    this.selectedFile = null;
    this.selectedDocType = '';
  }

  updateClientStatus(status: VerificationStatus): void {
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

  loadClientDocuments(clientId: number): void {
    this.loadingDocuments = true;
    this.documentService.getDocumentsByClient(clientId).subscribe({
      next: (res) => {
        this.documents = res.data;
        this.loadingDocuments = false;
      },
      error: (err) => {
        console.error('Error loading documents:', err);
        this.loadingDocuments = false;
      }
    });
  }

  deleteDocument(documentId: number): void {
    if (!confirm('Are you sure you want to delete this document?')) return;

    this.documentService.deleteDocument(documentId).subscribe({
      next: (res) => {
        this.documents = this.documents.filter(d => d.documentId !== documentId);
      },
      error: (err) => {
        console.error('Error deleting document:', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadDocument(): void {
    if (!this.selectedFile || !this.selectedClient) {
      alert('Please select a file to upload');
      return;
    }

    this.uploadingDocument = true;
    const docType = this.selectedDocType || undefined;

    this.documentService.uploadDocument(this.selectedFile, this.selectedClient.clientId, docType).subscribe({
      next: (res) => {
        console.log('Document uploaded successfully', res);
        this.selectedFile = null;
        this.selectedDocType = '';
        this.uploadingDocument = false;
        this.loadClientDocuments(this.selectedClient!.clientId);
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        console.error('Error uploading document:', err);
        alert('Failed to upload document. Please try again.');
        this.uploadingDocument = false;
      }
    });
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