export enum Role {
  SuperAdmin = 1,
  BankUser = 2,
  Client = 3
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


export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: number;
}
