export interface Client {
  clientId: number;
  code: string;
  name: string;
  email: string;
  businessType: string;
  address: string;
  registerationNumber: string;
  verificationStatus: string;
  createdAt: Date;
  isActive: boolean;
  bankId: number;
  bankUserId: number;
}

export interface ClientCreation {
  clientCode: string;
  clientName: string;
  clientEmail: string;
  password: string;
  clientBusinessType: string;
  clientAddress: string;
  bankId: number;
  registerationNumber?: string;
}

export interface ClientVerificationRequest {
  verificationStatus: string;
  notes?: string;
}