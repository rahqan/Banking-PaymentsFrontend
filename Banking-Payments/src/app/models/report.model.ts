export interface SystemOverviewReportDTO {
  totalBanks: number;
  activeBanks: number;
  totalClients: number;
  totalPaymentValue: number;
  pendingPayments: number;
  pendingVerifications: number;
  generatedAt: Date;
}

export interface BankPerformanceReportDTO {
  bankId: number;
  bankName: string;
  totalClients: number;
  activeClients: number;
  totalPayments: number;          
  totalPaymentValue: number;      
  averagePaymentValue: number;    
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
}

export interface TransactionVolumeReportDTO {
  startDate: Date;
  endDate: Date;
  totalPayments: number;
  totalPaymentAmount: number;
  totalSalaryDisbursements: number;
  totalSalaryAmount: number;
  paymentTypeBreakdown: PaymentTypeBreakdown;
  paymentStatusBreakdown: PaymentStatusBreakdown;
  bankWiseTransactions: BankTransactionSummary[];
  dailyTrends: DailyTransactionTrend[];
}

export interface PaymentTypeBreakdown {
  rtgsCount: number;
  rtgsAmount: number;
  impsCount: number;
  impsAmount: number;
  neftCount: number;
  neftAmount: number;
}

export interface PaymentStatusBreakdown {
  pendingCount: number;
  pendingAmount: number;
  approvedCount: number;
  approvedAmount: number;
  rejectedCount: number;
  rejectedAmount: number;
}

export interface BankTransactionSummary {
  bankId: number;
  bankName: string;
  transactionCount: number;
  totalAmount: number;
}

export interface DailyTransactionTrend {
  date: Date;
  transactionCount: number;
  totalAmount: number;
}

export interface FinancialSummaryReportDTO {
  startDate: Date;
  endDate: Date;
  totalMoneyFlow: number;
  totalPaymentsValue: number;
  totalSalariesValue: number;
  totalClientBalance: number;
  bankWiseFinancials: BankFinancialBreakdown[];
  topClientsByVolume?: TopClient[];
  monthlyTrend?: MonthlyFinancialTrend;
}

export interface BankFinancialBreakdown {
  bankId: number;
  bankName: string;
  clientCount: number;
  totalPaymentValue: number;
  totalSalaryValue: number;
  averageTransactionValue: number;
  totalClientBalance: number;
}

export interface TopClient {
  clientId: number;
  clientCode: string;
  clientName: string;
  bankName: string;
  transactionCount: number;
  totalTransactionValue: number;
}

export interface MonthlyFinancialTrend {
  month: number;
  year: number;
  totalPayments: number;
  totalSalaries: number;
}

// Bank User Report DTOs
export interface TransactionReportDTO {
  paymentId: number;
  paymentType: string;
  amount: number;
  paymentDate: string;
  status: string;
  clientName: string;
  beneficiaryName: string;
  beneficiaryAccountNumber: string;
  approvedByName: string;
  remarks: string;
}

export interface CustomerOnboardingReportDTO {
  startDate: Date;
  endDate: Date;
  totalOnboarded: number;
  pendingVerifications: number;
  approvedClients: number;
  rejectedClients: number;
  averageOnboardingDays: number;
  documentsUploaded: number;
  clientDetails: ClientOnboardingDetail[];
}

export interface ClientOnboardingDetail {
  clientId: number;
  clientCode: string;
  clientName: string;
  email: string;
  businessType: string;
  verificationStatus: string;
  createdAt: Date;
  approvedByName: string;
  documentCount: number;
  daysToVerify: number;
}

export interface OnboardingTimelineItem {
  date: Date;
  count: number;
  verified: number;
  pending: number;
}

export interface PaymentApprovalReportDTO {
  startDate: Date;
  endDate: Date;
  totalPayments: number;
  pendingApprovals: number;
  approvedPayments: number;
  rejectedPayments: number;
  totalApprovedAmount: number;
  totalRejectedAmount: number;
  averageApprovalTimeHours: number;
  bankUserPerformance: BankUserPerformance[];
  highValueTransactions: HighValueTransaction[];
}

export interface BankUserPerformance {
  bankUserCode:string;
  bankUserId: number;
  bankUserName: string;
  totalApproved: number;
  totalRejected: number;
  totalAmountApproved: number;
}

export interface HighValueTransaction {
  paymentId: number;
  amount: number;
  clientName: string;
  beneficiaryName: string;
  paymentDate: Date;
  status: string;
}

export interface ClientActivityReportDTO {
  clientId: number;
  clientCode: string;
  clientName: string;
  email: string;
  isActive: boolean;
  totalPayments: number;
  totalPaymentValue: number;
  totalEmployees: number;
  totalBeneficiaries: number;
  totalSalaryDisbursements: number;
  totalSalaryValue: number;
  lastActivityDate: Date;
  currentBalance: number;
}

//  Common Interfaces
export interface QuickStatsDTO {
  totalBanks: number;
  totalClients: number;
  pendingPayments: number;
  pendingVerifications: number;
  totalTransactionValue: number;
  activeBanks: number;
  todayDate: string;
}

export interface DashboardStatsDTO {
  pendingVerifications: number;
  pendingPayments: number;
  totalClients: number;
  activeClients: number;
  thisMonthOnboarding: number;
  thisMonthPayments: number;
  thisMonthPaymentValue: number;
  highValuePendingCount: number;
}