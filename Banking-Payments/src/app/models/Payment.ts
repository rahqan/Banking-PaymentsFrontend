interface Payment {
  id: number;
  beneficiaryId: number;
  beneficiaryName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  transactionId: string;
  remarks: string;
}

export default Payment;