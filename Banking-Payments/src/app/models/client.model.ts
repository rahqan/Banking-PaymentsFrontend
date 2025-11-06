import { VerificationStatus } from "./payment.model";

export interface Client {
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientBusinessType: string;
  clientVerificationStatus: string;
  createdAt: string;
}


export interface ClientCreation {
  // clientCode: string;
  clientName: string;
  clientEmail: string;
  clientPassword: string;
  clientBusinessType: string;
  clientAddress: string;
  // bankId: number;
  registerationNumber?: string;
}

export interface ClientVerificationRequest {
  verificationStatus: VerificationStatus;
  notes?: string;
}

