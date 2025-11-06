import { VerificationStatus } from "./payment.model";

interface Payment {
  id: number;
  beneficiaryId: number;
  beneficiaryName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  // status:VerificationStatus
  transactionId: string;
  remarks: string;
}

export default Payment;
