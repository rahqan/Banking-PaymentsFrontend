import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BankService } from '../../../services/bank.service';
import { BankDTO } from '../../../models/bank.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-list',
  standalone:true,
  imports:[CommonModule,RouterOutlet,FormsModule],
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent implements OnInit {
  banks: BankDTO[] = [];
  filteredBanks: BankDTO[] = [];
  loading = true;
toggleDropdown(event: Event) {
  const button = event.currentTarget as HTMLElement;
  const dropdown = button.nextElementSibling as HTMLElement;
  dropdown.classList.toggle('show');
  
  // Close when clicking outside
  const closeDropdown = (e: Event) => {
    if (!button.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
      dropdown.classList.remove('show');
      document.removeEventListener('click', closeDropdown);
    }
  };
  
  setTimeout(() => document.addEventListener('click', closeDropdown), 0);
}

  addBankUser(bank: any) {
    console.log(bank);
    
  this.router.navigate([`/admin/banks/${bank.bankId}/users/create`]);
}


  // Filters
  searchTerm = '';
  statusFilter = 'all';
  clientCountFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private bankService: BankService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBanks();
  }

  loadBanks(): void {
    this.loading = true;
    this.bankService.getAllBanksWithClientCount().subscribe({
      next: (banks) => {
        this.banks = banks;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading banks:', err);
        alert('Failed to load banks');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.banks];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(bank =>
        bank.name.toLowerCase().includes(term) ||
        bank.code.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (this.statusFilter === 'active') {
      filtered = filtered.filter(bank => bank.isActive);
    } else if (this.statusFilter === 'inactive') {
      filtered = filtered.filter(bank => !bank.isActive);
    }

    this.filteredBanks = filtered;
    this.totalPages = Math.ceil(this.filteredBanks.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.clientCountFilter = 'all';
    this.applyFilters();
  }

  getPaginatedBanks(): BankDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredBanks.slice(startIndex, endIndex);
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

  viewBank(bank: BankDTO): void {
    
    this.router.navigate(['/admin/banks', bank.bankId, 'users']);
  }

  editBank(bank: BankDTO): void {
    this.router.navigate(['/admin/banks', 'edit', bank.bankId]);
  }

  deleteBank(bank: BankDTO): void {
    if (confirm(`Are you sure you want to delete ${bank.name}?`)) {
      this.bankService.softDeleteBank(bank.bankId).subscribe({
        next: () => {
          alert('Bank deleted successfully');
          this.loadBanks();
        },
        error: (err) => {
          console.error('Error deleting bank:', err);
          alert('Failed to delete bank');
        }
      });
    }
  }

  addBank(): void {
    this.router.navigate(['/admin/banks', 'create']);
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'badge bg-success' : 'badge bg-secondary';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }
}