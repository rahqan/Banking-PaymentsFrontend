export interface Document {
  documentId: number;
  name: string;
  url: string;
  bankUserId: number;
  clientId: number;
  uploadedAt: Date;
  docType?: string;
  uploadedByName?: string;
  clientName?: string;
}