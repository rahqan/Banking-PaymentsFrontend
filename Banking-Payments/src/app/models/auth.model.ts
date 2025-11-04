export enum Role {
  SuperAdmin = 0,
  BankUser = 1,
  Client = 2
}

export interface LoginRequest {
  username: string;
  password: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  role: Role;
  userId: number;
}

export interface RegisterClientRequest {
  clientCode: string;
  clientName: string;
  clientEmail: string;
  password: string;
  clientBusinessType: string;
  clientAddress: string;
  bankId: number;
  registerationNumber?: string;
}
