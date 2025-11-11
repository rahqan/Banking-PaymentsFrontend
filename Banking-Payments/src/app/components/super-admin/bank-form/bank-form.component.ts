import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BankService } from '../../../services/bank.service';
import { CommonModule } from '@angular/common';
import { CreateBankDTO, UpdateBankDTO } from '../../../models/bank.model';

@Component({
  selector: 'app-bank-form',
  templateUrl: './bank-form.component.html',
  standalone:true,
  imports:[RouterOutlet,CommonModule,FormsModule,ReactiveFormsModule],
  styleUrls: ['./bank-form.component.css']
})
export class BankFormComponent implements OnInit {
  bankForm!: FormGroup;
  isEditMode = false;
  bankId: number | null = null;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.bankId = +params['id'];
        this.loadBankData();
      }
    });
  }

  initForm(): void {
    this.bankForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      panNumber: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      contactEmail: ['', [Validators.email]],
      contactPhone: [''],
      isActive: [true]
    });

    if (this.isEditMode) {
      this.bankForm.get('code')?.disable();
    }
  }

  loadBankData(): void {
    if (!this.bankId) return;

    this.loading = true;
    this.bankService.getBankById(this.bankId).subscribe({
      next: (bank) => {
        this.bankForm.patchValue({
          code: bank.code,
          name: bank.name,
          address: bank.address,
          panNumber: bank.panNumber,
          registrationNumber: bank.registrationNumber,
          contactEmail: bank.contactEmail,
          contactPhone: bank.contactPhone,
          isActive: bank.isActive
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bank:', err);
        alert('Bank not found');
        this.router.navigate(['/admin/banks']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bankForm.invalid) {
      Object.keys(this.bankForm.controls).forEach(key => {
        this.bankForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.bankId) {
      this.updateBank();
    } else {
      this.createBank();
    }
  }

  createBank(): void {
    const adminId = parseInt(localStorage.getItem('userId') || '0');

    const createDto: CreateBankDTO = {
      ...this.bankForm.value,
      createdByAdminId: adminId
    };

    this.bankService.createBank(createDto).subscribe({
      next: () => {
        alert('Bank created successfully');
        this.router.navigate(['/admin/banks']);
      },
      error: (err) => {
        console.error('Error creating bank:', err);
        alert('Failed to create bank: ' + (err.error?.message || 'Unknown error'));
        this.submitting = false;
      }
    });
  }

  updateBank(): void {
    if (!this.bankId) return;

    const updateDto: UpdateBankDTO = {
      name: this.bankForm.value.name,
      address: this.bankForm.value.address,
      panNumber: this.bankForm.value.panNumber,
      registrationNumber: this.bankForm.value.registrationNumber,
      contactEmail: this.bankForm.value.contactEmail,
      contactPhone: this.bankForm.value.contactPhone,
      isActive: this.bankForm.value.isActive
    };

    this.bankService.updateBank(this.bankId, updateDto).subscribe({
      next: () => {
        alert('Bank updated successfully');
        this.router.navigate(['/admin/banks']);
      },
      error: (err) => {
        console.error('Error updating bank:', err);
        alert('Failed to update bank: ' + (err.error?.message || 'Unknown error'));
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/banks']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bankForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bankForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Invalid email format';
    }
    return '';
  }
}