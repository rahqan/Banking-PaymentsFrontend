export interface DashboardStats {
  totalBanks: number;
  activeBanks: number;
  activeBankUsers: number;
}

export interface BankDistribution {
  bankName: string;
  clientCount: number;
  percentage: number;
}

export interface RecentActivity {
  id: number;
  description: string;
  timestamp: Date;
  type: 'bank' | 'user' | 'report';
}