interface Payment {
  paymentId: number;
  amount:number;
  paymentDate:string;
  status:string;
  type:string;
  remarks:string;
  beneficiary:{
    beneficiaryId:number,
    name:string
  };
}

export default Payment;