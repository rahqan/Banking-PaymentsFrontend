// export interface Document {
//   documentId: number;
//   name: string;
//   url: string;
//   bankUserId: number;
//   clientId: number;
//   uploadedAt: Date;
//   docType?: string;
// }
export interface Document {
  documentId: number;
  name: string;
  url: string;
  bankUserId: number;
  clientId: number;
  uploadedAt: Date;
  docType?: string;
  uploadedByName?: string;  // ✅ Add this
  clientName?: string;       // ✅ Add this
}