import { Component, OnInit } from '@angular/core';
import Beneficiary from '../../models/Beneficiary';
import BankDetails from '../../models/BankDetails ';
import Employee from '../../models/Employee';
import Payment from '../../models/Payment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client',
  imports: [CommonModule,FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})


export class ClientComponent implements OnInit {
  activeTab: 'bank' | 'employees' | 'beneficiaries' | 'payments' = 'bank';
  searchTerm: string = '';

  constructor(private clientService:ClientService) {
    
  }
  
  // Modals
  showEmployeeModal: boolean = false;
  showBeneficiaryModal: boolean = false;
  showPaymentModal: boolean = false;
  isEditMode: boolean = false;
  bankDetails: BankDetails
  = {
    accountHolder: 'ABC Corporation',
    accountNumber: '1234567890',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0001234',
    branch: 'Mumbai Main Branch',
    accountType: 'Current Account',
    balance: 5000000
  };

  beneficiaries!: Beneficiary[] 
  // = [
  //   {
  //     beneficiaryId: 1,
  //     name: 'Vendor Services Pvt Ltd',
  //     accountNumber: '9876543210',
  //     ifscCode: 'HDFC0001234',
  //     bankName: 'HDFC Bank',
  //     relationship: 'Vendor',
  //     clientId:1
  //   },
  //   {
  //     beneficiaryId: 2,
  //     name: 'Office Supplies Co',
  //     accountNumber: '5555666677',
  //     ifscCode: 'ICIC0005678',
  //     bankName: 'ICICI Bank',
  //     relationship: 'Supplier',
  //     clientId:1
  //   }
  // ];

  employees: Employee[] = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@company.com',
      position: 'Senior Developer',
      department: 'IT',
      salary: 80000,
      joinDate: '2020-01-15'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@company.com',
      position: 'HR Manager',
      department: 'Human Resources',
      salary: 75000,
      joinDate: '2019-06-20'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit@company.com',
      position: 'Accountant',
      department: 'Finance',
      salary: 60000,
      joinDate: '2021-03-10'
    }
  ];
  
  ngOnInit(): void {
    this.clientService.getClientBankDetails().subscribe({
      next:(res)=>{
       
        
        this.bankDetails = res;
         console.log(res);
      },
      error:(error)=>{
        console.log(error);
      }
    });

    this.clientService.getAllBeneficiary().subscribe({
      next:(res)=>{
        this.beneficiaries = res;
      },
      error:(error)=>{
        console.log(error);
        
      }
    });

    this.clientService.getAllEmployee().subscribe({
      next:(res)=>{
        console.log(res);
        this.employees = res.employees;
      }
    });
  }

  // Bank Details
  //  = {
  //   accountHolder: 'ABC Corporation',
  //   accountNumber: '1234567890',
  //   bankName: 'State Bank of India',
  //   ifscCode: 'SBIN0001234',
  //   branch: 'Mumbai Main Branch',
  //   accountType: 'Current Account',
  //   balance: 5000000
  // };
  
  // Employees
  // 
  
  // Payments
  payments: Payment[] = [
    {
      id: 1,
      beneficiaryId: 1,
      beneficiaryName: 'Vendor Services Pvt Ltd',
      amount: 50000,
      date: '2024-10-15',
      status: 'Completed',
      transactionId: 'TXN001234567',
      remarks: 'Invoice payment for services'
    },
    {
      id: 2,
      beneficiaryId: 2,
      beneficiaryName: 'Office Supplies Co',
      amount: 25000,
      date: '2024-10-20',
      status: 'Completed',
      transactionId: 'TXN001234568',
      remarks: 'Office equipment purchase'
    },
    {
      id: 3,
      beneficiaryId: 1,
      beneficiaryName: 'Vendor Services Pvt Ltd',
      amount: 75000,
      date: '2024-10-28',
      status: 'Pending',
      transactionId: 'TXN001234569',
      remarks: 'Monthly retainer fee'
    }
  ];
  
  // Form data
  currentEmployee: Employee = this.getEmptyEmployee();
  currentBeneficiary: Beneficiary = this.getEmptyBeneficiary();
  currentPayment: Payment = this.getEmptyPayment();
  
  // Tab Management
  setActiveTab(tab: 'bank' | 'employees' | 'beneficiaries' | 'payments') {
    this.activeTab = tab;
    this.searchTerm = '';
  }
  
  // Employee Methods
  getEmptyEmployee(): Employee {
    return {
      id: 0,
      name: '',
      email: '',
      position: '',
      department: '',
      salary: 0,
      joinDate: ''
    };
  }
  
  get filteredEmployees(): Employee[] {
    if (!this.searchTerm) return this.employees;
    
    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  openAddEmployeeModal() {
    this.isEditMode = false;
    this.currentEmployee = this.getEmptyEmployee();
    this.showEmployeeModal = true;
  }
  
  openEditEmployeeModal(employee: Employee) {
    this.isEditMode = true;
    this.currentEmployee = { ...employee };
    this.showEmployeeModal = true;
  }
  
  saveEmployee() {
    if (this.isEditMode) {
      const index = this.employees.findIndex(e => e.id === this.currentEmployee.id);
      if (index !== -1) {
        this.employees[index] = { ...this.currentEmployee };
      }
    } else {
      this.currentEmployee.id = Math.max(...this.employees.map(e => e.id), 0) + 1;
      this.employees.push({ ...this.currentEmployee });
    }
    this.closeEmployeeModal();
  }
  
  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employees = this.employees.filter(e => e.id !== id);
    }
  }
  
  closeEmployeeModal() {
    this.showEmployeeModal = false;
    this.currentEmployee = this.getEmptyEmployee();
  }
  
  // Beneficiary Methods
  getEmptyBeneficiary(): Beneficiary {
    return {
      beneficiaryId: 0,
      name: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      relationShip: '',
      clientId:0
    };
  }
  
  get filteredBeneficiaries(): Beneficiary[] {
    if (!this.searchTerm) return this.beneficiaries;
    
    return this.beneficiaries.filter(ben =>
      ben.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ben.bankName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ben.accountNumber.includes(this.searchTerm)
    );
  }
  
  openAddBeneficiaryModal() {
    this.isEditMode = false;
    this.currentBeneficiary = this.getEmptyBeneficiary();
    this.showBeneficiaryModal = true;
  }
  
  openEditBeneficiaryModal(beneficiary: Beneficiary) {
    this.isEditMode = true;
    this.currentBeneficiary = { ...beneficiary };
    this.showBeneficiaryModal = true;
  }
  
  saveBeneficiary() {
    if (this.isEditMode) {
      const index = this.beneficiaries.findIndex(b => b.beneficiaryId === this.currentBeneficiary.beneficiaryId);
      if (index !== -1) {
        this.beneficiaries[index] = { ...this.currentBeneficiary };
      }
    } else {
      this.currentBeneficiary.beneficiaryId = Math.max(...this.beneficiaries.map(b => b.beneficiaryId), 0) + 1;
      this.beneficiaries.push({ ...this.currentBeneficiary });
    }
    this.closeBeneficiaryModal();
  }
  
  deleteBeneficiary(id: number) {
    if (confirm('Are you sure you want to delete this beneficiary?')) {
      this.beneficiaries = this.beneficiaries.filter(b => b.beneficiaryId !== id);
    }
  }
  
  closeBeneficiaryModal() {
    this.showBeneficiaryModal = false;
    this.currentBeneficiary = this.getEmptyBeneficiary();
  }
  
  // Payment Methods
  getEmptyPayment(): Payment {
    return {
      id: 0,
      beneficiaryId: 0,
      beneficiaryName: '',
      amount: 0,
      date: '',
      status: 'Pending',
      transactionId: '',
      remarks: ''
    };
  }
  
  get filteredPayments(): Payment[] {
    if (!this.searchTerm) return this.payments;
    
    return this.payments.filter(payment =>
      payment.beneficiaryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      payment.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  openMakePaymentModal() {
    this.currentPayment = this.getEmptyPayment();
    // Set current date
    const today = new Date().toISOString().split('T')[0];
    this.currentPayment.date = today;
    this.showPaymentModal = true;
  }
  
  makePayment() {
    // Find beneficiary details
    const beneficiary = this.beneficiaries.find(b => b.beneficiaryId === this.currentPayment.beneficiaryId);
    if (!beneficiary) {
      alert('Please select a beneficiary');
      return;
    }
    
    if (this.currentPayment.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (this.currentPayment.amount > this.bankDetails.balance) {
      alert('Insufficient balance!');
      return;
    }
    
    // Create new payment
    this.currentPayment.id = Math.max(...this.payments.map(p => p.id), 0) + 1;
    this.currentPayment.beneficiaryName = beneficiary.name;
    this.currentPayment.status = 'Completed';
    this.currentPayment.transactionId = 'TXN' + Date.now().toString().slice(-9);
    
    // Deduct from balance
    this.bankDetails.balance -= this.currentPayment.amount;
    
    // Add payment to list
    this.payments.unshift({ ...this.currentPayment });
    
    this.closePaymentModal();
    alert('Payment successful!');
  }
  
  closePaymentModal() {
    this.showPaymentModal = false;
    this.currentPayment = this.getEmptyPayment();
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'Pending': return 'status-pending';
      case 'Failed': return 'status-failed';
      default: return '';
    }
  }
  
  getSelectedBeneficiary(): Beneficiary | undefined {
    return this.beneficiaries.find(b => b.beneficiaryId === this.currentPayment.beneficiaryId);
  }
}
