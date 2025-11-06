import Beneficiary from "./Beneficiary";
import { Client } from "./client.model";
import { PaymentType, VerificationStatus } from "./payment.model";

interface PaymentDTO {
  paymentId: number;
  amount: number;
  paymentDate: Date;
  status: VerificationStatus;
  type: PaymentType;
  beneficiaryId: number;
  remarks:string;
  clientId: number;
  bankUserId?: number;
  beneficiary?: Beneficiary;
  client?: Client;
}

export default PaymentDTO;