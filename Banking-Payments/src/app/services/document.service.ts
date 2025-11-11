import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/document`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    // const token = localStorage.getItem('token');
    return new HttpHeaders({
      // 'Authorization': `Bearer ${token}`
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
   }
  uploadDocument(file: File, clientId: number, docType?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId.toString());
    if (docType) formData.append('docType', docType);

    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    console.log('Uploading:', { file, clientId, docType });
    console.log('File type:', file?.type, 'size:', file?.size);

    return this.http.post(`${this.apiUrl}/upload`, formData, { headers });
  }


  getDocumentById(documentId: number): Observable<{ data: Document }> {
    return this.http.get<{ data: Document }>(`${this.apiUrl}/${documentId}`, {
      headers: this.getHeaders()
    });
  }

  getDocumentsByClient(clientId: number): Observable<{ data: Document[]; count: number }> {
    return this.http.get<{ data: Document[]; count: number }>(
      `${this.apiUrl}/client/${clientId}`,
      { headers: this.getHeaders() }
    );
  }

  deleteDocument(documentId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${documentId}`, {
      headers: this.getHeaders()
    });
  }
}