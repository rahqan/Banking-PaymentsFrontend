export interface BankUserDTO {
  bankUserId: number;
  code: string;
  name: string;
  email: string;
  phoneNumber: string;
  bankId: number;
}

export interface CreateBankUserDTO {
  code: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  bankId: number;
}

export interface UpdateBankUserDTO {
  name: string;
  email: string;
  phoneNumber: string;
  bankId: number;
}