export interface BankDTO {
  bankId: number;
  code: string;
  name: string;
  address: string;
  panNumber: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: Date;
  createdByAdminId: number;
}

export interface CreateBankDTO {
  code: string;
  name: string;
  address: string;
  panNumber: string;
  registrationNumber: string;
  contactEmail?: string;
  contactPhone?: string;
  createdByAdminId: number;
}

export interface UpdateBankDTO {
  name: string;
  address: string;
  panNumber: string;
  registrationNumber: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
}

// Extended for UI with client count
export interface BankWithClientsDTO extends BankDTO {
  clientCount?: number;
}
