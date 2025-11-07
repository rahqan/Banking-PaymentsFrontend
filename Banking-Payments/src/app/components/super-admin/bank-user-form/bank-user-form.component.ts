// src/app/components/super-admin/bank-user-form/bank-user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { BankService } from '../../../services/bank.service';
import { CommonModule } from '@angular/common';
import { CreateBankUserDTO, UpdateBankUserDTO } from '../../../models/bank-user.model';

@Component({
  selector: 'app-bank-user-form',
  templateUrl: './bank-user-form.component.html',
standalone:true,
imports:[RouterModule,CommonModule,ReactiveFormsModule,FormsModule],

  styleUrls: ['./bank-user-form.component.css']
})
export class BankUserFormComponent implements OnInit {
  bankUserForm!: FormGroup;
  isEditMode = false;
  bankUserId: number | null = null;
  bankId!: number;
  loading = false;
  submitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bankId = +params['bankId'];

      if (params['userId']) {
        this.isEditMode = true;
        this.bankUserId = +params['userId'];
        this.loadBankUserData();
      }
    });

    this.initForm();
  }

  initForm(): void {
    this.bankUserForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required]]
    });

    // Disable code field in edit mode
    if (this.isEditMode) {
      this.bankUserForm.get('code')?.disable();
    }
  }

  loadBankUserData(): void {
    if (!this.bankUserId) return;

    this.loading = true;
    this.bankService.getBankUserById(this.bankUserId).subscribe({
      next: (user) => {
        this.bankUserForm.patchValue({
          code: user.code,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bank user:', err);
        alert('Bank user not found');
        this.router.navigate(['/admin/banks', this.bankId, 'users']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bankUserForm.invalid) {
      Object.keys(this.bankUserForm.controls).forEach(key => {
        this.bankUserForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.bankUserId) {
      this.updateBankUser();
    } else {
      this.createBankUser();
    }
  }

  createBankUser(): void {
    const createDto: CreateBankUserDTO = {
      ...this.bankUserForm.value,
      bankId: this.bankId
    };

    this.bankService.createBankUser(createDto).subscribe({
      next: () => {
        alert('Bank user created successfully');
        this.router.navigate(['/admin/banks', this.bankId, 'users']);
      },
      error: (err) => {
        console.error('Error creating bank user:', err);
        alert('Failed to create bank user: ' + (err.error?.message || 'Unknown error'));
        this.submitting = false;
      }
    });
  }

  updateBankUser(): void {
    if (!this.bankUserId) return;

    const updateDto: UpdateBankUserDTO = {
      name: this.bankUserForm.value.name,
      email: this.bankUserForm.value.email,
      phoneNumber: this.bankUserForm.value.phoneNumber,
      bankId: this.bankId
    };

    this.bankService.updateBankUser(this.bankUserId, updateDto).subscribe({
      next: () => {
        alert('Bank user updated successfully');
        this.router.navigate(['/admin/banks', this.bankId, 'users']);
      },
      error: (err) => {
        console.error('Error updating bank user:', err);
        alert('Failed to update bank user: ' + (err.error?.message || 'Unknown error'));
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/banks', this.bankId, 'users']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bankUserForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bankUserForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Invalid email format';
    }
    if (field?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}