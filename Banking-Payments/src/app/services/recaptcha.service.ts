import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface RecaptchaVerifyRequest {
  token: string;
}

interface BaseResponseDTO<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private apiUrl = `${environment.apiUrl}/recaptcha`;

  constructor(private http: HttpClient) {}

  verifyRecaptcha(token: string): Observable<boolean> {
    const request: RecaptchaVerifyRequest = { token };
    
    return this.http.post<BaseResponseDTO<boolean>>(`${this.apiUrl}/verify`, request)
      .pipe(
        map(response => response.success && response.data === true)
      );
  }
}