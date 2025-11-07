import { Client } from "./client.model";

export enum PaymentType {
  RTGS = 0,
  IMPS = 1,
  NEFT = 2
}

export enum VerificationStatus {
  Pending = 0,
  Verified = 1,
  Rejected = -1
}


// export enum VerificationStatus {
//   Pending = 0,
//   Verified = 1,
//   Rejected = 2
// }


export interface Payment {
  paymentId: number;
  amount: number;
  paymentDate: Date;
  status: VerificationStatus;
  type: PaymentType;
  beneficiaryId: number;
  clientId: number;
  bankUserId: number;
  beneficiary?: Beneficiary;
  client?: Client;
  rejectionRemark?:string;
  remarks:string;
}

export interface Beneficiary {
  beneficiaryId: number;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface ApprovePaymentRequest {
  notes?: string;
}
