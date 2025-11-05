// src/app/components/super-admin/bank-users/bank-users.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { BankService } from '../../../services/bank.service';
import { CommonModule } from '@angular/common';
import { BankDTO } from '../../../models/bank.model';
import { BankUserDTO } from '../../../models/bank-user.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-users',
  templateUrl: './bank-users.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule,FormsModule],
  styleUrls: ['./bank-users.component.css']
})
export class BankUsersComponent implements OnInit {
  bankId!: number;
  bank: BankDTO | null = null;
  bankUsers: BankUserDTO[] = [];
  filteredUsers: BankUserDTO[] = [];
  loading = true;

  // Filters
  searchTerm = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bankId = +params['bankId'];
      this.loadBankDetails();
      this.loadBankUsers();
    });
  }

  loadBankDetails(): void {
    this.bankService.getBankById(this.bankId).subscribe({
      next: (bank) => {
        this.bank = bank;
      },
      error: (err) => {
        console.error('Error loading bank:', err);
        alert('Bank not found');
        this.router.navigate(['/super-admin/banks']);
      }
    });
  }

  loadBankUsers(): void {
    this.loading = true;
    this.bankService.getAllBankUsers().subscribe({
      next: (users) => {
        // Filter users for this bank
        this.bankUsers = users.filter(user => user.bankId === this.bankId);
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bank users:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.bankUsers];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.code.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  getPaginatedUsers(): BankUserDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
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

  addBankUser(): void {
    this.router.navigate(['/super-admin/banks', this.bankId, 'users', 'create']);
  }

  editBankUser(user: BankUserDTO): void {
    this.router.navigate(['/super-admin/banks', this.bankId, 'users', 'edit', user.bankUserId]);
  }

  deleteBankUser(user: BankUserDTO): void {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.bankService.deleteBankUser(user.bankUserId).subscribe({
        next: () => {
          alert('Bank user deleted successfully');
          this.loadBankUsers();
        },
        error: (err) => {
          console.error('Error deleting bank user:', err);
          alert('Failed to delete bank user');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/super-admin/banks']);
  }
}