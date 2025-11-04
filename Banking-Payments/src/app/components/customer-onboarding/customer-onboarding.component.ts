import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BankUserService } from '../../services/bank-user.service';
import { DocumentService } from '../../services/document.service';
import { ClientCreation } from '../../models/client.model';

interface OnboardingStep {
  number: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-customer-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-onboarding.component.html',
  styleUrls: ['./customer-onboarding.component.css']
})
export class CustomerOnboardingComponent implements OnInit {
  currentStep = 1;
  steps: OnboardingStep[] = [
    { number: 1, title: 'Basic Info', completed: false },
    { number: 2, title: 'Documents', completed: false },
    { number: 3, title: 'Verification', completed: false }
  ];

  // Step 1: Basic Info
  clientData: ClientCreation = {
    clientCode: '',
    clientName: '',
    clientEmail: '',
    password: '',
    clientBusinessType: '',
    clientAddress: '',
    bankId: 1, // This should come from AuthService
    registerationNumber: ''
  };

  // Step 2: Document Upload
  uploadedFiles: { file: File; docType: string; preview?: string }[] = [];
  isDragging = false;

  // Temp storage for created client
  createdClientId: number | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private bankUserService: BankUserService,
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // You should load bankId from auth service
  }

  // Step Navigation
  nextStep(): void {
    if (this.currentStep === 1 && this.validateBasicInfo()) {
      this.createClient();
    } else if (this.currentStep === 2) {
      this.uploadDocuments();
    } else if (this.currentStep === 3) {
      this.completeOnboarding();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Step 1: Basic Info Validation
  validateBasicInfo(): boolean {
    if (!this.clientData.clientName || !this.clientData.clientEmail ||
        !this.clientData.clientCode || !this.clientData.password) {
      this.errorMessage = 'Please fill all required fields';
      return false;
    }
    return true;
  }

  createClient(): void {
    this.loading = true;
    this.errorMessage = '';

    this.bankUserService.createClient(this.clientData).subscribe({
      next: (client) => {
        this.createdClientId = client.clientId;
        this.steps[0].completed = true;
        this.currentStep = 2;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create client';
        this.loading = false;
      }
    });
  }

  // Step 2: Document Upload
  onFileSelect(event: Event, docType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files), docType);
    }
  }

  onDrop(event: DragEvent, docType: string): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files), docType);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  handleFiles(files: File[], docType: string): void {
    files.forEach(file => {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB.`);
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a valid file type. Please upload PDF, JPG, or PNG.`);
        return;
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedFiles.push({
            file,
            docType,
            preview: e.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      } else {
        this.uploadedFiles.push({ file, docType });
      }
    });
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  uploadDocuments(): void {
    if (!this.createdClientId) {
      this.errorMessage = 'Client ID not found. Please complete step 1 first.';
      return;
    }

    if (this.uploadedFiles.length === 0) {
      this.errorMessage = 'Please upload at least one document';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const uploadPromises = this.uploadedFiles.map(fileData =>
      this.documentService.uploadDocument(
        fileData.file,
        this.createdClientId!,
        fileData.docType
      ).toPromise()
    );

    Promise.all(uploadPromises)
      .then(() => {
        this.steps[1].completed = true;
        this.currentStep = 3;
        this.loading = false;
      })
      .catch(error => {
        this.errorMessage = 'Failed to upload some documents';
        this.loading = false;
      });
  }

  // Step 3: Complete
  completeOnboarding(): void {
    this.steps[2].completed = true;
    setTimeout(() => {
      this.router.navigate(['/bank/clients']);
    }, 1000);
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      this.router.navigate(['/bank/dashboard']);
    }
  }
}
