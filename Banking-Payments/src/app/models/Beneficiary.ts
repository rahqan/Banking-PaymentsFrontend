interface Beneficiary {
  beneficiaryId: number;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  relationShip: string;
  isActive:boolean;
  clientId : number;
}

export default Beneficiary;