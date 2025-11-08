import { Component, OnInit } from '@angular/core';
import Beneficiary from '../../models/Beneficiary';
import BankDetails from '../../models/BankDetails ';
import Employee from '../../models/Employee';
import Payment from '../../models/Payment';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import PaymentDTO from '../../models/PaymentDTO';
import { PaymentType, VerificationStatus } from '../../models/payment.model';
import jsPDF from 'jspdf';
import SalaryDisbursement from '../../models/SalaryDisbursement';
import autoTable,{UserOptions} from 'jspdf-autotable';

@Component({
  selector: 'app-client',
  imports: [CommonModule,FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})


export class ClientComponent implements OnInit {
  activeTab: 'bank' | 'employees' | 'beneficiaries' | 'payments' | 'reports' = 'bank';
  searchTerm: string = '';
  // private clientId = localStorage.getItem("userId");
  clientId!:any;
  reportFromDate: string = '';
  reportToDate: string = '';

  // Modals
  showEmployeeModal: boolean = false;
  showBeneficiaryModal: boolean = false;
  showPaymentModal: boolean = false;
  isEditMode: boolean = false;
  salaryDisbursements!:SalaryDisbursement[];
  salaryDisbursementsDTO:SalaryDisbursementDTO[]=[];
  paymentReport!:Payment[];
  salaryDisbursement!:SalaryDisbursement;

  bankDetails: BankDetails = {
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branch: '',
    accountType: '',
    balance: 0
  };
  
  beneficiaries: Beneficiary[] = [];
  payments: Payment[] = [];
  employees: Employee[] = [];

  // Pagination
  employeePage: number = 1;
  employeePageSize: number = 5;

  get paginatedEmployees(): Employee[] {
    const filtered = this.filteredEmployees;
    const start = (this.employeePage - 1) * this.employeePageSize;
    const end = start + this.employeePageSize;
    return filtered.slice(start, end);
  }
  getMinEmployee():number{
    return Math.min(this.employeePage * this.employeePageSize, this.filteredEmployees.length);
  }
  changeEmployeePage(page: number): void {
    if (page >= 1 && page <= this.totalEmployeePages) {
      this.employeePage = page;
    }
  }
  previousEmployeePage(): void {
    if (this.employeePage > 1) {
      this.employeePage--;
    }
  }
  nextEmployeePage(): void {
    if (this.employeePage < this.totalEmployeePages) {
      this.employeePage++;
    }
  }
  get totalEmployeePages(): number {
    return Math.ceil(this.filteredEmployees.length / this.employeePageSize);
  }
  get employeePageNumbers(): number[] {
    return Array.from({ length: this.totalEmployeePages }, (_, i) => i + 1);
  }


  beneficiaryPage: number = 1;
  beneficiaryPageSize: number = 5;
  get paginatedBeneficiaries(): Beneficiary[] {
    const filtered = this.filteredBeneficiaries;
    const start = (this.beneficiaryPage - 1) * this.beneficiaryPageSize;
    const end = start + this.employeePageSize;
    return filtered.slice(start, end);
  }
  getMinBeneficiary():number{
    return Math.min(this.beneficiaryPage * this.beneficiaryPageSize, this.filteredBeneficiaries.length);
  }
  changeBeneficiaryPage(page: number): void {
    if (page >= 1 && page <= this.totalBeneficiaryPages) {
      this.beneficiaryPage = page;
    }
  }
  previousBeneficiaryPage(): void {
    if (this.beneficiaryPage > 1) {
      this.beneficiaryPage--;
    }
  }
  nextBeneficiaryPage(): void {
    if (this.beneficiaryPage < this.totalBeneficiaryPages) {
      this.beneficiaryPage++;
    }
  }
  get totalBeneficiaryPages(): number {
    return Math.ceil(this.filteredBeneficiaries.length / this.beneficiaryPageSize);
  }
  get beneficiaryPageNumbers(): number[] {
    return Array.from({ length: this.totalBeneficiaryPages }, (_, i) => i + 1);
  }
  
  paymentPage: number = 1;
  paymentPageSize: number = 10;
  get paginatedPayments(): Payment[] {
    const filtered = this.filteredPayments;
    const start = (this.paymentPage - 1) * this.paymentPageSize;
    const end = start + this.employeePageSize;
    return filtered.slice(start, end);
  }
  getMinPayment():number{
    return Math.min(this.paymentPage * this.paymentPageSize, this.filteredPayments.length);
  }
  changePaymentPage(page: number): void {
    if (page >= 1 && page <= this.totalPaymentPages) {
      this.paymentPage = page;
    }
  }
  previousPaymentPage(): void {
    if (this.paymentPage > 1) {
      this.paymentPage--;
    }
  }
  nextPaymentPage(): void {
    if (this.paymentPage < this.totalPaymentPages) {
      this.paymentPage++;
    }
  }
  get totalPaymentPages(): number {
    return Math.ceil(this.filteredPayments.length / this.paymentPageSize);
  }
  get paymentPageNumbers(): number[] {
    return Array.from({ length: this.totalPaymentPages }, (_, i) => i + 1);
  }

  // Form data
  currentEmployee: Employee = this.getEmptyEmployee();
  currentBeneficiary: Beneficiary = this.getEmptyBeneficiary();
  currentPayment: PaymentDTO = this.getEmptyPayment();
  selectedBeneficiaryId: number = 0; // Separate variable for dropdown

  constructor(private clientService: ClientService) {}
  

  ngOnInit(): void {
    this.loadAllData();
    this.clientId = localStorage.getItem("userId");
  }

  loadAllData(): void {
    // Load Bank Details
    this.clientService.getClientBankDetails().subscribe({
      next: (res) => {
        this.bankDetails = res;
        console.log('Bank Details:', res);
      },
      error: (error) => {
        console.error('Error loading bank details:', error);
      }
    });

    // Load Beneficiaries
    this.clientService.getAllBeneficiary().subscribe({
      next: (res) => {
        this.beneficiaries = res;
        console.log('Beneficiaries:', res);
      },
      error: (error) => {
        console.error('Error loading beneficiaries:', error);
      }
    });

    // Load Employees
    this.clientService.getAllEmployee().subscribe({
      next: (res) => {
        this.employees = res.employees || res;
        console.log('Employees:', res);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });

    // Load Payments
    this.clientService.getAllPayments().subscribe({
      next: (res) => {  
        this.payments = res;
        console.log('Payments:', res);
        console.log(this.payments);
        
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        // Initialize with empty array if API fails
        this.payments = [];
      }
    });
  }

  // Tab Management
  setActiveTab(tab: 'bank' | 'employees' | 'beneficiaries' | 'payments' | 'reports') {
    this.activeTab = tab;
    this.searchTerm = '';
  }

  // ==================== EMPLOYEE METHODS ====================
  
  getEmptyEmployee(): Employee {
    return {
      employeeId: 0,
      employeeCode:'',
      name: '',
      email: '',
      position: '',
      department: '',
      salary: 0,
      joinDate: '',
      accountNumber:'',
      ifscCode:'',
      address:'',
      clientId:0,
      isActive:true
    };
  }

  get filteredEmployees(): Employee[] {
    if (!this.employees || this.employees.length === 0) return [];
    if (!this.searchTerm) return this.employees;

    return this.employees.filter(emp =>
      emp.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddEmployeeModal() {
    console.log('Opening Add Employee Modal');
    this.isEditMode = false;
    this.currentEmployee = this.getEmptyEmployee();
    this.showEmployeeModal = true;
    console.log('Modal state:', this.showEmployeeModal);
  }

  openEditEmployeeModal(employee: Employee) {
    console.log('Opening Edit Employee Modal', employee);
    this.isEditMode = true;
    this.currentEmployee = { ...employee };
    this.showEmployeeModal = true;
  }

  saveEmployee() {
    // Validation
    if (!this.currentEmployee.name || !this.currentEmployee.email || 
        !this.currentEmployee.position || !this.currentEmployee.department || !this.currentEmployee.accountNumber
      || !this.currentEmployee.ifscCode || !this.currentEmployee.address) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEditMode) {
      // Update Employee - Call API
      // this.clientService.updateEmployee(this.currentEmployee.id, this.currentEmployee).subscribe({
      //   next: (res) => {
      //     console.log('Employee updated:', res);
      //     const index = this.employees.findIndex(e => e.id === this.currentEmployee.id);
      //     if (index !== -1) {
      //       this.employees[index] = { ...this.currentEmployee };
      //     }
      //     alert('Employee updated successfully');
      //     this.closeEmployeeModal();
      //   },
      //   error: (error) => {
      //     console.error('Error updating employee:', error);
      //     alert('Failed to update employee');
      //   }
      // });
    } else {
      // Add Employee - Call API
      this.currentEmployee.clientId = this.clientId;
      this.currentEmployee.employeeCode = "EM023";
      this.clientService.addEmployee(this.currentEmployee).subscribe({
        next: (res) => {
          console.log('Employee added:', res);
          this.employees.push(res);
          alert('Employee added successfully');
          this.closeEmployeeModal();
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          // alert('Failed to add employee');
          alert('Employee added successfully');
          this.loadAllData();
        }
      });
    }
  }
  selectedFile!: File;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
uploadCsv(){
    console.log(this.selectedFile);
    this.clientService.salaryDisbursementByCSV(this.selectedFile, this.clientId).subscribe({
      next:(next)=>{
        alert("Salary disbursement successfully");
      },
      error:(error)=>{
        alert("Something went wrong");
      }
    });
}

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.clientService.deleteEmployee(id).subscribe({
        next: () => {
          console.log('Employee deleted');
          alert('Employee deleted successfully');
          this.loadAllData();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee');
        }
      });
    }
  }

  salaryDisburment(id:number){
    if(confirm("Are you sure you want to disperse salary ?")){
      for(let index = 0; index < this.employees.length;index++){
        if(this.employees[index].employeeId == id){
          var j:SalaryDisbursement = {
            salaryDisbursementId:0,
            createdAt: new Date(),
            amount:this.employees[index].salary,
            employeeId:this.employees[index].employeeId,
            clientId:this.clientId
          }
          this.clientService.salaryDisburment(j).subscribe({
            next:(res)=>{
              alert("Salary dispersement successful!!!! ");
              console.log(res);
            },
            error:(error)=>{
              if (error.status === 409) { // HTTP 409 Conflict
              alert("Salary cannot be disbursed more than once a month!");
            } else {
              alert("Something went wrong!");
            }
            }
          });
        }
      }
    }
  }

  closeEmployeeModal() {
    console.log('Closing Employee Modal');
    this.showEmployeeModal = false;
    this.currentEmployee = this.getEmptyEmployee();
  }

  // ==================== BENEFICIARY METHODS ====================

  getEmptyBeneficiary(): Beneficiary {
    return {
      beneficiaryId: 0,
      name: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      relationShip: '',
      clientId: 0,
      isActive:true
    };
  }

  get filteredBeneficiaries(): Beneficiary[] {
    if (!this.beneficiaries || this.beneficiaries.length === 0) return [];
    if (!this.searchTerm) return this.beneficiaries;

    return this.beneficiaries.filter(ben =>
      ben.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ben.bankName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ben.accountNumber?.includes(this.searchTerm)
    );
  }

  openAddBeneficiaryModal() {
    console.log('Opening Add Beneficiary Modal');
    this.isEditMode = false;
    this.currentBeneficiary = this.getEmptyBeneficiary();
    this.showBeneficiaryModal = true;
  }

  openEditBeneficiaryModal(beneficiary: Beneficiary) {
    console.log('Opening Edit Beneficiary Modal', beneficiary);
    this.isEditMode = true;
    this.currentBeneficiary = { ...beneficiary };
    this.showBeneficiaryModal = true;
  }

  saveBeneficiary() {
    // Validation
    if (!this.currentBeneficiary.name || !this.currentBeneficiary.accountNumber ||
        !this.currentBeneficiary.ifscCode || !this.currentBeneficiary.bankName) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEditMode) {
      // Update Beneficiary - Call API
      // this.clientService.updateBeneficiary(this.currentBeneficiary.beneficiaryId, this.currentBeneficiary).subscribe({
      //   next: (res) => {
      //     console.log('Beneficiary updated:', res);
      //     const index = this.beneficiaries.findIndex(b => b.beneficiaryId === this.currentBeneficiary.beneficiaryId);
      //     if (index !== -1) {
      //       this.beneficiaries[index] = { ...this.currentBeneficiary };
      //     }
      //     alert('Beneficiary updated successfully');
      //     this.closeBeneficiaryModal();
      //   },
      //   error: (error) => {
      //     console.error('Error updating beneficiary:', error);
      //     alert('Failed to update beneficiary');
      //   }
      // });
    } else {
      // Add Beneficiary - Call API
      this.currentBeneficiary.clientId = this.clientId;
      this.clientService.addBeneficiary(this.currentBeneficiary).subscribe({
        next: (res) => {
          console.log('Beneficiary added:', res);
          this.beneficiaries.push(res);
          alert('Beneficiary added successfully');
          this.closeBeneficiaryModal();
        },
        error: (error) => {
          console.error('Error adding beneficiary:', error);
          alert('Failed to add beneficiary');
        }
      });
    }
  }

  deleteBeneficiary(id: number) {
    // if (confirm('Are you sure you want to delete this beneficiary?')) {
    //   this.clientService.deleteBeneficiary(id).subscribe({
    //     next: () => {
    //       console.log('Beneficiary deleted');
    //       this.beneficiaries = this.beneficiaries.filter(b => b.beneficiaryId !== id);
    //       alert('Beneficiary deleted successfully');
    //     },
    //     error: (error) => {
    //       console.error('Error deleting beneficiary:', error);
    //       alert('Failed to delete beneficiary');
    //     }
    //   });
    // }
  }

  closeBeneficiaryModal() {
    console.log('Closing Beneficiary Modal');
    this.showBeneficiaryModal = false;
    this.currentBeneficiary = this.getEmptyBeneficiary();
  }

  // ==================== PAYMENT METHODS ====================

  getEmptyPayment(): PaymentDTO {
    var temp = new Date();
    return {
      paymentId: 0,
      amount:0,
      paymentDate:temp,
      status:VerificationStatus.Pending,
      type:PaymentType.RTGS,
      beneficiaryId:0,
      clientId:0,
      remarks:''
    };
  }

  get filteredPayments(): Payment[] {
    if (!this.payments || this.payments.length === 0) return [];
    if (!this.searchTerm) return this.payments;

    return this.payments.filter(payment =>
     String(payment.status)?.toLowerCase()
.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      String(payment.status)?.toLowerCase()
.includes(this.searchTerm) ||
      String(payment.status)?.toLowerCase()
.includes(this.searchTerm.toLowerCase())
    );
  }

  openMakePaymentModal() {
    console.log('Opening Make Payment Modal');
    this.currentPayment = this.getEmptyPayment();
    this.selectedBeneficiaryId = 0;
    
    // Set current date
    const today = new Date();
    this.currentPayment.paymentDate = today;
    
    this.showPaymentModal = true;
    console.log('Payment Modal state:', this.showPaymentModal);
  }

  makePayment() {
    // Validation
    if (this.selectedBeneficiaryId === 0) {
      alert('Please select a beneficiary');
      return;
    }

    if (!this.currentPayment.amount || this.currentPayment.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (this.currentPayment.amount > this.bankDetails.balance) {
      console.log(this.bankDetails.balance + " & " + this.currentPayment.amount);
      
      alert('Insufficient balance!');
      return;
    }

    // Find beneficiary details
    const beneficiary = this.beneficiaries.find(b => b.beneficiaryId == this.selectedBeneficiaryId);
    if (!beneficiary) {
      alert('Beneficiary not found');
      return;
    }

    console.log("Inside => " + this.currentPayment);

    this.currentPayment.beneficiaryId = this.selectedBeneficiaryId;
    this.currentPayment.clientId = this.clientId;
    // Call API to make payment
    this.clientService.addPayment(this.currentPayment).subscribe({
      next: (res) => {
        console.log('Payment successful:', res);
        
        // Update local balance
        this.bankDetails.balance -= this.currentPayment.amount;
        
        alert('Payment successful!');
        this.closePaymentModal();
        this.loadAllData();
      },
      error: (error) => {
        console.error('Error making payment:', error);
        alert('Payment failed. Please try again.');
      }
    });
  }

  closePaymentModal() {
    console.log('Closing Payment Modal');
    this.showPaymentModal = false;
    this.currentPayment = this.getEmptyPayment();
    this.selectedBeneficiaryId = 0;
  }

  getStatusClass(status: string): string {
    switch (String(status)?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  getSelectedBeneficiary(): Beneficiary | undefined {
    for (let index = 0; index < this.beneficiaries.length; index++) {
      if(this.beneficiaries.at(index)?.beneficiaryId == this.selectedBeneficiaryId){
        return this.beneficiaries.at(index);
      }
    }
    return undefined;
  }

  generateSalaryReport(){
    const doc = new jsPDF();
    this.clientService.getSalaryDisbursement().subscribe({
      next:(res)=>{
        this.salaryDisbursements = res;
        for (let i = 0; i < res.length; i++) {
          this.salaryDisbursementsDTO.push({
          amount: this.salaryDisbursements[i].amount,
          name: this.salaryDisbursements[i].employee?.name,
          createdAt: new Date(this.salaryDisbursements[i].createdAt).toDateString(),
          salary: this.salaryDisbursements[i].employee?.salary,
          position: this.salaryDisbursements[i].employee?.position,
          department: this.salaryDisbursements[i].employee?.department
          });
        }

        doc.setFontSize(20);
        doc.text('Salary Disbursement Report', 14, 22);
        console.log(this.reportFromDate + " & " + this.reportToDate);
        doc.setFontSize(16);
        doc.text(`Period: ${this.reportFromDate} to ${this.reportToDate}`, 14, 32);

        // doc.text('User Data Report', 14, 15);
        const columns = Object.keys(this.salaryDisbursementsDTO[0]).map(key => ({ header: key.toUpperCase(), dataKey: key }));
        const options:UserOptions = {
          columns,
          body: this.salaryDisbursementsDTO.map(item => ({ ...item })),
          startY: 25,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [22, 160, 133] },
        }

        autoTable(doc, options);
        doc.save('salary-report.pdf');
      },
      error:(error)=>{
        console.log(error);
        
      }
    });
  }

  generatePaymentReport(){
    alert("Sure want to download");
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    var temp = `Period :: ${this.reportFromDate.toString()} to ${this.reportToDate.toString()}`;
    doc.text(temp, 14, 22);
    console.log(this.reportFromDate + " & " + this.reportToDate);
    doc.setFontSize(16);
    doc.text(`Period: ${this.reportFromDate} to ${this.reportToDate}`, 14, 32);
    this.clientService.getSalaryDisbursement().subscribe({
      next:(res)=>{
        this.salaryDisbursements = res;
        for (let i = 0; i < res.length; i++) {
          this.salaryDisbursementsDTO.push({
          amount: this.salaryDisbursements[i].amount,
          name: this.salaryDisbursements[i].employee?.name,
          createdAt: new Date(this.salaryDisbursements[i].createdAt).toDateString(),
          salary: this.salaryDisbursements[i].employee?.salary,
          position: this.salaryDisbursements[i].employee?.position,
          department: this.salaryDisbursements[i].employee?.department
          });
        }

        
        const columns = Object.keys(this.salaryDisbursementsDTO[0]).map(key => ({ header: key.toUpperCase(), dataKey: key }));
        const options:UserOptions = {
          columns,
          body: this.salaryDisbursementsDTO.map(item => ({ ...item })),
          startY: 25,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [22, 160, 133] },
        }

        autoTable(doc, options);
        alert("Download");
        doc.save('salary-report.pdf');
      },
      error:(error)=>{
        console.log(error);
        
      }
    });
  }
}

interface SalaryDisbursementDTO{
  name?:string;
  amount:number;
  createdAt:string;
  salary?:number;
  position?:string;
  department?:string;
};