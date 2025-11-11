import { VerificationStatus } from "./payment.model";

export interface Client {
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientBusinessType: string;
  clientVerificationStatus: string;
  createdAt: Date;
}

export interface ClientBankDetails {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  balance: number;
  ifscCode: string;
  accountType?: string;
  branch: string;
}

export interface ClientCreation {
  clientName: string;
  clientEmail: string;
  clientPassword: string;
  clientBusinessType: string;
  clientAddress: string;
  registerationNumber?: string;
  bankDetails: ClientBankDetails;
}

export interface ClientVerificationRequest {
  verificationStatus: VerificationStatus;
  notes?: string;
}

