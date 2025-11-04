import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/document`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  uploadDocument(file: File, clientId: number, docType?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId.toString());
    if (docType) {
      formData.append('docType', docType);
    }

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: this.getHeaders()
    });
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